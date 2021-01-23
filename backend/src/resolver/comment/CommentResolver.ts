import {
  Arg,
  Query,
  Int,
  Mutation,
  Resolver,
  Ctx,
  FieldResolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../../types";

import { getConnection } from "typeorm";
import { Comment } from "../../entities/Comment";
import { CommentResponse } from "./types/CommentResponse";
import { valdiateComment } from "./validation/validateComment";
import { User } from "../../entities/User";
import { isAuth } from "../../middleware/isAuth";
import { Vote } from "../../entities/Vote";

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => User)
  creator(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(comment.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() comment: Comment,
    @Ctx() { voteLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }
    const vote = await voteLoader.load({
      postId: comment.id,
      userId: req.session.userId,
    });
    console.log(vote);
    return vote ? vote.score : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async voteComment(
    @Arg("id", () => Int) id: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const upvoteValue = value > 0 ? 1 : -1;
    const { userId } = req.session;
    const upvoteEntry = await Vote.findOne({
      where: { commentId: id, userId },
    });

    if (upvoteEntry && upvoteEntry.score !== upvoteValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
        update vote
        set score = $1
        where "commentId" = $2  and "userId" = $3`,
          [upvoteValue, id, userId]
        );

        await tm.query(
          `
            update comment
            set points = points + $1
            where id = $2
          `,
          [2 * upvoteValue, id]
        );
      });
    } else if (!upvoteEntry) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          insert into vote ("userId", "commentId", "score")
          values($1, $2, $3)
        `,
          [userId, id, upvoteValue]
        );
        await tm.query(
          `
          update comment
          set points = points + $1
          where id = $2
        `,
          [upvoteValue, id]
        );
      });
    }

    return true;
  }

  @Query(() => [Comment])
  async comments(
    @Arg("postId", () => Int, { nullable: true }) postId: number,
    @Arg("commentId", () => Int, { nullable: true }) commentId: number
  ): Promise<Comment[]> {
    if (postId)
      return await Comment.find({
        where: { postId: postId },
      });
    return await Comment.find({
      where: { id: commentId },
    });
  }

  @Query(() => Comment)
  async comment(@Arg("id", () => Int) id: number) {
    return await Comment.findOne({ id: id }, { relations: ["children"] });
  }

  @Mutation(() => Boolean)
  async deleteComment(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ) {
    await Comment.delete({ id: id, creatorId: req.session.userId });
    return true;
  }

  @Mutation(() => CommentResponse, { nullable: true })
  async updateComment(
    @Arg("commentId", () => Int) commentId: number,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ) {
    const errors = valdiateComment(text);
    if (errors) return { errors };
    const comment = await getConnection()
      .createQueryBuilder()
      .update(Comment)
      .set({ text })
      .where('id=:id and "creatorId"=:creatorId', {
        id: commentId,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return { comment: comment.raw[0] };
  }

  @Mutation(() => CommentResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("postId", () => Int, { nullable: true }) postId: number,
    @Arg("commentId", () => Int, { nullable: true }) commentId: number,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<CommentResponse> {
    const errors = valdiateComment(text);
    if (errors) return { errors };

    if (commentId) {
      const comment = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Comment)
        .values({
          creatorId: req.session.userId,
          parentId: commentId,
          text: text,
        })
        .returning("*")
        .execute();

      return { comment: comment.raw[0] };
    }
    const comment = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values({
        text: text,
        creatorId: req.session.userId,
        postId: postId,
      })
      .returning("*")
      .execute();
    return { comment: comment.raw[0] };
  }
}

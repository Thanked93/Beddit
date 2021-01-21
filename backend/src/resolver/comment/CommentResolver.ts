import { Post } from "../../entities/Post";
import {
  Arg,
  Query,
  Int,
  Mutation,
  Resolver,
  Ctx,
  FieldResolver,
  Root,
} from "type-graphql";
import { MyContext } from "../../types";

import { getConnection } from "typeorm";
import { Comment } from "../../entities/Comment";
import { CommentResponse } from "./types/CommentResponse";
import { valdiateComment } from "./validation/validateComment";
import { User } from "../../entities/User";

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => User)
  creator(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(comment.creatorId);
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
  async createComment(
    @Arg("postId", () => Int, { nullable: true }) postId: number,
    @Arg("commentId", () => Int, { nullable: true }) commentId: number,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<CommentResponse> {
    const errors = valdiateComment(text);
    if (errors) return { errors };
    let userId = req.session.userId;

    if (!userId) {
      userId = 1;
    }
    if (commentId) {
      const comment = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Comment)
        .values({
          creatorId: userId,
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
        creatorId: userId,
        postId: postId,
      })
      .returning("*")
      .execute();
    return { comment: comment.raw[0] };
  }
}

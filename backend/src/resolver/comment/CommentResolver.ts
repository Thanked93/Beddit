import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Comment } from "../../entities/Comment";
import { User } from "../../entities/User";
import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../types";
import { createComment } from "./mutations/createComment";
import { updateComment } from "./mutations/updateComment";
import { voteComment } from "./mutations/voteComments";
import { CommentResponse } from "./types/CommentResponse";

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
    return vote ? vote.score : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async voteComment(
    @Arg("id", () => Int) id: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    return await voteComment(id, req, value);
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
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ) {
    await Comment.delete({ id: id, creatorId: req.session.userId });
    return true;
  }

  @Mutation(() => CommentResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateComment(
    @Arg("commentId", () => Int) commentId: number,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ) {
    return await updateComment(commentId, text, req);
  }

  @Mutation(() => CommentResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("postId", () => Int, { nullable: true }) postId: number,
    @Arg("commentId", () => Int, { nullable: true }) commentId: number,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<CommentResponse> {
    return await createComment(text, req, postId, commentId);
  }
}

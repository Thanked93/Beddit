import { Post } from "../../entities/Post";
import {
  Arg,
  Query,
  Int,
  UseMiddleware,
  Mutation,
  Resolver,
  Ctx,
} from "type-graphql";
import { MyContext } from "../../types";

import { getConnection } from "typeorm";
import { Comment } from "../../entities/Comment";
import { CommentResponse } from "./types/CommentResponse";
import { valdiateComment } from "./validation/validateComment";

@Resolver()
export class CommentResolver {
  @Query(() => [Comment])
  async comment(@Arg("postId", () => Int) postId: number): Promise<Comment[]> {
    const comments = await Comment.find({ postId: postId });
    console.log(comments);

    return comments;
  }

  @Mutation(() => CommentResponse, { nullable: true })
  async createComment(
    @Arg("postId", () => Int, { nullable: true }) postId: number,
    @Arg("CommentId", () => Int, { nullable: true }) commentId: number,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<CommentResponse> {
    const errors = valdiateComment(text);
    if (errors) return { errors };
    let userId = req.session.userId;

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

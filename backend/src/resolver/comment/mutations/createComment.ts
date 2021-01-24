import { getConnection } from "typeorm";
import { Req } from "../../../types";
import { valdiateComment } from "../validation/validateComment";
import { Comment } from "../../../entities/Comment";
import { CommentResponse } from "../types/CommentResponse";

export async function createComment(
  text: string,
  req: Req,
  postId?: number,
  commentId?: number
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

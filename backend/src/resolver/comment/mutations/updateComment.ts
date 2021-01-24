import { getConnection } from "typeorm";
import { valdiateComment } from "../validation/validateComment";
import { Comment } from "../../../entities/Comment";
import { Req } from "../../../types";

export async function updateComment(commentId: number, text: string, req: Req) {
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

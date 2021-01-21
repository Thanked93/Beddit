import { Post } from "../../../entities/Post";
import { getConnection } from "typeorm";
import { Req } from "../../../types";
import { validateInput } from "../validation/validateInput";

export async function updatePost(
  id: number,
  title: string,
  text: string,
  req: Req
) {
  const errors = validateInput({title,text})
  if(errors) return {errors}
  const res = await getConnection()
    .createQueryBuilder()
    .update(Post)
    .set({ title, text })
    .where('id=:id and "creatorId"=:creatorId', {
      id: id,
      creatorId: req.session.userId,
    })
    .returning("*")
    .execute();
  return{ post:res.raw[0]}
}}

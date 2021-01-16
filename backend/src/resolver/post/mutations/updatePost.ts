import { Request } from "express";
import session from "express-session";
import { Post } from "src/entities/Post";
import { getConnection } from "typeorm";
import { Req } from "../../../types";

export async function updatePost(
  id: number,
  title: string,
  text: string,
  req: Req
) {
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
  return res.raw[0];
}

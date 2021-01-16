import { Post } from "../../../entities/Post";
import { getConnection } from "typeorm";
import { Req } from "../../../types";
import { PostInput } from "../types/PostInput";

export async function createPost(input: PostInput, req: Req) {
  const post = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Post)
    .values({
      title: input.title,
      text: input.text,
      creatorId: req.session.userId,
    })
    .returning("*")
    .execute();
  return post.raw[0];
}

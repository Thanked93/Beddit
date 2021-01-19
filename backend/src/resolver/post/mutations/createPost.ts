import { Post } from "../../../entities/Post";
import { getConnection } from "typeorm";
import { Req } from "../../../types";
import { PostInput } from "../types/PostInput";
import { validateInput } from "../validation/validateInput";

export async function createPost(input: PostInput, req: Req) {
  const errors = validateInput(input);
  console.log(errors, input);
  if (errors) return { errors };
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
  return { post: post.raw[0] };
}

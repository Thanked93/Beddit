import { Post } from "../../../entities/Post";
import { ObjectType, Field } from "type-graphql";
import { FieldError } from "../../user/types/FieldError";

@ObjectType()
export class PostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}

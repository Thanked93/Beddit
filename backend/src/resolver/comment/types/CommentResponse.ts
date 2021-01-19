import { FieldError } from "../../user/types/FieldError";
import { Field, ObjectType } from "type-graphql";
import { Comment } from "../../../entities/Comment";

@ObjectType()
export class CommentResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Comment, { nullable: true })
  comment?: Comment;
}

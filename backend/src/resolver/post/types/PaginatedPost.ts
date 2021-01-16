import { Field, ObjectType } from "type-graphql";
import { Post } from "../../../entities/Post";

@ObjectType()
export class PaginatedPost {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: Boolean;
}

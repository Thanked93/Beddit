import { InputType, Field } from "type-graphql";

@InputType()
export class UserInfo {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}

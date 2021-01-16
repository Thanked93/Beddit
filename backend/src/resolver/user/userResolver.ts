import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { User } from "../../entities/User";
import { MyContext } from "../../types";
import { changePassword } from "./mutations/changePassword";
import { forgotPassword } from "./mutations/forgotPassword";
import { login } from "./mutations/login";
import { logout } from "./mutations/logout";
import { register } from "./mutations/register";
import { UserInfo } from "./types/UserInfo";
import { UserResponse } from "./types/UserResponse";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    return await changePassword(token, newPassword, redis, req);
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    return await forgotPassword(email, redis);
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return await User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserInfo,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    return await register(options, req);
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    return await login(usernameOrEmail, password, req);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return logout(res, req);
  }
}

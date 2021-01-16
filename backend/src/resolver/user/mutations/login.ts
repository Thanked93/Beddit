import argon2 from "argon2";
import { User } from "../../../entities/User";
import { UserResponse } from "../types/UserResponse";
import { Req } from "../../../types";

export async function login(
  name: string,
  password: string,
  req: Req
): Promise<UserResponse> {
  const user = await User.findOne(
    name.includes("@")
      ? { where: { email: name } }
      : { where: { username: name } }
  );
  if (!user) {
    return {
      errors: [
        {
          field: "usernameOrEmail",
          message: "That username doesn't exist ",
        },
      ],
    };
  }
  const valid = await argon2.verify(user.password, password);
  if (!valid) {
    return {
      errors: [{ field: "password", message: "password invalid" }],
    };
  }

  req.session.userId = user.id;

  return {
    user,
  };
}

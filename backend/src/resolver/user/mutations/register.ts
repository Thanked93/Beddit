import { UserInfo } from "../types/UserInfo";
import { User } from "../../../entities/User";
import { getConnection } from "typeorm";
import { validateRegister } from "../validation/validateRegister";
import argon2 from "argon2";
import { Req } from "../../../types";

export async function register(options: UserInfo, req: Req) {
  const errors = validateRegister(options);
  if (errors) return { errors };
  const hashedPw = await argon2.hash(options.password);
  let user;
  try {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username: options.username,
        email: options.email,
        password: hashedPw,
      })
      .returning("*")
      .execute();

    user = result.raw[0];
  } catch (err) {
    if (err.code === "23505" || err.detail.includes("already exists")) {
      //duplicate userkey
      return {
        errors: [
          {
            field: "username",
            message: "Username has already been taken",
          },
        ],
      };
    }
  }
  req.session.userId = user.id;
  return { user };
}

import { Redis } from "ioredis";
import { User } from "../../../entities/User";
import { FORGET_PASSWORD_PREFIX } from "../../../constants";
import argon2 from "argon2";
import { Req } from "../../../types";

export async function changePassword(
  token: string,
  nPassword: string,
  redis: Redis,
  req: Req
) {
  if (nPassword.length <= 4) {
    return {
      errors: [
        {
          field: "newPassword",
          message: "length must be greater than 4",
        },
      ],
    };
  }
  const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
  if (!userId) {
    return {
      errors: [
        {
          field: "token",
          message: "token expired",
        },
      ],
    };
  }
  const user = await User.findOne(parseInt(userId));
  if (!user) {
    return {
      errors: [
        {
          field: "token",
          message: "User no longer exists",
        },
      ],
    };
  }
  await User.update(
    { id: user.id },
    { password: await argon2.hash(nPassword) }
  );

  redis.del(FORGET_PASSWORD_PREFIX + token);

  req.session.userId = user.id;

  return { user };
}

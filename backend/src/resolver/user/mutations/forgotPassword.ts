import { Redis } from "ioredis";
import { sendEmail } from "../../../utils/sendEmail";
import { v4 } from "uuid";
import { FORGET_PASSWORD_PREFIX } from "../../../constants";
import { User } from "../../../entities/User";

export async function forgotPassword(email: string, redis: Redis) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return true;
  }
  const token = v4();
  await redis.set(
    FORGET_PASSWORD_PREFIX + token,
    user.id,
    "ex",
    1000 * 60 * 60 * 24 * 3
  );
  sendEmail(
    email,
    `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
  );
  return true;
}

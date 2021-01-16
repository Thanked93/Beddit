import { UserInfo } from "../types/UserInfo";
import { validatePassword } from "./validatePassword";

export const validateRegister = (options: UserInfo) => {
  if (options.email.length <= 5 && !options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email",
      },
    ];
  }

  if (options.username.length < 4) {
    return [
      {
        field: "username",
        message: "length must be greater than 3",
      },
    ];
  }
  const vPassword = validatePassword(options.password);
  if (vPassword) return vPassword;
  return null;
};

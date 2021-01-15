import { UsernamePasswordInput } from "src/resolver/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.email.length <= 5 && !options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email",
      },
    ];
  }

  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }
  if (options.password.length <= 3) {
    return [
      {
        field: "password",
        message: "length must be greater than 2",
      },
    ];
  }
  return null;
};

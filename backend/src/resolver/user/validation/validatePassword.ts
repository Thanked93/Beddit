export const validatePassword = (password: string) => {
  if (password.length < 4) {
    return [
      {
        field: "password",
        message: "length must be greater than 3",
      },
    ];
  }
  return null;
};

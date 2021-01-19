import { PostInput } from "../types/PostInput";

export const validateInput = (input: PostInput) => {
  if (input.title.length < 5) {
    return [
      {
        field: "title",
        message: "The title length must be at least 5 characters long.",
      },
    ];
  }
  if (input.title.length > 20) {
    return [
      {
        field: "title",
        message: "The title length cannot be longer than 20 characters.",
      },
    ];
  }
  if (input.text.length < 5) {
    return [
      {
        field: "text",
        message: "The text length must be at least 5 characters long",
      },
    ];
  }

  return null;
};

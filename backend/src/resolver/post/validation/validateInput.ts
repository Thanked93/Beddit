import { PostInput } from "../types/PostInput";

export const validateInput = (input: PostInput) => {
  const returnValue: any[] = [];
  if (input.title.length < 5) {
    returnValue.push({
      field: "title",
      message: "The title length must be at least 5 characters long.",
    });
  } else if (input.title.length > 50) {
    returnValue.push({
      field: "title",
      message: "The title length cannot be longer than 50 characters.",
    });
  }
  if (input.text.length < 5) {
    returnValue.push({
      field: "text",
      message: "The text length must be at least 5 characters long",
    });
  } else if (input.text.length > 5500) {
    returnValue.push({
      field: "text",
      message: "Please dont make such a big post. My cat wont read it",
    });
  }
  if (returnValue.length > 0) return returnValue;
  return null;
};

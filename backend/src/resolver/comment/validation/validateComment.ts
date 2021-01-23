export const valdiateComment = (text: string) => {
  if (text.length < 5) {
    return [
      {
        field: "text",
        message: "The Comment needs to be at least 5 characters long",
      },
    ];
  }
  if (text.length > 5500) {
    return [
      {
        field: "text",
        message: "The comment is way to long",
      },
    ];
  }

  return null;
};

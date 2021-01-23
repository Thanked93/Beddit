import { EditIcon } from "@chakra-ui/icons";
import { IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

interface EditButtonProps {
  id: number;
  isPost: boolean;
}

export const EditButton: React.FC<EditButtonProps> = ({ id, isPost }) => {
  return (
    <NextLink
      href={isPost ? "/post/edit/[id]" : "/post/comment/edit/[id]"}
      as={isPost ? `/post/edit/${id}` : `/post/comment/edit/${id}`}
    >
      <IconButton
        as={Link}
        aria-label="Edit Post"
        size={"sm"}
        icon={<EditIcon />}
      />
    </NextLink>
  );
};

export default EditButton;

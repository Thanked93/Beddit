import React from "react";
import { Box, IconButton, Link } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
interface ReplyButtonProps {
  id: number;
  isPost: boolean;
}

export const ReplyButton: React.FC<ReplyButtonProps> = ({ id, isPost }) => {
  if (isPost) {
    return (
      <NextLink href="/post/comment/[id]" as={`/post/comment/${id}`}>
        <IconButton aria-label="comment" size={"sm"} icon={<ChatIcon />} />
      </NextLink>
    );
  }

  return (
    <NextLink href="/post/comment/sub/[id]" as={`/post/comment/sub/${id}`}>
      <IconButton aria-label="comment" size={"sm"} icon={<ChatIcon />} />
    </NextLink>
  );
};

export default ReplyButton;

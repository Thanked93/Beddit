import React from "react";
import { Box, IconButton, Link } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
interface ReplyButtonProps {
  postId: number;
  commentId?: number;
}

export const ReplyButton: React.FC<ReplyButtonProps> = ({ postId }) => {
  return (
    <NextLink href="/post/comment/[id]" as={`/post/comment/${postId}`}>
      <IconButton aria-label="comment" icon={<ChatIcon />} />
    </NextLink>
  );
};

export default ReplyButton;

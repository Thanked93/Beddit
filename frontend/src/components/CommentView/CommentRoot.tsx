import { Flex, StackDivider, VStack, Text, Box } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useCommentsQuery } from "../../generated/graphql";

import { CommentView } from "./CommentView";

interface CommentRootProps {
  postId: number;
  userId: number;
}

export const CommentRoot: React.FC<CommentRootProps> = ({ postId, userId }) => {
  const { data } = useCommentsQuery({
    skip: postId === -1,
    variables: {
      postId: postId,
    },
  });

  // Not Comments => nothing to return
  if (!data?.comments) {
    return null;
  }

  return (
    <VStack
      mt={4}
      p={5}
      mb="10"
      divider={<StackDivider borderColor="green.4000" size="lg" />}
      spacing={4}
      align="stretch"
      border="2px"
      borderColor="gray"
    >
      {data.comments.length === 0 ? (
        <Flex justifyContent="center">
          <Text fontWeight={800} mr={3}>
            <NextLink href={`/post/comment/${postId}`}>
              Be the first one who comments
            </NextLink>
          </Text>
        </Flex>
      ) : (
        data.comments.map((comment) => {
          return (
            <CommentView
              key={`comment-${comment.id}`}
              id={comment.id}
              userId={userId}
              depth={0}
            />
          );
        })
      )}
    </VStack>
  );
};

export default CommentRoot;

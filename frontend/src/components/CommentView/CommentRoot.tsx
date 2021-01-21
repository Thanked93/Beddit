import { Flex, Stack, StackDivider, VStack } from "@chakra-ui/react";
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
      p={5}
      divider={<StackDivider borderColor="red.2000" />}
      spacing={4}
      align="stretch"
    >
      <Flex flexDirection="column">
        {data.comments.map((comment) => {
          return (
            <CommentView
              key={`root-${comment.id}`}
              id={comment.id}
              userId={userId}
              depth={0}
            />
          );
        })}
      </Flex>
    </VStack>
  );
};

export default CommentRoot;

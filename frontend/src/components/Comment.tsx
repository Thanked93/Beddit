import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { useCommentQuery } from "../generated/graphql";

interface CommentProps {
  singlePostId: number;
}

export const Comment: React.FC<CommentProps> = ({ singlePostId }) => {
  const { data, loading } = useCommentQuery({
    skip: singlePostId === -1,
    variables: {
      postId: singlePostId,
    },
  });

  if (!data?.comment && loading) {
    return <div>Hello</div>;
  }

  return (
    <Stack mt={5} mb={10}>
      {data.comment.map((com) => {
        return (
          <Flex
            key={com.id}
            flexDirection="column"
            border={"1px"}
            borderColor={"#8a948d"}
            minH="85px"
          >
            <Heading size="sm">{com.creatorId}</Heading>
            <Box mx={3} mt={3} size="md">
              {com.text}
            </Box>
          </Flex>
        );
      })}
    </Stack>
  );
};

export default Comment;

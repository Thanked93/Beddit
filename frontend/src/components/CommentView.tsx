import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { Comment, useCommentQuery } from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";
import ButtonPair from "./ButtonPair";

interface CommentProps {
  singlePostId: number;
}

export const CommentView: React.FC<CommentProps> = ({ singlePostId }) => {
  const { data, loading } = useCommentQuery({
    skip: singlePostId === -1,
    variables: {
      postId: singlePostId,
    },
  });

  if (!data?.comment) {
    return null;
  }

  if (!data?.comment && loading) {
    return null;
  }

  return (
    <Stack mt={5} mb={10}>
      {data.comment.map((com: Comment) => {
        return (
          <Flex
            key={com.id}
            flexDirection="column"
            border={"1px"}
            borderColor={"#8a948d"}
            minH="85px"
          >
            <Heading size="sm">{com.creator.username}</Heading>
            <Box mx={3} mt={3} size="md">
              {com.text}
            </Box>
            <ButtonPair />
          </Flex>
        );
      })}
    </Stack>
  );
};

export default hocApollo({ ssr: false })(CommentView);

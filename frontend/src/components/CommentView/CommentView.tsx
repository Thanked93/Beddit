import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useCommentQuery, useCommentsQuery } from "../../generated/graphql";
import { hocApollo } from "../../utils/myapollo";
import ButtonContainer from "../customButtons/ButtonContainer";
import NotFoundError from "../NotFoundError";

interface CommentViewProps {
  id: number;
  userId: number;
  depth: number;
}

export const CommentView: React.FC<CommentViewProps> = ({
  id,
  userId,
  depth,
}) => {
  const { data } = useCommentQuery({
    variables: {
      id: id,
    },
  });

  if (!data?.comment) {
    return null;
  }

  return (
    <Box ml={Math.min(depth * 5, 50)}>
      <Box left={0} top={10}>
        <Text>posted by {data.comment.creator.username}</Text>
      </Box>
      <Box>{data.comment.text}</Box>
      <ButtonContainer
        userId={userId}
        creatorId={data.comment.creator.id}
        id={data.comment.id}
        isPost={false}
      />
      {data.comment.children.map(({ id: childId }) => {
        return (
          <CommentView
            key={`child-${childId}`}
            id={childId}
            userId={userId}
            depth={depth + 1}
          />
        );
      })}
    </Box>
  );
};

export default hocApollo({ ssr: false })(CommentView);

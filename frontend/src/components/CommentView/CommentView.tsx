import { Box, Flex, StackDivider, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useCommentQuery, useCommentsQuery } from "../../generated/graphql";
import { hocApollo } from "../../utils/myapollo";
import ButtonContainer from "../customButtons/ButtonContainer";
import NotFoundError from "../NotFoundError";
import Vote from "../Vote";

interface CommentViewProps {
  id: number;
  userId: number;
  depth: number;
  idx?: number;
}

export const CommentView: React.FC<CommentViewProps> = ({
  id,
  userId,
  depth,
  idx,
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
    <Flex mt="2" ml={depth * 0.2 * 5} flexDirection="column">
      <Box bg={(idx ? idx : depth) % 2 === 1 ? "rgb(240,240,240)" : "white"}>
        <Box>
          <Text fontSize="sm">posted by {data.comment.creator.username}</Text>
          <Vote comment={data.comment} userId={userId} />
        </Box>
        <Flex mt="3">
          <Text mx={1}>{data.comment.text}</Text>
        </Flex>
        <Flex paddingBottom={1} mr={1} justifyContent="flex-end">
          <ButtonContainer
            userId={userId}
            creatorId={data.comment.creator.id}
            id={data.comment.id}
            isPost={false}
          />
        </Flex>
      </Box>

      {data.comment.children.map(({ id: childId }, idx: number) => {
        return (
          <VStack
            divider={<StackDivider borderColor="green.4000" />}
            spacing={3}
            align="stretch"
          >
            <Box>
              <CommentView
                key={`comment-child-${childId}`}
                id={childId}
                userId={userId}
                depth={depth + 1}
                idx={idx + depth + 1}
              />
            </Box>
          </VStack>
        );
      })}
    </Flex>
  );
};

export default hocApollo({ ssr: false })(CommentView);

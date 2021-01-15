import React, { useState } from "react";
import {
  Link,
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";

interface VoteProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });
  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      fragment: gql`
      id:"Post:"+postId,
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { id: postId, points: newPoints, voteStatus: value } as any,
    });
  }
};

export const Vote: React.FC<VoteProps> = ({ post }) => {
  const [vote] = useVoteMutation();
  const [loading, setLoading] = useState<
    "loading-Up" | "loading-Down" | "not-loading"
  >("not-loading");
  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      <IconButton
        ml={2}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        aria-label="upvote"
        icon={<ChevronUpIcon />}
        isLoading={loading === "loading-Up"}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoading("loading-Up");
          await vote({
            variables: {
              postId: post.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });

          setLoading("not-loading");
        }}
      />
      {post.points}
      <IconButton
        ml={2}
        aria-label="downvote"
        icon={<ChevronDownIcon />}
        isLoading={loading === "loading-Down"}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoading("loading-Down");
          await vote({
            variables: {
              postId: post.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoading("not-loading");
        }}
      />
    </Flex>
  );
};

export default hocApollo({ ssr: false })(Vote);

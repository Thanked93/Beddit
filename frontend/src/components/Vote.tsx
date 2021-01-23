import { ApolloCache } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import gql from "graphql-tag";
import React, { useState } from "react";
import {
  Comment,
  PostSnippetFragment,
  useVoteCommentMutation,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";

interface VoteProps {
  post: PostSnippetFragment;
  comment: Comment;
  userId: number;
}

const updateAfterVote = (
  value: number,
  isPost: boolean,
  id: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: isPost ? "Post:" + id : "Comment:" + id,
    fragment: isPost
      ? gql`
          fragment _ on Post {
            id
            points
            voteStatus
          }
        `
      : gql`
          fragment _ on Comment {
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
      id: isPost ? "Post:" + id : "Comment:" + id,

      fragment: isPost
        ? gql`
            fragment __ on Post {
              points
              voteStatus
            }
          `
        : gql`
            fragment __ on Comment {
              points
              voteStatus
            }
          `,
      data: { id: id, points: newPoints, voteStatus: value } as any,
    });
  }
};

export const Vote: React.FC<VoteProps> = ({ post, userId, comment }) => {
  const [vote] = post ? useVoteMutation() : useVoteCommentMutation();
  const [loading, setLoading] = useState<
    "loading-Up" | "loading-Down" | "not-loading"
  >("not-loading");

  return (
    <Flex ml="auto" right={0} justifyContent="center" alignItems="center">
      <IconButton
        ml={2}
        size="sm"
        mr={3}
        colorScheme={colored(1, post, comment) ? "green" : undefined}
        aria-label="upvote"
        icon={<ChevronUpIcon />}
        isLoading={loading === "loading-Up"}
        disabled={userId === -1}
        onClick={async () => {
          if (
            post
              ? post.voteStatus === 1
              : comment.voteStatus === 1 || userId === -1
          ) {
            return;
          }
          setLoading("loading-Up");
          await vote({
            variables: {
              id: post ? post.id : comment.id,
              value: 1,
            },
            update: (cache) =>
              updateAfterVote(
                1,
                post ? true : false,
                post ? post.id : comment.id,
                cache
              ),
          });

          setLoading("not-loading");
        }}
      />
      <Box fontSize="l">{post ? post.points : comment.points}</Box>
      <IconButton
        ml={3}
        size="sm"
        aria-label="downvote"
        icon={<ChevronDownIcon />}
        isLoading={loading === "loading-Down"}
        colorScheme={colored(-1, post, comment) ? "red" : undefined}
        disabled={userId === -1}
        onClick={async () => {
          if (
            post
              ? post.voteStatus === -1
              : comment.voteStatus === -1 || userId === -1
          ) {
            return;
          }
          setLoading("loading-Down");
          await vote({
            variables: {
              id: post ? post.id : comment.id,
              value: -1,
            },
            update: (cache) => {
              updateAfterVote(
                -1,
                post ? true : false,
                post ? post.id : comment.id,
                cache
              );
            },
          });
          setLoading("not-loading");
        }}
      />
    </Flex>
  );
};

export default hocApollo({ ssr: false })(Vote);

const colored = (
  num: number,
  post?: PostSnippetFragment,
  comment?: Comment
) => {
  if (post) {
    return post.voteStatus === num;
  }
  return comment?.voteStatus === num;
};

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import CommentRoot from "../../components/CommentView/CommentRoot";
import ButtonContainer from "../../components/customButtons/ButtonContainer";
import ItemWrapper from "../../components/layout/ItemWrapper";
import Layout from "../../components/layout/Layout";
import NotFoundError from "../../components/NotFoundError";
import Vote from "../../components/Vote";
import { useMeQuery, useSinglePostQuery } from "../../generated/graphql";
import { hocApollo } from "../../utils/myapollo";
import { UseIdFromUrl } from "../../utils/useIdFromUrl";

export const Post = ({}) => {
  const singlePostId = UseIdFromUrl();
  const { data: meData } = useMeQuery();
  const { data, loading } = useSinglePostQuery({
    skip: singlePostId === -1,
    variables: {
      id: singlePostId,
    },
  });

  if (loading) {
    return (
      <Layout>
        <div>loading fast...</div>
      </Layout>
    );
  }
  if (!data.singlePost) {
    return <NotFoundError />;
  }

  return (
    <Layout>
      <ItemWrapper>
        <Flex flexDirection="column" mx={8}>
          <Heading mb={4}>{data.singlePost.title}</Heading>
          <Vote
            post={data.singlePost}
            userId={meData?.me ? meData.me.id : -1}
          />
        </Flex>

        <Text>{data.singlePost.text}</Text>
        <Flex align="center">
          <Flex ml={0}>posted by {data.singlePost.creator.username}</Flex>
          <Flex ml="auto" mr={10}>
            <ButtonContainer
              id={data.singlePost.id}
              creatorId={data.singlePost.creator.id}
              isPost={true}
              userId={meData?.me ? meData.me.id : -1}
            />
          </Flex>
        </Flex>
      </ItemWrapper>
      <CommentRoot
        postId={singlePostId}
        userId={meData?.me ? meData.me.id : -1}
      />
    </Layout>
  );
};

export default hocApollo({ ssr: true })(Post);

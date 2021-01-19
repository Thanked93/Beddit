import { Box, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import ButtonPair from "../../components/ButtonPair";
import Layout from "../../components/Layout";
import { useCommentQuery, useSinglePostQuery } from "../../generated/graphql";
import { hocApollo } from "../../utils/myapollo";
import { UseIdFromUrl } from "../../utils/useIdFromUrl";
import Comment from "../../components/Comment";

export const Post = ({}) => {
  const singlePostId = UseIdFromUrl();
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
    return (
      <Layout>
        <Box>The requested Post could not be found.</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data.singlePost.title}</Heading>
      {data.singlePost.text}
      <ButtonPair
        id={data.singlePost.id}
        creatorId={data.singlePost.creator.id}
      />
      <Comment singlePostId={singlePostId} />
    </Layout>
  );
};

export default hocApollo({ ssr: true })(Post);

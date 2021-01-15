import React from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { useSinglePostQuery } from "../../generated/graphql";
import { withUrqlClient } from "next-urql";
import Layout from "../../components/Layout";
import { Box, Heading } from "@chakra-ui/react";
import { UseIdFromUrl } from "../../utils/useIdFromUrl";
import ButtonPair from "../../components/ButtonPair";
import { hocApollo } from "../../utils/myapollo";

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
    </Layout>
  );
};

export default hocApollo({ ssr: true })(Post);

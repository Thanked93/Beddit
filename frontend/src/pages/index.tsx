import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import ButtonPair from "../components/ButtonPair";
import Layout from "../components/Layout";
import Vote from "../components/Vote";
import { usePostsQuery } from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";

const Index = () => {
  const { data, loading, variables, fetchMore } = usePostsQuery({
    variables: { limit: 15, cursor: null as null | string },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <Flex>
        <Box>
          <Heading fontSize="l">Something went Wrong...</Heading>
        </Box>
      </Flex>
    );
  }

  return (
    <Layout>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack mt={10} mb={5} spacing={8}>
          {data!.posts.posts.map((post) =>
            !post ? null : (
              <Box key={post.id} p={5} shadow="md" borderWidth="2px">
                <Flex>
                  <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text right={0} ml="auto" fontSize={15}>
                    posted By {post.creator.username}
                  </Text>
                </Flex>
                <Vote post={post} />
                <ButtonPair id={post.id} creatorId={post.creator.id} />

                <Text>{post.textSnippet}...</Text>
              </Box>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            m="auto"
            my={9}
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              });
            }}
          >
            load more...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};
export default hocApollo({ ssr: true })(Index);

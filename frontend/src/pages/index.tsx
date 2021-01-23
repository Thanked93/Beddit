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
import ButtonContainer from "../components/customButtons/ButtonContainer";
import Layout from "../components/layout/Layout";
import NotFoundError from "../components/NotFoundError";
import Vote from "../components/Vote";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";
import { Orderby, sortByCriteria } from "../utils/sortByCriteria";

const Index = () => {
  const { data, loading, variables, fetchMore } = usePostsQuery({
    variables: { limit: 15, cursor: null as null | string },
    notifyOnNetworkStatusChange: true,
  });

  const { data: meData } = useMeQuery();

  if (!loading && !data) {
    return <NotFoundError />;
  }

  return (
    <Layout>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack mt={10} mb={5} spacing={8}>
          {data.posts.posts.map((post) =>
            !post ? null : (
              <Box key={post.id} p={5} shadow="md" borderWidth="2px">
                <Flex alignItems="center">
                  <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="lg">
                        {post.title.slice(0, 10)}...
                      </Heading>
                    </Link>
                  </NextLink>
                  <Text ml={2} fontSize={"sm"}>
                    by {post.creator.username}
                  </Text>

                  <Vote post={post} userId={meData?.me ? meData.me.id : -1} />
                </Flex>
                <Flex mt={3} align="center">
                  <Text fontSize="sm">{post.textSnippet}...</Text>
                  <Box ml="auto" mr={0} mt="auto" mb="0">
                    <ButtonContainer
                      id={post.id}
                      creatorId={post.creator.id}
                      isPost={true}
                      userId={meData?.me ? meData.me.id : -1}
                    />
                  </Box>
                </Flex>
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

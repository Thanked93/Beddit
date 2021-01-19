import React from "react";
import { Box, Link, Flex, Button, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import { hocApollo } from "../utils/myapollo";

export const NavBar = () => {
  const router = useRouter();
  const [logout, { loading: logoutloading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  let body = <></>;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <Flex ml="auto" justifyContent="space-around">
        <Box mr={6}>
          <NextLink href="/login">Login</NextLink>
        </Box>
        <Box paddingRight={30}>
          <NextLink href="/register">Register</NextLink>
        </Box>
      </Flex>
    );
  } else {
    body = (
      <Flex ml="auto" align="center">
        <NextLink href="/create-post">
          <Button mr={10}>Create Post</Button>
        </NextLink>
        <Box mr={2}>Hello {data.me.username}</Box>
        <Button
          variant="link"
          isLoading={logoutloading}
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="#8a948d" p={4}>
      <Flex flex={1} m="auto" maxW={800} align="center">
        <NextLink href="/">
          <Link>
            <Heading>Beddit</Heading>
          </Link>
        </NextLink>

        {body}
      </Flex>
    </Flex>
  );
};

export default hocApollo({ ssr: false })(NavBar);

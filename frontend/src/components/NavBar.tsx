import { useApolloClient } from "@apollo/client";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import { default as NavLink, default as NextLink } from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { hocApollo } from "../utils/myapollo";

export const NavBar = () => {
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
        <NavLink href="/post/create">
          <Button>Create Post</Button>
        </NavLink>
        <Button
          ml={3}
          mr={8}
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
    <Flex zIndex={1} position="sticky" top={0} bg="#8a948d" p={"3vmin"}>
      <Flex flex={1} m="auto" minW={320} maxW={800} align="center">
        <NextLink href="/">
          <Heading as={Link}>Beddit</Heading>
        </NextLink>
        {body}
      </Flex>
    </Flex>
  );
};

export default hocApollo({ ssr: false })(NavBar);

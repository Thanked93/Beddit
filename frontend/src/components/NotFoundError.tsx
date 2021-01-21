import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import ItemWrapper from "./layout/ItemWrapper";
import Layout from "./layout/Layout";

export const NotFoundError: React.FC = () => {
  const router = useRouter();

  return (
    <Layout variant="regular">
      <ItemWrapper>
        <Flex flexDirection="column">
          <Heading size="l">
            My cat would say it's the wrong spot for petting...
          </Heading>
          <br />
          <Flex justifyContent="center">Do you want to stay here forever?</Flex>
          <br />
          <Button
            width={"auto"}
            mx="auto"
            variant="solid"
            onClick={() => router.back()}
          >
            take me back
          </Button>
        </Flex>
      </ItemWrapper>
    </Layout>
  );
};

export default NotFoundError;

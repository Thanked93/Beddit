import React from "react";
import { Box, Flex } from "@chakra-ui/react";

interface ItemWrapperProps {}

export const ItemWrapper: React.FC<ItemWrapperProps> = ({ children }) => {
  return (
    <Flex justifyContent="center">
      <Flex
        width="60vw"
        minW={"320px"}
        height="auto"
        bgColor="white"
        border="2px"
        borderRadius="5vw"
        borderColor="#8a948d"
        opacity={1.0}
        flexDirection="column"
        justifyContent="center"
      >
        <Flex mx="auto" my={5} justifyContent="center">
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ItemWrapper;

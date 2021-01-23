import React from "react";
import { IconButton, Box, Flex } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

interface ItemWrapperProps {}

export const ItemWrapper: React.FC<ItemWrapperProps> = ({ children }) => {
  const router = useRouter();
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
        <Flex ml="auto" mr="4vmin" mt="5">
          <IconButton
            aria-label="go  back"
            icon={<CloseIcon />}
            onClick={() => router.back()}
          />
        </Flex>
        <Flex mx="auto" my={5} justifyContent="center">
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ItemWrapper;

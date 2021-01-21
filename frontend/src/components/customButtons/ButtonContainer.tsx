import { Flex } from "@chakra-ui/react";
import React from "react";
import { useMeQuery } from "../../generated/graphql";
import { hocApollo } from "../../utils/myapollo";
import { DeleteButton } from "./DeleteButton";
import EditButton from "./EditButton";
import ReplyButton from "./ReplyButton";

interface ButtonContainerProps {
  id: number;
  creatorId: number;
  isPost: boolean;
  userId: number;
}

export const ButtonContainer: React.FC<ButtonContainerProps> = ({
  id,
  creatorId,
  isPost,
  userId,
}) => {
  //Not found => No buttons | permisson to modify
  if (userId === -1) {
    return null;
  }

  // Not creator but logged in => reply permisson
  if (userId !== creatorId) {
    return (
      <Flex ml={1} flexDirection="row">
        <ReplyButton isPost={isPost} id={id} />
      </Flex>
    );
  }

  // Creator of the item => all crud-operations allowed
  return (
    <Flex ml={1} flexDirection="row">
      <EditButton id={id} isPost={isPost} />
      <DeleteButton id={id} isPost={isPost} />
      <ReplyButton id={id} isPost={isPost} />
    </Flex>
  );
};

export default hocApollo({ ssr: false })(ButtonContainer);

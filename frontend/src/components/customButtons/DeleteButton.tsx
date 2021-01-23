import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { Router } from "express";
import { useRouter } from "next/router";
import React from "react";
import {
  useDeleteCommentMutation,
  useDeletePostMutation,
} from "../../generated/graphql";
import { hocApollo } from "../../utils/myapollo";

interface DeleteButtonProps {
  id: number;
  isPost: boolean;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ isPost, id }) => {
  const [deleteItem] = isPost
    ? useDeletePostMutation()
    : useDeleteCommentMutation();

  const router = useRouter();
  // if the user does not own the post he cannot delete

  return (
    <IconButton
      aria-label="delete Item"
      size={"sm"}
      icon={<DeleteIcon />}
      onClick={() => {
        deleteItem({
          variables: { id },
          update: (cache) => {
            cache.evict({ id: `${isPost ? "Post:" : "Comment:"}` + id });
          },
        });
        isPost ? router.push("/") : null;
      }}
    ></IconButton>
  );
};

export default hocApollo({ ssr: false })(DeleteButton);

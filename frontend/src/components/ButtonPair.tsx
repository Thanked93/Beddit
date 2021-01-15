import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";

interface ButtonPairProps {
  id: number;
  creatorId: number;
}

export const ButtonPair: React.FC<ButtonPairProps> = ({ id, creatorId }) => {
  const [deletePost] = useDeletePostMutation();
  const { data: meData } = useMeQuery();

  if (!meData?.me) {
    return null;
  }

  if (meData.me.id !== creatorId) {
    return null;
  }

  return (
    <Box ml="auto">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton as={Link} aria-label="Edit Post" icon={<EditIcon />} />
      </NextLink>
      <IconButton
        aria-label="Delete Post"
        icon={<DeleteIcon />}
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
      />
    </Box>
  );
};

export default hocApollo({ ssr: false })(ButtonPair);

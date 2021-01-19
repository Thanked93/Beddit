import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";
import ReplyButton from "./customButtons/ReplyButton";

interface ButtonPairProps {
  id: number;
  creatorId: number;
}

export const ButtonPair: React.FC<ButtonPairProps> = ({ id, creatorId }) => {
  const [deletePost] = useDeletePostMutation();
  const { data: meData } = useMeQuery();
  const router = useRouter();

  if (!meData?.me) {
    return null;
  }

  if (meData.me.id !== creatorId) {
    return (
      <Box>
        <ReplyButton postId={id} />
      </Box>
    );
  }

  return (
    <Flex ml={1} flexDirection="row">
      <Box>
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
            router.push("/");
          }}
        />
        <ReplyButton postId={id} />
      </Box>
    </Flex>
  );
};

export default hocApollo({ ssr: false })(ButtonPair);

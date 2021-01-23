import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../../components/InputField";
import ItemWrapper from "../../../components/layout/ItemWrapper";
import Layout from "../../../components/layout/Layout";
import NotFoundError from "../../../components/NotFoundError";
import {
  useCreateCommentMutation,
  useSinglePostQuery,
} from "../../../generated/graphql";
import { hocApollo } from "../../../utils/myapollo";
import { toErrorMap } from "../../../utils/toErrorMap";
import { UseIdFromUrl } from "../../../utils/useIdFromUrl";
import { useIsAuth } from "../../../utils/useIsAuth";

interface createCommentProps {}

export const CreateComment: React.FC<createCommentProps> = () => {
  const [createComment] = useCreateCommentMutation();
  const postId = UseIdFromUrl();
  const router = useRouter();
  const { data, loading } = useSinglePostQuery({
    skip: postId === -1,
    variables: {
      id: postId,
    },
  });

  useIsAuth();

  if (loading) {
    return (
      <Box>
        <Heading>Loading fast...</Heading>
      </Box>
    );
  }

  if (!data?.singlePost) {
    return <NotFoundError />;
  }

  return (
    <Layout variant="regular">
      <ItemWrapper>
        <Box mx="5vmin" my={"3vmin"}>
          <Heading>{data.singlePost.title}</Heading>
          <Box mt={5}>{data.singlePost.text}</Box>

          <Formik
            initialValues={{ text: "" }}
            onSubmit={async ({ text }, { setErrors }) => {
              const response = await createComment({
                variables: { postId, text },
                update: (cache) => {
                  cache.evict({ fieldName: "comments" });
                },
              });

              if (response.data.createComment?.errors) {
                setErrors(toErrorMap(response.data.createComment.errors));
              } else {
                router.back();
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box mt={4}>
                  <InputField
                    isTextarea
                    name="text"
                    placeholder="text..."
                    label="Comment"
                    size={3}
                  />
                </Box>

                <Button mt={6} type="submit" isLoading={isSubmitting}>
                  {" "}
                  create Comment{" "}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </ItemWrapper>
    </Layout>
  );
};

export default hocApollo({ ssr: false })(CreateComment);

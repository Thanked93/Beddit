import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useCommentQuery } from "../../../../generated/graphql";
import InputField from "../../../../components/InputField";
import Layout from "../../../../components/layout/Layout";
import NotFoundError from "../../../../components/NotFoundError";
import { useCreateCommentMutation } from "../../../../generated/graphql";
import { hocApollo } from "../../../../utils/myapollo";
import { toErrorMap } from "../../../../utils/toErrorMap";
import { UseIdFromUrl } from "../../../../utils/useIdFromUrl";
import { useIsAuth } from "../../../../utils/useIsAuth";

interface createCommentProps {}

export const CreateComment: React.FC<createCommentProps> = () => {
  const [createComment] = useCreateCommentMutation();
  const commentId = UseIdFromUrl();
  const router = useRouter();
  const { data, loading } = useCommentQuery({
    skip: commentId === -1,
    variables: {
      id: commentId,
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

  if (!data?.comment) {
    return <NotFoundError />;
  }

  return (
    <Layout variant="regular">
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
          <Box mx="5vmin" my={"3vmin"}>
            <Box mt={5}>{data.comment.text}</Box>

            <Formik
              initialValues={{ text: "" }}
              onSubmit={async ({ text }, { setErrors }) => {
                const response = await createComment({
                  variables: { commentId, text },
                  update: (cache) => cache.evict({ fieldName: "comments" }),
                });

                if (response.data.createComment?.errors) {
                  setErrors(toErrorMap(response.data.createComment.errors));
                } else {
                  console.log("here");
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
                      size={4}
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
        </Flex>
      </Flex>
    </Layout>
  );
};

export default hocApollo({ ssr: false })(CreateComment);

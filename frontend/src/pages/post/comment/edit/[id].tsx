import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../../../components/InputField";
import ItemWrapper from "../../../../components/layout/ItemWrapper";
import Layout from "../../../../components/layout/Layout";
import {
  useCommentQuery,
  useUpdateCommentMutation,
} from "../../../../generated/graphql";
import { hocApollo } from "../../../../utils/myapollo";
import { toErrorMap } from "../../../../utils/toErrorMap";
import { UseIdFromUrl } from "../../../../utils/useIdFromUrl";

const EditComment = () => {
  const router = useRouter();
  const commentId = UseIdFromUrl();

  const { data, loading } = useCommentQuery({
    skip: commentId === -1,
    variables: { id: commentId },
  });

  const [updateComment] = useUpdateCommentMutation();

  if (!data?.comment) {
    return (
      <Layout variant="regular">
        <Box>
          <Heading>
            My pet would say it's the wrong spot for any massage...
          </Heading>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout variant="regular">
      <ItemWrapper>
        <Formik
          initialValues={{ text: data.comment.text }}
          onSubmit={async ({ text }, { setErrors }) => {
            const response = await updateComment({
              variables: { commentId, text },
              update: (cache) => cache.evict({ fieldName: "comments" }),
            });
            if (response.data.updateComment?.errors) {
              setErrors(toErrorMap(response.data.updateComment.errors));
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
                  size={5}
                />
              </Box>

              <Button mt={6} type="submit" isLoading={isSubmitting}>
                {" "}
                update Comment{" "}
              </Button>
            </Form>
          )}
        </Formik>
      </ItemWrapper>
    </Layout>
  );
};

export default hocApollo({ ssr: false })(EditComment);

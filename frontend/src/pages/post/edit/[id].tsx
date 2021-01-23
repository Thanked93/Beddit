import { Box, Button, Center, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../../components/InputField";
import ItemWrapper from "../../../components/layout/ItemWrapper";
import Layout from "../../../components/layout/Layout";
import NotFoundError from "../../../components/NotFoundError";
import {
  useSinglePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { hocApollo } from "../../../utils/myapollo";
import { toErrorMap } from "../../../utils/toErrorMap";
import { UseIdFromUrl } from "../../../utils/useIdFromUrl";

export const EditPost = ({}) => {
  const router = useRouter();
  const singlePostId = UseIdFromUrl();

  const { data, loading } = useSinglePostQuery({
    skip: singlePostId === -1,
    variables: {
      id: singlePostId,
    },
  });
  const [updatePost] = useUpdatePostMutation();
  if (loading) {
    return (
      <Layout>
        <Box>Loading fast...</Box>
      </Layout>
    );
  }

  if (!data?.singlePost) {
    return <NotFoundError />;
  }

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{
          title: data.singlePost.title,
          text: data.singlePost.text,
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await updatePost({
            variables: { id: singlePostId, ...values },
          });

          if (response.data.updatePost?.errors) {
            setErrors(toErrorMap(response.data.updatePost.errors));
          } else {
            router.push(`/post/${singlePostId}`);
          }
        }}
      >
        {({ isSubmitting }) => (
          <ItemWrapper>
            <Form>
              <InputField
                name="title"
                placeholder="title"
                label="Title"
                size={3}
              />
              <Box mt={4}>
                <InputField
                  isTextarea
                  name="text"
                  placeholder="text..."
                  label="Body"
                  size={3}
                />
              </Box>
              <Flex justifyContent="center">
                <Button
                  mt={6}
                  type="submit"
                  bg="#8a948d"
                  isLoading={isSubmitting}
                >
                  {" "}
                  update Post{" "}
                </Button>
              </Flex>
            </Form>
          </ItemWrapper>
        )}
      </Formik>
    </Layout>
  );
};

export default hocApollo({ ssr: false })(EditPost);

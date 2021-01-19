import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../../components/InputField";
import Layout from "../../../components/Layout";
import {
  useSinglePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { hocApollo } from "../../../utils/myapollo";
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
    return (
      <Layout>
        <Box>Post not found ...</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{
          title: data.singlePost.title,
          text: data.singlePost.text,
        }}
        onSubmit={async (values) => {
          await updatePost({ variables: { id: singlePostId, ...values } });
          router.back();
        }}
      >
        {({ isSubmitting }) => {
          <Box>
            <Form>
              <InputField name="title" placeholder="title" label="Title" />
              <Box mt={4}>
                <InputField
                  isTextarea
                  name="text"
                  placeholder="text..."
                  label="Body"
                />
              </Box>

              <Button
                mt={6}
                type="submit"
                bg="#8a948d"
                isLoading={isSubmitting}
              >
                {" "}
                update Post{" "}
              </Button>
            </Form>
          </Box>;
        }}
      </Formik>
    </Layout>
  );
};

export default hocApollo({ ssr: false })(EditPost);

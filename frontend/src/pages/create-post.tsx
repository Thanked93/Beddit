import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";
import { toErrorMap } from "../utils/toErrorMap";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [createPost] = useCreatePostMutation();

  useIsAuth();

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createPost({
            variables: { input: values },
            update: (cache) => cache.evict({ fieldName: "posts" }),
          });
          if (response.data?.createPost.errors) {
            setErrors(toErrorMap(response.data.createPost.errors));
          } else {
            router.push(`/post/${response.data.createPost.post.id}`);
          }
        }}
      >
        {({ isSubmitting }) => (
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

            <Button mt={6} type="submit" isLoading={isSubmitting}>
              {" "}
              create Post{" "}
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default hocApollo({ ssr: false })(CreatePost);

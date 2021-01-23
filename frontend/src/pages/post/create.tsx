import { Flex, Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import router from "next/dist/next-server/lib/router/router";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../components/InputField";
import ItemWrapper from "../../components/layout/ItemWrapper";
import Layout from "../../components/layout/Layout";
import { useCreatePostMutation } from "../../generated/graphql";
import { hocApollo } from "../../utils/myapollo";
import { toErrorMap } from "../../utils/toErrorMap";
import { useIsAuth } from "../../utils/useIsAuth";

interface createPostProps {}

export const createPost: React.FC<createPostProps> = ({}) => {
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  const router = useRouter();
  return (
    <Layout>
      <ItemWrapper>
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
              router.push(`/post/${response.data?.createPost.post.id}`);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField
                  name="title"
                  placeholder="title"
                  label="Title"
                  size={3}
                />
              </Box>
              <Box mt={4}>
                <InputField
                  size={3}
                  isTextarea
                  name="text"
                  placeholder="text..."
                  label="Body"
                />
              </Box>

              <Button
                bgColor={"#8a948d"}
                mt={6}
                alignItems="center"
                type="submit"
                isLoading={isSubmitting}
              >
                {" "}
                create Post{" "}
              </Button>
            </Form>
          )}
        </Formik>
      </ItemWrapper>
    </Layout>
  );
};

export default hocApollo({ ssr: false })(createPost);

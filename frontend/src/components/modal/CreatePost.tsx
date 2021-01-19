import { Box, Button, Container, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useCreatePostMutation } from "../../generated/graphql";
import { hocApollo } from "../../utils/myapollo";
import { toErrorMap } from "../../utils/toErrorMap";
import { useIsAuth } from "../../utils/useIsAuth";
import InputField from "../InputField";
import Layout from "../Layout";

interface CreatePostProps {
  closeModal(): void;
}

const CreatePost: React.FC<CreatePostProps> = ({ closeModal }) => {
  const router = useRouter();
  const [createPost] = useCreatePostMutation();
  const modalRef = useRef();

  const killModal = (e: any) => {
    console.log(e.target);
    if (e.target === modalRef.current) {
      closeModal();
    }
  };

  useIsAuth();

  return (
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
          closeModal();
        }
      }}
    >
      {({ isSubmitting }) => (
        <Flex
          onClick={killModal}
          ref={modalRef}
          position="absolute"
          bgColor="rgba(255,255,255,.5)"
          left={0}
          top={0}
          height={"100vh"}
          width={"100vw"}
          justifyContent="center"
          alignItems="center"
        >
          <Flex
            width="60vw"
            height="45vh"
            bgColor="white"
            border="2px"
            borderRadius="5vw"
            borderColor="#8a948d"
            opacity={1.0}
            justifyContent="center"
          >
            <Form>
              <Box mt={10}>
                <InputField
                  name="title"
                  placeholder="title"
                  label="Title"
                  size={5}
                />
              </Box>
              <Box mt={4}>
                <InputField
                  size={5}
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
          </Flex>
        </Flex>
      )}
    </Formik>
  );
};

export default hocApollo({ ssr: false })(CreatePost);

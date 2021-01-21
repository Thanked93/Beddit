import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import ItemWrapper from "../components/layout/ItemWrapper";
import Layout from "../components/layout/Layout";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";
import { toErrorMap } from "../utils/toErrorMap";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const [register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Layout>
      <ItemWrapper>
        <Formik
          initialValues={{ email: "", username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({
              variables: { options: values },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.register.user,
                  },
                });
              },
            });
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data.register.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box mt={4}>
                <InputField name="email" placeholder="email" label="email" />
              </Box>
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Flex justifyContent="center">
                <Button
                  colorScheme={"green"}
                  mt={6}
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {" "}
                  register{" "}
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </ItemWrapper>
    </Layout>
  );
};

export default hocApollo({ ssr: false })(Register);

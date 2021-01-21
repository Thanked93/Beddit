import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import ItemWrapper from "../components/layout/ItemWrapper";
import Layout from "../components/layout/Layout";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";
import { toErrorMap } from "../utils/toErrorMap";
export const Login: React.FC<{}> = ({}) => {
  const [login] = useLoginMutation();
  const router = useRouter();
  return (
    <Layout>
      <ItemWrapper>
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({
              variables: values,
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.login.user,
                  },
                });
                cache.evict({ fieldName: "posts" });
              },
            });
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data.login.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                router.push("/");
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="usernameOrEmail"
                placeholder="username or email"
                label="Username or Email"
                size={5}
              />
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                  size={5}
                />
              </Box>
              <Flex mt={2}>
                <Box>
                  <NextLink href="/forgot-password">
                    <Link color="blue" ml="auto">
                      forgot password?
                    </Link>
                  </NextLink>
                </Box>
              </Flex>
              <Flex justifyContent="center">
                <Button
                  mt={6}
                  type="submit"
                  colorScheme={"green"}
                  isLoading={isSubmitting}
                >
                  {" "}
                  login{" "}
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </ItemWrapper>
    </Layout>
  );
};

export default hocApollo({ ssr: false })(Login);

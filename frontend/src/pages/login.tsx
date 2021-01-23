import { Box, Button, Flex, Text, Link } from "@chakra-ui/react";
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
          <ItemWrapper>
            <Form>
              <InputField
                name="usernameOrEmail"
                placeholder="Username or email"
                label="Name"
                size={3}
              />
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                  size={3}
                />
              </Box>
              <Flex mt={2}>
                <Flex flexDirection="column">
                  <NextLink href="/forgot-password">
                    <Link ml="0">forgot password?</Link>
                  </NextLink>
                  <Flex flexDirection="row">
                    <Text>{"Don't have an account? "}</Text>
                    <NextLink href="/Register">
                      <Link ml="1" fontWeight="600">
                        Register
                      </Link>
                    </NextLink>
                  </Flex>
                </Flex>
              </Flex>
              <Flex justifyContent="center">
                <Button
                  mt={6}
                  type="submit"
                  colorScheme={"green"}
                  isLoading={isSubmitting}
                >
                  {" "}
                  Login{" "}
                </Button>
              </Flex>
            </Form>
          </ItemWrapper>
        )}
      </Formik>
    </Layout>
  );
};

export default hocApollo({ ssr: false })(Login);

import { Box, Text, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import ItemWrapper from "../components/layout/ItemWrapper";
import Layout from "../components/layout/Layout";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";
import { toErrorMap } from "../utils/toErrorMap";
import NextLink from "next/link";

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
                size={3}
              />
              <Box mt={4}>
                <InputField
                  name="email"
                  placeholder="email"
                  label="email"
                  size={3}
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                  size={3}
                />
              </Box>
              <Flex flexDirection="row" mt="2">
                <Text>{"Already have an account? "}</Text>
                <NextLink href="/Register">
                  <Link ml="1" fontWeight="600">
                    Login
                  </Link>
                </NextLink>
              </Flex>
              <Flex justifyContent="center">
                <Button
                  colorScheme={"green"}
                  mt={6}
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {" "}
                  Register{" "}
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

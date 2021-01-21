import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";

import React, { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/layout/Wrapper";

import { useForgotPasswordMutation } from "../generated/graphql";
import { hocApollo } from "../utils/myapollo";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="regular">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          const response = await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>Check your emails</Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="Email"
                label="Email"
                type="email"
              />

              <Button mt={6} type="submit" isLoading={isSubmitting}>
                {" "}
                login{" "}
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default hocApollo({ ssr: false })(ForgotPassword);

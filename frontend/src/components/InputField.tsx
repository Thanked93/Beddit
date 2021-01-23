import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Heading,
} from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  isTextarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  isTextarea,
  size,

  ...props
}) => {
  let InputOrTextarea: any = Input;
  if (isTextarea) {
    InputOrTextarea = Textarea;
  }

  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>
        <Heading size={"xl"}>{label}</Heading>
      </FormLabel>
      <InputOrTextarea
        {...field}
        {...props}
        id={field.name}
        maxLength={isTextarea ? undefined : 20}
        placeholder={props.placeholder}
        minWidth={"300px"}
        width={`${size * 10}vw`}
        maxWidth={`${size * 10}vw`}
        cols={100}
        height={isTextarea ? size * 10 : undefined}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;

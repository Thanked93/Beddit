import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
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
      <FormLabel fontSize={`${size * 0.8}vmin`} htmlFor={field.name}>
        {label}
      </FormLabel>
      <InputOrTextarea
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
        width={`${size * 10}vw`}
        height={"4vmin"}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;

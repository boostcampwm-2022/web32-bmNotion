import { useEffect, useState } from "react";
import { ErrorMessage } from "./validate";

export interface Values {
  [propName: string]: string | number | readonly string[] | undefined;
}
export interface Params {
  initialValues: Values,
  onSubmit: Function,
  validate: Function,
}

function useForm({ initialValues, onSubmit, validate }: Params) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ErrorMessage>({});
  const [submitting, setSubmitting] = useState(false);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setSubmitting(true);
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    setErrors(validate(values));
  };

  useEffect(() => {
    if (submitting) {
      if (Object.keys(errors).length === 0) {
        onSubmit(values);
      }
      setSubmitting(false);
    }
  }, [errors]);

  return {
    values,
    errors,
    submitting,
    handleInputChange,
    handleFormSubmit,
  };
}

export default useForm;
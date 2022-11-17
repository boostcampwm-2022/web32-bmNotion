import useForm, { Params as FormParams, Values } from "./useForm";
import validate, { Params as ValidateParams } from "./validate";

export interface Error {
  email?: string,
  password?: string,
}

export default function LoginForm() {
  const { values, errors, submitting, handleInputChange, handleFormSubmit } = useForm({
    initialValues: { email: "", password: "" },
    onSubmit: (values: Values) => {
      alert(JSON.stringify(values, null, 2));
    },
    validate,
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleInputChange}
          className={errors.email && "errorInput"}
        />
        {errors.email && <span className="errorMessage">{errors.email}</span>}
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleInputChange}
          className={errors.email && "errorInput"}
        />
        {errors.password && (
          <span className="errorMessage">{errors.password}</span>
        )}
      </label>
      <br />
      <button type="submit" disabled={submitting}>
        로그인
      </button>
    </form>
  );
}
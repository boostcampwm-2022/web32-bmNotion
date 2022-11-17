import { useState } from "react";

export interface Props {
  className?: string;
  placeholder?: string;
  onChange: ({ value }: { value: string }) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
}
  
export default  function TextInput(
  {
    className,
    placeholder,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    value = '',
    disabled = false,
    minLength,
    maxLength,
  }: Props
) {
  const [text, setText] = useState(value);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setText(value);
    onChange({ value });
  };

  return (
    <input
      type="text"
      value={text}
      className={className}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      disabled={disabled}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}

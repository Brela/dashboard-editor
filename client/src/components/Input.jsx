import { useState } from "react";
import { twMerge } from "tailwind-merge";

const Input = ({
  id,
  type,
  name,
  placeholder,
  defaultValue,
  autoComplete,
  required,
  className,
  label,
  onChange,
  value,
  step,
  readOnly,
  inputRef,
  min,
  max,
  labelClassname,
  onBlur,
}) => {
  const types = {
    text: "text",
    email: "email",
    password: "password",
    checkbox: "checkbox",
    number: "number",
    datetime: "datetime-local",
    date: "date",
    color: "color",
  };

  const [focus, setFocus] = useState(false);

  return (
    <>
      {label !== "" && (
        <label
          htmlFor={name}
          className={`${labelClassname} my-2 block text-sm font-medium`}
          style={{
            color: "#FF0000",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id || ""}
        name={name || ""}
        type={types[type] || "text"}
        step={(type === "number" && step) || 0}
        autoComplete={autoComplete}
        required={required || false}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={min}
        max={max}
        className={twMerge(
          "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none sm:text-sm",
          className,
          readOnly && "cursor-not-allowed",
        )}
        style={{
          borderColor: `${(focus && "#FF0000") || ""}`,
          color: `black`,
        }}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={(e) => {
          if (onBlur) {
            onBlur(e);
          }
          setFocus(false);
        }}
        onChange={onChange}
        value={value}
        readOnly={readOnly}
        ref={inputRef}
      />
    </>
  );
};

export default Input;

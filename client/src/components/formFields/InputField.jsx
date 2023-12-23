import { createElement, useState } from "react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";
import { get } from "lodash";

const InputField = ({
  label,
  field,
  formState,
  className,
  inputClassName,
  labelClassName,
  placeholder,
  required,
  isLoading,
  isDisabled,
  inputProps,
  leftAddon,
  leftAddonClassName,
  rightAddon,
  rightAddonClassName,
  rightAddonOnClick,
  leftAddonOnClick,
  size = "md",
  errorClassName,
  type = "text",
}) => {
  const [focus, setFocus] = useState(false);
  const hasError =
    formState.errors[field.name] || get(formState.errors, field.name); // for nested fields;

  return (
    <div className={twMerge("mt-3 w-full relative", className)}>
      {label && (
        <label
          htmlFor={field.name}
          className={twMerge(
            "my-2 block text-sm font-medium text-gray-800",
            labelClassName,
          )}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      <div className="flex w-full items-center relative">
        {leftAddon && (
          <div className="absolute left-2.5 top-0 h-full w-5 text-center">
            {typeof leftAddon === "string" ? (
              <div
                className={twMerge(
                  "h-full w-full flex items-center justify-center text-gray-500",
                  leftAddonClassName,
                  hasError && "text-red-500",
                )}
                onClick={leftAddonOnClick}
              >
                {leftAddon}
              </div>
            ) : (
              createElement(leftAddon, {
                className: twMerge(
                  "h-full w-full text-gray-500",
                  leftAddonClassName,
                  hasError && "text-red-500",
                ),
                onClick: leftAddonOnClick,
              })
            )}
          </div>
        )}
        <input
          {...field}
          {...inputProps}
          type={type}
          disabled={isDisabled || formState.isLoading}
          style={{
            borderColor: hasError ? "red" : `${(focus && "#FF0000") || ""}`,
            color: `black`,
            paddingLeft: leftAddon ? "2.2rem" : "",
            paddingRight: rightAddon ? "2.2rem" : "",
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={
            formState.isLoading || isLoading ? "Loading..." : placeholder
          }
          className={twMerge(
            "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none sm:text-sm",
            inputClassName,
            size === "xs"
              ? "px-1 py-0.5"
              : size === "sm"
              ? "px-2 py-1"
              : size === "md"
              ? "px-3 py-2"
              : size === "lg"
              ? "px-4 py-3"
              : "px-3 py-2",
          )}
        />
        {rightAddon && !formState.isLoading && !isLoading && (
          <div className="absolute right-2.5 top-0 h-full w-5 text-center">
            {typeof rightAddon === "string" ? (
              <div
                className={twMerge(
                  "h-full w-full flex items-center justify-center text-gray-500",
                  rightAddonClassName,
                  hasError && "text-red-500",
                )}
                onClick={rightAddonOnClick}
              >
                {rightAddon}
              </div>
            ) : (
              createElement(rightAddon, {
                className: twMerge(
                  "h-full w-full text-gray-500",
                  rightAddonClassName,
                  hasError && "text-red-500",
                ),
                onClick: rightAddonOnClick,
              })
            )}
          </div>
        )}

        {isLoading ||
          (formState.isLoading && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              Loading...
            </div>
          ))}
      </div>
      {hasError && (
        <p
          className={twMerge(
            "text-sm text-end text-red-500 mt-1 absolute right-0",
            errorClassName,
          )}
        >
          {hasError?.message}
        </p>
      )}
    </div>
  );
};
InputField.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  formState: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  inputClassName: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  inputProps: PropTypes.object,
  labelClassName: PropTypes.string,
  leftAddon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  rightAddon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  leftAddonClassName: PropTypes.string,
  rightAddonClassName: PropTypes.string,
  leftAddonOnClick: PropTypes.func,
  rightAddonOnClick: PropTypes.func,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  errorClassName: PropTypes.string,
  type: PropTypes.oneOf(["text", "password"]),
};

export default InputField;

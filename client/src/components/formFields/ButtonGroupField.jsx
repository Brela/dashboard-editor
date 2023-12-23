import PropTypes from "prop-types";
import { Button } from "../index";
import { twMerge } from "tailwind-merge";
import { get, includes } from "lodash";

const ButtonGroupField = ({
  field,
  label,
  formState,
  required,
  className,
  options = [],
  buttonsClassName,
  buttonsClassNames = [],
  buttonGroupClassName,
  selectedButtonVariant,
  selectedButtonStyle,
  isMulti,
  // is disabled index or maybe all are disabled
  disabled,
  errorClassName,
}) => {
  const hasError =
    formState.errors[field.name] || get(formState.errors, field.name); // for nested fields;

  return (
    <div className={twMerge("mt-3 w-full relative", className)}>
      {label && (
        <label
          htmlFor={field.name}
          className="my-2 block text-sm font-medium text-gray-800"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      <div
        className={twMerge(
          "flex justify-between gap-x-4",
          buttonGroupClassName,
        )}
      >
        {formState.isLoading
          ? options.map((_, id) => (
              <Button
                key={id}
                className="mx-auto w-full p-3.5"
                variant="ghost"
                mode="outlined"
              >
                <div>Loading...</div>
              </Button>
            ))
          : options.map((option, id) => {
              return (
                <Button
                  key={id}
                  disabled={
                    disabled === true ||
                    formState.isLoading ||
                    (Array.isArray(disabled) && includes(disabled, id))
                  }
                  mode={
                    field.value === option.value ||
                    includes(field.value, option.value)
                      ? "solid"
                      : "outlined"
                  }
                  variant={
                    field.value === option.value ||
                    includes(field.value, option.value)
                      ? selectedButtonVariant || "primary"
                      : "ghost"
                  }
                  onClick={() => {
                    isMulti
                      ? includes(field.value, option.value)
                        ? field.onChange(
                            field.value.filter((v) => v !== option.value),
                          )
                        : field.onChange([...field.value, option.value])
                      : field.onChange(option.value);
                  }}
                  className={twMerge(
                    `${buttonsClassName} flex flex-1 justify-center`,
                    buttonsClassNames[id],
                    (field.value === option.value ||
                      includes(field.value, option.value)) &&
                      selectedButtonStyle,
                  )}
                  isLoading={
                    formState.isLoading ||
                    (Array.isArray(disabled) && includes(disabled, id))
                  }
                >
                  {option.name}
                </Button>
              );
            })}
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

ButtonGroupField.propTypes = {
  field: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  buttonGroupClassName: PropTypes.string,
  buttonsClassName: PropTypes.string,
  buttonsClassNames: PropTypes.arrayOf(PropTypes.string),
  selectedButtonVariant: PropTypes.string,
  selectedButtonStyle: PropTypes.string,
  isMulti: PropTypes.bool,
  disabled: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  errorClassName: PropTypes.string,
};

export default ButtonGroupField;

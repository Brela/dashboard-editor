import PropTypes from "prop-types";
import Select from "react-select";
import { get, includes, isArray } from "lodash";
import { twMerge } from "tailwind-merge";

const SelectField = ({
  label,
  field,
  formState,
  fieldState,
  className,
  labelClassName,
  options,
  required,
  placeholder,
  isDisabled,
  isLoading,
  isClearable,
  isRtl,
  isSearchable,
  isMulti,
  formatGroupLabel,
  formatOptionLabel,
  menuPortalTarget = document.body,
  autoFocus,
  closeMenuOnSelect,
  isPastel,
  width,
  errorClassName,
}) => {
  const hasError =
    formState.errors[field.name] || get(formState.errors, field.name); // for nested fields;
  const { error, touched } = fieldState;

  const value =
    // if its grouped options
    options
      ?.flatMap((option) => option?.options)
      ?.find((option) => option?.value === field?.value) ||
    // if its multi select
    isMulti
      ? options.filter((option) => includes(field.value, option.value))
      : options.find((option) => option.value === field.value);

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
      <Select
        {...field}
        options={options}
        placeholder={
          isLoading || formState.isLoading
            ? "Loading.."
            : placeholder || "Select an option.."
        }
        value={value}
        styles={{
          control: (provided, state) => {
            return {
              ...provided,
              boxShadow: "none",
              borderColor: hasError ? "red" : "",
              "&:focus": {
                borderColor: hasError || (error && touched) ? "red" : "#FF0000",
              },
              "&:hover": {
                boxShadow: "none",
              },
              "&active": {
                borderColor: hasError ? "red" : "#FF0000",
              },
              "&:disabled": {
                borderColor: "lightgray",
              },
              "&:focus-within": {
                borderColor: "#FF0000",
              },
              cursor: "pointer",
              borderRadius: "0.25rem",
              width: width,
            };
          },
          menu: (provided, state) => ({
            ...provided,
            zIndex: 9999,
            scrollbarWidth: "11px",
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? isPastel
                ? getPastelColor(PRIMARY_COLOR)
                : PRIMARY_COLOR
              : state.isFocused
              ? getPastelColor(PRIMARY_COLOR)
              : "white",
            color: state.isSelected || state.isFocused ? "white" : "black",
            "&:hover": {
              backgroundColor: isPastel
                ? `${getPastelColor(PRIMARY_COLOR)}`
                : PRIMARY_COLOR,
              color: "white",
            },
            cursor: "pointer",
            padding: formatOptionLabel ? "0px" : "8px",
            zIndex: "99999999 !important",
          }),
          singleValue: (provided, state) => ({
            ...provided,
            color: `${"black"}`,
          }),
          input: (provided, state) => ({
            ...provided,
            color: `${"black"}`,
          }),
          multiValue: (provided, state) => ({
            ...provided,
            backgroundColor: "#e2e8f0",
            borderRadius: "4px",
            padding: "2px",
            marginRight: "4px",
          }),
          multiValueLabel: (provided, state) => ({
            ...provided,
            color: "#4a5568",
            fontWeight: "500",
          }),
          multiValueRemove: (provided, state) => ({
            ...provided,
            color: "#9ca3af",
            cursor: "pointer",
            "&:hover": {
              color: "white",
              background: "gray",
            },
          }),
        }}
        closeMenuOnSelect={closeMenuOnSelect}
        noOptionsMessage={() => "No Options available."}
        classNamePrefix="react-select"
        className={`react-select-container w-full rounded-md  items-center ${
          hasError ? "border-red-500" : ""
        }`}
        menuPortalTarget={menuPortalTarget}
        isDisabled={isDisabled || formState.isLoading}
        isLoading={isLoading || formState.isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        components={{
          LoadingIndicator: () => <div>Lodaing...</div>,
        }}
        isSearchable={isSearchable}
        isMulti={isMulti}
        autoFocus={autoFocus}
        formatGroupLabel={formatGroupLabel}
        formatOptionLabel={formatOptionLabel}
        onChange={(option) => {
          if (isArray(option)) {
            option = option.map((item) => item.value);
          } else {
            option = option?.value;
          }
          field.onChange(option || "");
        }}
      />
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

SelectField.propTypes = {
  label: PropTypes.string,
  field: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }),
  ).isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isClearable: PropTypes.bool,
  isRtl: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isMulti: PropTypes.bool,
  menuPortalTarget: PropTypes.element,
  labelClassName: PropTypes.string,
  autoFocus: PropTypes.bool,
  closeMenuOnSelect: PropTypes.bool,
  isPastel: PropTypes.bool,
  width: PropTypes.string,
  errorClassName: PropTypes.string,
};

export default SelectField;

import React from "react";
import PropTypes from "prop-types";
import ReactSelect from "react-select";
import { isArray } from "lodash";
import { twMerge } from "tailwind-merge";
import { primaryColor } from "../css/globalTailwindVars";

const Select = ({
  label,
  value,
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
  defaultValue,
  closeMenuOnSelect,
  onChange,
  isPastel,
}) => {
  const selectedOption = options.find((option) => option.value == value);

  return (
    <div className={twMerge("mt-3 w-full relative", className)}>
      {label && (
        <label
          htmlFor={label}
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
      <ReactSelect
        options={options}
        placeholder={placeholder || "Select an option.."}
        value={selectedOption}
        styles={{
          control: (provided, state) => {
            return {
              ...provided,
              boxShadow: "none",
              "&:focus": {
                borderColor: primaryColor,
              },
              "&:hover": {
                boxShadow: "none",
              },
              "&active": {
                borderColor: primaryColor,
              },
              "&:disabled": {
                borderColor: "lightgray",
              },
              "&:focus-within": {
                borderColor: primaryColor,
              },

              cursor: "pointer",
              borderRadius: "0.25rem",
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
                ? `${getPastelColor(primaryColor)}`
                : primaryColor
              : "white",
            color: state.isSelected ? "white" : "black",
            "&:hover": {
              backgroundColor: isPastel
                ? `${getPastelColor(primaryColor)}`
                : primaryColor,
              color: "white",
            },
            cursor: "pointer",
            padding: formatOptionLabel ? "0px" : "8px",
            zIndex: "99999999 !important",
          }),
          singleValue: (provided, state) => ({
            ...provided,
            color: `black`,
          }),
          input: (provided, state) => ({
            ...provided,
            color: `black`,
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
        className={`react-select-container w-full rounded-md items-center`}
        menuPortalTarget={menuPortalTarget}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        isMulti={isMulti}
        autoFocus={autoFocus}
        formatGroupLabel={formatGroupLabel}
        formatOptionLabel={formatOptionLabel}
        defaultValue={options.find((option) => option.value === defaultValue)}
        onChange={(option) => {
          let newValue;
          if (isArray(option)) {
            newValue = option.map((item) => item.value);
          } else {
            newValue = option?.value;
          }
          // call the function passed down as a prop
          if (typeof onChange === "function") {
            onChange(newValue);
          }
        }}
      />
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  className: PropTypes.string,
  options: PropTypes.array.isRequired,
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
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  formatGroupLabel: PropTypes.func,
  formatOptionLabel: PropTypes.func,
  isPastel: PropTypes.bool,
};

export default Select;

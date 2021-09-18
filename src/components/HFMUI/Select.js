import React, { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { TextField as MUITextField, MenuItem } from "@material-ui/core";
import PropTypes from "prop-types";

const Select = forwardRef(({ control, name, options, ...rest }, ref) => {
  const renderOptions = () => {
    if (Array.isArray(options) && options.length > 0)
      return options.map((option) => (
        <MenuItem key={option.label} value={option.value}>
          {option.label}
        </MenuItem>
      ));
    return null;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <MUITextField select inputRef={ref} {...field} {...rest}>
          <MenuItem value="">Seleccione una opción</MenuItem>
          {renderOptions()}
        </MUITextField>
      )}
    />
  );
});

Select.propTypes = {
  control: PropTypes.shape({}),
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ),
  helperText: PropTypes.string,
};

Select.defaultProps = {
  control: {},
  name: "",
  options: [],
  helperText: "",
};

export default Select;

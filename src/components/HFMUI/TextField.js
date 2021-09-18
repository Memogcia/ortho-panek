import React, { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { TextField as MUITextfield } from "@material-ui/core";
import PropTypes from "prop-types";

const TextField = forwardRef(({ control, name, ...rest }, ref) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <MUITextfield inputRef={ref} {...field} {...rest} />
      )}
    />
  );
});

TextField.propTypes = {
  control: PropTypes.shape({}),
  name: PropTypes.string,
};

TextField.defaultProps = {
  control: {},
  name: "",
};

export default TextField;

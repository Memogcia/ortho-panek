import React from "react";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import { es } from "date-fns/locale";

const DateTimePicker = ({ control, name, ...rest }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <KeyboardDateTimePicker
            autoOk
            fullWidth
            disableFuture
            disableToolbar
            variant="inline"
            inputVariant="outlined"
            format="dd/MM/yyyy"
            invalidDateMessage="Fecha inválida"
            invalidLabel="Fecha inválida"
            {...field}
            {...rest}
          />
        )}
      />
    </MuiPickersUtilsProvider>
  );
};

DateTimePicker.propTypes = {
  control: PropTypes.shape({}),
  name: PropTypes.string,
};

DateTimePicker.defaultProps = {
  control: {},
  name: "",
};

export default DateTimePicker;

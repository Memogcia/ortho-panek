import React from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

function Statuses({ value, index, change }) {
  const statuses = [
    "Activo",
    "Activo USA",
    "Retención",
    "Lista de espera",
    "Pendiente",
    "Descontinuado",
    "Transferido",
    "Prospecto",
    "Retratamiento",
    "Cortesia",
  ];

  return (
    <FormControl>
      <Select
        value={value}
        onChange={(event) => change(event.target.value, index)}
        style={{ fontSize: "inherit" }}
      >
        {statuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

Statuses.propTypes = {
  value: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  change: PropTypes.func.isRequired,
};

export default Statuses;

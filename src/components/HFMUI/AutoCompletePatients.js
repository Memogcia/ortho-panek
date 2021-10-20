/* eslint-disable no-param-reassign */
import { CircularProgress, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";

import { Autocomplete } from "@material-ui/lab";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import useDebounce from "hooks/useDebounce";

const GET_PATIENT_BY_NAME_QUERY = gql`
  query GetPatientByNameQuery($name: String = "") {
    users(where: { name: { _ilike: $name } }) {
      id
      name
    }
  }
`;

function AutoCompletePatients({ error, ...rest }) {
  const [getPatients, { data, loading }] = useLazyQuery(
    GET_PATIENT_BY_NAME_QUERY
  );
  const [patientToSearch, setPatientToSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const debounceSearchPatient = useDebounce(patientToSearch, 500);

  useEffect(() => {
    if (patientToSearch)
      getPatients({
        variables: {
          name: patientToSearch ? `%${patientToSearch}%` : "%%",
        },
      });
  }, [debounceSearchPatient]);

  useEffect(() => {
    if (Array.isArray(data?.users)) {
      const cleanPatients = data?.users.map((agency) => {
        return {
          id: agency.id,
          label: agency.name,
        };
      });
      setPatients(cleanPatients);
    }
  }, [data?.users]);

  const getOpObj = (option) => {
    if (!option.id) option = patients.find((op) => op.id === option);
    return option;
  };

  const getOpLabel = (option) => {
    const optionSelected = getOpObj(option);
    if (optionSelected) return optionSelected.label;
    return "";
  };

  return (
    <Controller
      {...rest}
      render={({ field }) => (
        <Autocomplete
          {...field}
          getOptionLabel={getOpLabel}
          getOptionSelected={(option, value) => option.id === value.id}
          options={patients}
          loading={loading}
          onInputChange={(_, value) => setPatientToSearch(value)}
          onChange={(_, value) => {
            // eslint-disable-next-line react/prop-types
            if (value) field.onChange(value.id);
            // eslint-disable-next-line react/prop-types
            else field.onChange("");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Paciente"
              variant="outlined"
              error={error}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    />
  );
}

AutoCompletePatients.propTypes = {
  error: PropTypes.bool,
};

AutoCompletePatients.defaultProps = {
  error: false,
};

export default AutoCompletePatients;

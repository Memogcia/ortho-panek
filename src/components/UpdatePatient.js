import * as Yup from "yup";

import { Box, Button } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useRouter } from "next/dist/client/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { DateTimePicker, Select, TextField } from "./HFMUI";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function UpdatePatient({
  patientId,
  patientData,
  updatePatientData,
  insertPatientAddress,
  insertPatient,
  updatePatientAddress,
}) {
  console.log(
    "🚀 ~ file: UpdatePatient.js ~ line 51 ~ insertPatient",
    insertPatient
  );
  console.log(
    "🚀 ~ file: UpdatePatient.js ~ line 41 ~ UpdatePatient ~ patientData",
    patientData
  );
  const classes = useStyles();
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre completo es requerido"),
    starting_date: Yup.date(),
    referrer: Yup.string(),
    consulting_room: Yup.string().required(
      "El consultorio en el que se atendie es requerido"
    ),
    cellphone: Yup.string(),
    phone: Yup.string(),
    address: Yup.object().shape({
      address: Yup.string(),
      colony: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      postal_code: Yup.string(),
    }),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: patientData.name || "",
      starting_date: patientData.starting_date || new Date(),
      referrer: patientData.referrer || "",
      consulting_room: patientData.consulting_room || "",
      cellphone: patientData.cellphone || "",
      phone: patientData.phone || "",
      address: {
        address: patientData?.address?.address,
        colony: patientData?.address?.colony,
        city: patientData?.address?.city,
        state: patientData?.address?.state,
        postal_code: patientData?.address?.postal_code,
      },
    },
  };
  const { control, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = async ({ address, ...rest }) => {
    let patientInserted;
    console.log(
      "🚀 ~ file: UpdatePatient.js ~ line 104 ~ onSubmit ~ patientId",
      patientId
    );
    if (patientId)
      await updatePatientData({ variables: { id: patientId, ...rest } });
    else patientInserted = await insertPatient({ variables: { ...rest } });
    console.log(
      "🚀 ~ file: UpdatePatient.js ~ line 105 ~ onSubmit ~ patientInserted",
      patientInserted
    );

    // const addressPyload = {
    //   variables: { user_id: patientId, ...address },
    // };
    // if (patientData.address) await updatePatientAddress(addressPyload);
    // else await insertPatientAddress(addressPyload);

    // router.push("/patients");
  };

  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h4" align="center">
        {patientId ? "Actualizar paciente" : "Registrar paciente"}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Información personal
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              required
              id="name"
              name="name"
              label="Nombre completo"
              fullWidth
              autoComplete="given-name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              id="referrer"
              name="referrer"
              label="Referido por"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              control={control}
              required
              id="consulting_room"
              name="consulting_room"
              label="Consultorio"
              options={[
                { label: "La Barca", value: "la barca" },
                { label: "Guadalajara", value: "guadalajara" },
              ]}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              control={control}
              required
              id="starting_date"
              name="starting_date"
              label="Fecha de inicio"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              required
              id="phone"
              name="phone"
              label="Teléfono local"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              required
              id="cellphone"
              name="cellphone"
              label="Teléfono celular"
              fullWidth
            />
          </Grid>
        </Grid>
        <Box mt={2} />
        <Typography variant="h6" gutterBottom>
          Dirección
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              control={control}
              required
              id="address.address"
              name="address.address"
              label="Dirección (calle y número)"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              required
              id="address.colony"
              name="address.colony"
              label="Colonia"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              required
              id="address.postal_code"
              name="address.postal_code"
              label="Código postal"
              fullWidth
              autoComplete="shipping postal-code"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              required
              id="address.city"
              name="address.city"
              label="Ciudad"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              id="address.state"
              name="address.state"
              label="Estado"
              fullWidth
            />
          </Grid>
        </Grid>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
          >
            {patientId ? "Actualizar paciente" : "Registrar paciente"}
          </Button>
        </div>
      </form>
    </Paper>
  );
}

UpdatePatient.propTypes = {
  patientData: PropTypes.shape({
    name: PropTypes.string,
    starting_date: PropTypes.string,
    referrer: PropTypes.string,
    consulting_room: PropTypes.string,
    cellphone: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.shape({
      address: PropTypes.string,
      colony: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      postal_code: PropTypes.string,
    }),
  }),
  updatePatientData: PropTypes.func,
  insertPatientAddress: PropTypes.func,
  insertPatient: PropTypes.func,
  updatePatientAddress: PropTypes.func,
  patientId: PropTypes.string,
};

UpdatePatient.defaultProps = {
  patientData: {},
  updatePatientData: () => {},
  insertPatientAddress: () => {},
  insertPatient: () => {},
  updatePatientAddress: () => {},
  patientId: "",
};

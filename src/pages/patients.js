import { gql, useQuery } from "@apollo/client";
/* eslint-disable react/forbid-prop-types */
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { getSession } from "next-auth/client";
import MUIDataTable from "mui-datatables";

const GET_PATIENTS = gql`
  query GET_PATIENTS {
    users(where: { role: { _eq: "user" } }) {
      name
      internal_id
      starting_date
      email
      status
      not_attend
      phone
      cellphone
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
}));

function patients() {
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_PATIENTS);

  if (loading) return <h1>Cargando Pacientes</h1>;
  if (error) return <h2>Error</h2>;

  const columns = [
    { label: "No. de paciente", name: "internal_id" },
    { label: "Nombre", name: "name" },
    { label: "Email", name: "email" },
    { label: "Fecha de inicio", name: "starting_date" },
    { label: "Estatus", name: "status" },
    { label: "Faltista", name: "not_attend" },
    { label: "Teléfono fijo", name: "phone" },
    { label: "Celular", name: "cellphone" },
  ];
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <MUIDataTable title="Pacientes" data={data.users} columns={columns} />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default patients;

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

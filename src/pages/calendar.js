import { gql, useMutation, useSubscription } from "@apollo/client";
/* eslint-disable react/forbid-prop-types */
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { getSession } from "next-auth/client";
import CalendarComponent from "components/Calendar";

const GET_APPOINTMENTS = gql`
  subscription GetAppointmentsSubscription {
    appointments {
      comments
      end_date_time
      id
      patient_assisted
      start_date_time
      status
      type
      user {
        name
        phone
        cellphone
        email
      }
    }
  }
`;

const INSERT_APPOINTMENT = gql`
  mutation InsertAppointmentMutation(
    $id: uuid = ""
    $start_date_time: timestamptz = ""
    $end_date_time: timestamptz = ""
    $comments: String = ""
    $status: String = ""
    $type: String = ""
    $user_id: String = ""
  ) {
    insert_appointments(
      objects: {
        id: $id
        start_date_time: $start_date_time
        end_date_time: $end_date_time
        comments: $comments
        status: $status
        type: $type
        user_id: $user_id
      }
    ) {
      returning {
        id
        end_date_time
        comments
        patient_assisted
        start_date_time
        status
        type
        user {
          name
          email
          phone
          cellphone
        }
      }
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
  const { data } = useSubscription(GET_APPOINTMENTS);
  const [insertAppointment] = useMutation(INSERT_APPOINTMENT);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <CalendarComponent
            insertAppointment={insertAppointment}
            appointments={data?.appointments || []}
          />
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

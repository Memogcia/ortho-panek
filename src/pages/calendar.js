import { gql, useMutation, useLazyQuery, useQuery } from "@apollo/client";
/* eslint-disable react/forbid-prop-types */
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { getSession } from "next-auth/client";
import CalendarComponent from "components/Calendar";

const GET_APPOINTMENTS = gql`
  query GetAppointments {
    appointments {
      comments
      end_date_time: end
      id
      patient_assisted
      start_date_time: start
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
`;

const INSERT_APPOINTMENT = gql`
  mutation MyMutation(
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
        user_id
        user {
          phone
          name
          cellphone
          email
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
  const { data, loading, error } = useQuery(GET_APPOINTMENTS);

  console.log("🚀 ~ file: calendar.js ~ line 62 ~ patients ~ data", data);

  // useEffect(() => {
  //   getPatients({
  //     variables: {
  //       name: nameToSearch ? `%${nameToSearch}%` : "%%",
  //       page,
  //       limit,
  //     },
  //   });
  // }, [debounceSearchTerm]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <CalendarComponent />
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

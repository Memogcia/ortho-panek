import {
  gql,
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
/* eslint-disable react/forbid-prop-types */
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import { getSession } from "next-auth/client";
import CalendarComponent from "components/Calendar";

const GET_APPOINTMENTS = gql`
  subscription GetAppointmentsSubscription {
    appointments {
      # comments
      end_date_time
      id
      # patient_assisted
      start_date_time
      # status
      type
      user {
        name
        # phone
        # cellphone
        # email
      }
    }
  }
`;

const GET_APPOINTMENT = gql`
  query GetAppintmentDetails($appointmentId: uuid = "") {
    appointments(where: { id: { _eq: $appointmentId } }) {
      comments
      end_date_time
      start_date_time
      patient_assisted
      status
      type
      user {
        name
        phone
        cellphone
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
    height: "100%",
  },
  paper: {
    width: "100%",
    height: "100%",
    marginBottom: theme.spacing(2),
  },
}));

function Calendar() {
  const classes = useStyles();
  const { data } = useSubscription(GET_APPOINTMENTS);
  const [insertAppointment] = useMutation(INSERT_APPOINTMENT);
  const [
    getAppointment,
    { data: appointmentDetail, loading: isLoadingAppointmentDetail, error },
  ] = useLazyQuery(GET_APPOINTMENT);

  return (
    <Paper className={classes.paper}>
      <CalendarComponent
        insertAppointment={insertAppointment}
        appointments={data?.appointments || []}
        getAppointment={getAppointment}
        appointmentDetail={appointmentDetail}
        isLoadingAppointmentDetail={isLoadingAppointmentDetail}
      />
    </Paper>
  );
}

Calendar.auth = true;
export default Calendar;

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

import { gql, useMutation } from "@apollo/client";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import UpdatePatient from "components/UpdatePatient";
import { getSession } from "next-auth/client";
/* eslint-disable react/forbid-prop-types */
import { makeStyles } from "@material-ui/core/styles";

const INSERT_PATIENT_QUERY = gql`
  mutation InsertUserMutation(
    $id: String = ""
    $consulting_room: String = ""
    $cellphone: String = ""
    $email: String = ""
    $name: String = ""
    $referrer: String = ""
    $phone: String = ""
    $starting_date: timestamptz = ""
    $birth_date: timestamptz = ""
  ) {
    insert_users(
      objects: {
        id: $id
        consulting_room: $consulting_room
        cellphone: $cellphone
        email: $email
        name: $name
        phone: $phone
        referrer: $referrer
        starting_date: $starting_date
        birth_date: $birth_date
      }
    ) {
      returning {
        id
        consulting_room
        cellphone
        email
        name
        phone
        referrer
        starting_date
        birth_date
      }
    }
  }
`;

const INSERT_PATIENT_ADDRESS = gql`
  mutation InsertPatientAddress(
    $address: String = ""
    $city: String = ""
    $colony: String = ""
    $postal_code: String = ""
    $state: String = ""
    $user_id: String = ""
  ) {
    insert_addresses(
      objects: {
        address: $address
        city: $city
        colony: $colony
        postal_code: $postal_code
        state: $state
        user_id: $user_id
      }
    ) {
      returning {
        id
        address
        city
        colony
        postal_code
        state
        user_id
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
}));

function patients() {
  const classes = useStyles();

  const [insertPatientAddress] = useMutation(
    INSERT_PATIENT_ADDRESS
    //   {
    //   // eslint-disable-next-line camelcase
    //   update(cache, { data: insert_addresses }) {
    //     console.log(
    //       "🚀 ~ file: update-patient.js ~ line 153 ~ update ~ insert_addresses",
    //       insert_addresses
    //     );
    //     cache.modify({
    //       fields: {
    //         Addresses(existingPatientAddress = []) {
    //           const newPatientAddressRef = cache.writeFragment({
    //             data: insert_addresses,
    //             fragment: gql`
    //               fragment NewPatientAddress on PatientAddress {
    //                 id
    //                 colony
    //                 city
    //                 address
    //                 postal_code
    //                 state
    //               }
    //             `,
    //           });
    //           return [...existingPatientAddress, newPatientAddressRef];
    //         },
    //       },
    //     });
    //   },
    // }
  );
  const [insertPatient] = useMutation(
    INSERT_PATIENT_QUERY
    //   {
    //   // eslint-disable-next-line camelcase
    //   update(cache, { data: insert_users }) {
    //     cache.modify({
    //       fields: {
    //         Users(existingPatient = []) {
    //           const newPatientRef = cache.writeFragment({
    //             data: insert_users,
    //             fragment: gql`
    //               fragment NewPatientAddress on PatientAddress {
    //                 id
    //                 consulting_room
    //                 cellphone
    //                 email
    //                 name
    //                 phone
    //                 referrer
    //                 role
    //                 starting_date
    //               }
    //             `,
    //           });
    //           return [...existingPatient, newPatientRef];
    //         },
    //       },
    //     });
    //   },
    // }
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <UpdatePatient
            insertPatient={insertPatient}
            insertPatientAddress={insertPatientAddress}
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

import { gql, useMutation, useQuery } from "@apollo/client";
/* eslint-disable react/forbid-prop-types */
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { getSession } from "next-auth/client";
import UpdatePatient from "components/UpdatePatient";
import { useRouter } from "next/dist/client/router";

const GET_PATIENT = gql`
  query GetPatient($id: String = "") {
    users(where: { id: { _eq: $id } }) {
      id
      cellphone
      consulting_room
      referrer
      last_payment
      name
      not_attend
      phone
      starting_date
      birth_date
      status
      address {
        id
        address
        city
        colony
        state
        postal_code
      }
    }
  }
`;

const UPDATE_PATIENT_DATA = gql`
  mutation UpdatePatientData(
    $id: String = ""
    $cellphone: String = ""
    $consulting_room: String = ""
    $name: String = ""
    $phone: String = ""
    $referrer: String = ""
    $starting_date: timestamptz = ""
    $birth_date: timestamptz = ""
  ) {
    update_users(
      where: { id: { _eq: $id } }
      _set: {
        cellphone: $cellphone
        consulting_room: $consulting_room
        name: $name
        phone: $phone
        referrer: $referrer
        starting_date: $starting_date
        birth_date: $birth_date
      }
    ) {
      returning {
        id
        cellphone
        consulting_room
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

const UPDATE_PATIENT_ADDRESS = gql`
  mutation UpdatePatientAddress(
    $address: String = ""
    $city: String = ""
    $colony: String = ""
    $postal_code: String = ""
    $state: String = ""
    $user_id: String = ""
  ) {
    update_addresses(
      where: { user_id: { _eq: $user_id } }
      _set: {
        address: $address
        city: $city
        colony: $colony
        postal_code: $postal_code
        state: $state
      }
    ) {
      returning {
        id
        colony
        city
        address
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
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_PATIENT, {
    variables: {
      id,
    },
  });
  const [updatePatientData] = useMutation(UPDATE_PATIENT_DATA);
  const [insertPatientAddress] = useMutation(INSERT_PATIENT_ADDRESS, {
    // eslint-disable-next-line camelcase
    update(cache, { data: insert_addresses }) {
      cache.modify({
        id: cache.identify(data.users[0]),
        fields: {
          Addresses(existingPatientAddress = []) {
            const newPatientAddressRef = cache.writeFragment({
              data: insert_addresses,
              fragment: gql`
                fragment NewPatientAddress on PatientAddress {
                  id
                  colony
                  city
                  address
                  postal_code
                  state
                }
              `,
            });
            return [...existingPatientAddress, newPatientAddressRef];
          },
        },
      });
    },
  });
  const [updatePatientAddress] = useMutation(UPDATE_PATIENT_ADDRESS);

  if (loading) return <h1>Cargando paciente...</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <UpdatePatient
            patientId={id}
            patientData={data.users[0]}
            updatePatientData={updatePatientData}
            insertPatientAddress={insertPatientAddress}
            updatePatientAddress={updatePatientAddress}
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

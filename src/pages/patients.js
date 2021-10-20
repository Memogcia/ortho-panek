import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

import { COMMON_ROUTES } from "constants/routes";
import CreateIcon from "@material-ui/icons/Create";
import Grid from "@material-ui/core/Grid";
import { IconButton } from "@material-ui/core";
import Link from "next/link";
import MUIDataTable from "mui-datatables";
import Paper from "@material-ui/core/Paper";
import Statuses from "components/StatusesSelect";
import { format } from "date-fns";
import { getSession } from "next-auth/client";
/* eslint-disable react/forbid-prop-types */
import { makeStyles } from "@material-ui/core/styles";
import useDebounce from "hooks/useDebounce";

const GET_PATIENTS = gql`
  query GET_PATIENTS($page: Int, $limit: Int, $name: String) {
    users(offset: $page, limit: $limit, where: { name: { _ilike: $name } }) {
      id
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

const UPDATE_USER_STATUS = gql`
  mutation Update_User_Status($user_id: String, $status: String) {
    update_users(_set: { status: $status }, where: { id: { _eq: $user_id } }) {
      returning {
        id
        status
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

function Patients() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [nameToSearch, setNameToSearch] = useState("");
  const [getPatients, { data }] = useLazyQuery(GET_PATIENTS);
  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);
  const debounceSearchTerm = useDebounce(nameToSearch, 500);

  useEffect(() => {
    getPatients({
      variables: {
        name: nameToSearch ? `%${nameToSearch}%` : "%%",
        page,
        limit,
      },
    });
  }, [debounceSearchTerm]);

  const options = {
    download: false,
    sort: false,
    filter: false,
    selectableRows: "none",
    print: false,
    serverSide: true,
    onSearchChange: (searchText) => {
      setNameToSearch(searchText);
    },
    onChangePage: (number) => {
      setPage(number);
    },
    onChangeRowsPerPage: (number) => {
      setLimit(number);
    },
  };

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        display: "excluded",
        viewColumns: false,
      },
    },
    {
      label: "No. de paciente",
      name: "internal_id",
    },
    {
      label: "Nombre",
      name: "name",
    },
    { label: "Email", name: "email" },
    {
      label: "Fecha de inicio",
      name: "starting_date",
      options: {
        customBodyRender: (value) => {
          if (value) return format(new Date(value), "dd/MM/yyyy");
          return "";
        },
      },
    },
    {
      label: "Estatus",
      name: "status",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Statuses
              value={value}
              index={tableMeta.columnIndex}
              change={(event) => {
                updateUserStatus({
                  variables: { user_id: tableMeta.rowData[0], status: event },
                });
                return updateValue(event);
              }}
            />
          );
        },
      },
    },
    { label: "Faltista", name: "not_attend" },
    { label: "Teléfono fijo", name: "phone" },
    { label: "Celular", name: "cellphone" },
    {
      name: "Opciones",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (_, tableMeta) => {
          return (
            <Link
              href={`${COMMON_ROUTES.update_patient}?id=${tableMeta.rowData[0]}`}
            >
              <IconButton size="small">
                <CreateIcon fontSize="small" />
              </IconButton>
            </Link>
          );
        },
      },
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <MUIDataTable
            title="Pacientes"
            data={data?.users}
            columns={columns}
            options={options}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

Patients.auth = true;

export default Patients;

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

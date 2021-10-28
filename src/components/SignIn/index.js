import React, { useState } from "react";

import { Alert } from "@material-ui/lab";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { COMMON_ROUTES } from "constants/routes";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Snackbar } from "@material-ui/core";
import { TextField } from "components/HFMUI";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { signIn } from "next-auth/client";
import signInSchema from "components/SignIn/signInSchema";
import { useForm } from "react-hook-form";
import { useRouter } from "next/dist/client/router";
import { yupResolver } from "@hookform/resolvers/yup";
import Copyright from "../Copyright";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const router = useRouter();
  const [openSnack, setOpenSnack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formOptions = {
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  };
  const { control, handleSubmit, formState } = useForm(formOptions);

  const closeSnackBar = () => {
    setOpenSnack(false);
  };

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);
    const status = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (status.ok) await router.push("/patients");
    else setOpenSnack(true);
    setIsLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Snackbar
          open={openSnack}
          autoHideDuration={6000}
          onClose={closeSnackBar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={closeSnackBar} severity="error">
            Error al tratar de iniciar sesión por favor verifica tus
            credenciales
          </Alert>
        </Snackbar>
        <Typography component="h1" variant="h5">
          Iniciar sesión
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <TextField
            control={control}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={!!formState.errors?.email}
          />
          <TextField
            control={control}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!!formState.errors?.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isLoading}
          >
            Iniciar sesión
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Link href={COMMON_ROUTES.signUp} variant="body2">
                Crear cuenta
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

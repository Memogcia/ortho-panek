import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { COMMON_ROUTES } from "constants/routes";
import Container from "@material-ui/core/Container";
import Copyright from "components/Copyright";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React from "react";
import { TextField } from "components/HFMUI";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import signUpSchema from "components/SignUp/signUpSchema";
import { useForm } from "react-hook-form";
import { useRouter } from "next/dist/client/router";
import { yupResolver } from "@hookform/resolvers/yup";

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const router = useRouter();

  const formOptions = {
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  };
  const { control, handleSubmit, formState } = useForm(formOptions);

  const onSubmit = async ({ name, email, password }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    if (res.ok) router.push("/auth/credentials-signin");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Crear cuenta
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                control={control}
                name="name"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Nombre completo"
                autoFocus
                error={!!formState.errors?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                control={control}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!!formState.errors?.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                control={control}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!formState.errors?.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                control={control}
                variant="outlined"
                required
                fullWidth
                name="passwordConfirmation"
                label="Confirmar contraseña"
                type="password"
                id="password-confirmation"
                error={!!formState.errors?.passwordConfirmation}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Crear cuenta
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href={COMMON_ROUTES.signIn} variant="body2">
                Ya tienes una cuenta? inicia sesión
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

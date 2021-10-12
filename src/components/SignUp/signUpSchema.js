import * as Yup from "yup";

export default Yup.object().shape({
  name: Yup.string().required("El nombre completo es requerido"),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Las contraseñas tienen que coincidir"
  ),
});

import { createTheme, responsiveFontSizes } from "@material-ui/core";

const muiTheme = createTheme();

const theme = responsiveFontSizes({
  ...muiTheme,
});

export default theme;

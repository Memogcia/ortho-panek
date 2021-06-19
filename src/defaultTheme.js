import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';

const muiTheme = createMuiTheme();

const theme = responsiveFontSizes({

  ...muiTheme,
});

export default theme;

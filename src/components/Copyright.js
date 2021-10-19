import Link from "@material-ui/core/Link";
import React from "react";
import Typography from "@material-ui/core/Typography";

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://ecgarcia.com/">
        Ecgarcia
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

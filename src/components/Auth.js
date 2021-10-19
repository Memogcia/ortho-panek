import { Backdrop, CircularProgress } from "@material-ui/core";

import PropTypes from "prop-types";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/client";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Auth({ children }) {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  const isUser = !!session?.user;

  React.useEffect(() => {
    if (loading) return; // Do nothing while loading
    if (!isUser) router.push("/auth/credentials-signin"); // If not authenticated, force log in
  }, [isUser, loading]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <Backdrop className={classes.backdrop} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

Auth.propTypes = {
  children: PropTypes.node,
};

Auth.defaultProps = {
  children: null,
};

export default Auth;

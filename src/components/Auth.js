import React from "react";
import PropTypes from "prop-types";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";

function Auth({ children }) {
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
  return <div>Loading...</div>;
}

Auth.propTypes = {
  children: PropTypes.node,
};

export default Auth;

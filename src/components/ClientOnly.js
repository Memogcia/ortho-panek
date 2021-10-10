import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <> {children}</>;
}

ClientOnly.propTypes = {
  children: PropTypes.node,
};

ClientOnly.defaultProps = {
  children: null,
};

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}

ClientOnly.propTypes = {
  children: PropTypes.node,
};

ClientOnly.defaultProps = {
  children: null,
};

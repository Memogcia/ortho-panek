import 'styles/globals.css';

import PropTypes from 'prop-types';
import { UserProvider } from '@auth0/nextjs-auth0';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.shape({}),
};

MyApp.defaultProps = {
  Component: null,
  pageProps: {},
};

export default MyApp;

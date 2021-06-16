import 'styles/globals.css';

import PropTypes from 'prop-types';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: PropTypes.element,
  pageProps: PropTypes.shape({}),
};

MyApp.defaultProps = {
  Component: null,
  pageProps: {},
};

export default MyApp;

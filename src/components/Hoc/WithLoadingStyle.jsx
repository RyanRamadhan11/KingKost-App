// withLoadingStyle.js

import React from 'react';
import '../../components/Loading/Style.css';

const withLoadingStyle = (WrappedComponent) => {
  const styles = {

    color: 'black',
    padding: '20px',
  };

  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} styles={styles} />;
    }
  };
};

export default withLoadingStyle;

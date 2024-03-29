// Loading.js

import React from 'react';
import withLoadingStyle from '../Hoc/WithLoadingStyle'; // Sesuaikan dengan path HOC Anda

const Loading = ({ styles }) => {
  return (
    <div className='container'>
      <div className='loader' style={styles}>
        <div className='loader--dot'></div>
        <div className='loader--dot'></div>
        <div className='loader--dot'></div>
        <div className='loader--dot'></div>
        <div className='loader--dot'></div>
        <div className='loader--dot'></div>
        <div className='loader--text' style={styles} ></div>
      </div>
    </div>
  );
};

const LoadingWithStyle = withLoadingStyle(Loading);

export default LoadingWithStyle;
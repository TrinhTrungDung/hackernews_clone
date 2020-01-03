import React from 'react';


const Loading = () =>
  <div>Loading...</div>;


const withLoading = (Component) => ({ isLoading, ...remain }) =>
  isLoading
    ? <Loading />
    : <Component { ...remain } />;


export {
  Loading,
  withLoading
};

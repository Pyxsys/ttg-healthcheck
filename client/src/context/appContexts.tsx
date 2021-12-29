import React from 'react';
import AuthProvider from './authContext';
import RealTimeService from './realTimeContext';

/**
 * List of all global contexts for the app.
 * @param {any} param0 contains the child elements
 * @return {JSX.Element}
 */
const AppServices = ({children}: any) => {
  return (
    <>
      <RealTimeService>
        <AuthProvider>
          {children}
        </AuthProvider>
      </RealTimeService>
    </>
  );
};

export default AppServices;

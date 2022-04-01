import React from 'react';
import AuthProvider from './authContext';
import ModalService from './modal.context';
import RealTimeService from './realTimeContext';

/**
 * List of all global contexts for the app.
 * @param {any} param0 contains the child elements
 * @return {JSX.Element}
 */
const AppContexts = ({children}: any) => {
  return (
    <>
      <ModalService>
        <RealTimeService>
          <AuthProvider>{children}</AuthProvider>
        </RealTimeService>
      </ModalService>
    </>
  );
};

export default AppContexts;

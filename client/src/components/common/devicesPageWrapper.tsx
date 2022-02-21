// 3rd Party
import React from 'react';

// Custom
import Navbar from './Navbar';

const DevicesPageWrapper = ({children}: { children: JSX.Element }) => {
  return (
    <div className="h-100 d-flex flex-column">
      <div id="outer-container">
        <Navbar />
      </div>

      <div className="flex-grow-1 d-flex flex-column align-items-center devices-content">
        {children}
      </div>

      <div className="d-flex justify-content-center devices-footer">
        <div className="pt-1 pb-3 devices-copyright">
          &#169; SOEN490 TTG-HEALTCHECK
        </div>
      </div>
    </div>
  );
};

export default DevicesPageWrapper;

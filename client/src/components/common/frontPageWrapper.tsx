// 3rd Party
import React from 'react';

const FrontPageWrapper = ({children}: { children: JSX.Element }) => {
  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex flex-column align-items-center home-header">
        <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center px-3">
          <i className="home-logo"></i>
        </div>
        <i className="bottom-triangle"></i>
      </div>

      <div className="flex-grow-1 d-flex flex-column align-items-center home-content">
        {children}
      </div>

      <div className="d-flex justify-content-center home-footer">
        <div className="pt-1 pb-3 home-copyright">
          &#169; SOEN490 TTG-HEALTCHECK
        </div>
      </div>
    </div>
  );
};

export default FrontPageWrapper;

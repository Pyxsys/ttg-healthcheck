// 3rd Party
import React from 'react';
import {HiLogout} from 'react-icons/hi';
import axios from 'axios';

// Custom
import {useAuth} from '../../context/authContext';

const Pending = () => {
  const {setUser, setIsAuthenticated} = useAuth();
  const logout = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    await axios
        .get('api/user/logout')
        .then((response) => {
          if (response.data) {
            setUser({_id: '', name: '', role: '', avatar: ''});
            setIsAuthenticated(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };
  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex flex-column align-items-center home-header">
        <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center px-3">
          <h1 className="pending-header"> Your account is pending approval</h1>
          <a className="pending-logout" href="/" onClick={(e) => logout(e)}>
            <HiLogout />
            <span>&nbsp;Logout</span>
          </a>
        </div>
        <i className="bottom-triangle"></i>
      </div>
      <div className="flex-grow-1 d-flex flex-column align-items-center home-content"></div>
      <div className="d-flex justify-content-center home-footer">
        <div className="pt-1 pb-3 home-copyright">
          &#169; SOEN490 TTG-HEALTCHECK
        </div>
      </div>
    </div>
  );
};

export default Pending;

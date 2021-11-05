import React from 'react';
import {Nav} from 'react-bootstrap';
import {IconContext} from 'react-icons';
import {MdOutlineSpaceDashboard, MdAnalytics, MdLogout} from 'react-icons/md';
import {DiRasberryPi} from 'react-icons/di';
import {CgProfile} from 'react-icons/cg';
import axios from 'axios';
import {useAuth} from '../context/authContext';
import {slide as Menu} from 'react-burger-menu';

const Navbar = () => {
  const {setUser, setIsAuthenticated} = useAuth();

  const logout = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    await axios
        .get('api/user/logout')
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            setUser({name: '', role: ''});
            setIsAuthenticated(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };

  return (
    <>
      <Menu pageWrapId={'page-wrap'} outerContainerId={'outer-container'}>
        <Nav.Link className="text-secondary mt-5" href="/dashboard">
          <IconContext.Provider value={{size: '2em'}}>
            <div>
              <MdOutlineSpaceDashboard />
            </div>
          </IconContext.Provider>
        </Nav.Link>
        <Nav.Link className="text-secondary mt-5" href="/devices">
          <IconContext.Provider value={{size: '2em'}}>
            <div>
              <DiRasberryPi />
            </div>
          </IconContext.Provider>
        </Nav.Link>
        <Nav.Link className="text-secondary mt-5" href="/dashboard">
          <IconContext.Provider value={{size: '2em'}}>
            <div>
              <MdAnalytics />
            </div>
          </IconContext.Provider>
        </Nav.Link>
        <Nav.Link className="text-secondary mt-5" href="/dashboard">
          <IconContext.Provider value={{size: '2em'}}>
            <div>
              <CgProfile />
            </div>
          </IconContext.Provider>
        </Nav.Link>
        <Nav.Link
          className="text-secondary mt-5"
          href="/logout"
          onClick={(e) => logout(e)}
        >
          <IconContext.Provider value={{size: '2em'}}>
            <div>
              <MdLogout />
            </div>
          </IconContext.Provider>
        </Nav.Link>
      </Menu>
    </>
  );
};
export default Navbar;

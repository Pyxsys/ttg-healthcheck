import React, {useState} from 'react';
// 3rd Party
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Squash as Hamburger} from 'hamburger-react';
import {DiRasberryPi} from 'react-icons/di';
import {MdOutlineSpaceDashboard, MdLogout} from 'react-icons/md';
import useOnclickOutside from 'react-cool-onclickoutside';
// Custom
import {useAuth} from '../../context/authContext';

// side nav items
const SideNavData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <MdOutlineSpaceDashboard />,
    cName: 'side-nav-item',
  },
  {
    title: 'Devices',
    path: '/devices',
    icon: <DiRasberryPi />,
    cName: 'side-nav-item',
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <MdLogout />,
    cName: 'side-nav-item',
  },
];

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const ref = useOnclickOutside(() => {
    setOpen(false);
  });
  const {setUser, setIsAuthenticated} = useAuth();
  const logout = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    await axios
        .get('api/user/logout')
        .then((response) => {
          if (response.data) {
            setUser({_id: '', name: '', role: ''});
            setIsAuthenticated(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };

  return (
    <>
      <div className="d-flex nav-wrapper">
        <div ref={ref} className="nav-hamburger">
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
      </div>
      {isOpen ? (
        <div ref={ref} className="side-nav active">
          {SideNavData.map((item, index) => {
            return (
              <div
                key={index}
                className={item.cName}
                onClick={() => setOpen(false)}
              >
                <Link
                  to={item.path}
                  onClick={
                    item.title == 'Logout' ? (e) => logout(e) : (e) => null
                  }
                >
                  <span className="side-nav-item-icon">{item.icon} </span>
                  <span className="side-nav-item-text">{item.title}</span>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="side-nav"></div>
      )}
      {isOpen && <div className="side-nav-screen-background"></div>}
    </>
  );
};
export default Navbar;

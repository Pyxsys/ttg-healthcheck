import React from 'react';
// 3rd Party
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Squash as Hamburger} from 'hamburger-react';
import {DiRasberryPi} from 'react-icons/di';
import {GoTriangleDown} from 'react-icons/go';
import {MdOutlineSpaceDashboard, MdAnalytics, MdLogout} from 'react-icons/md';
import {CgProfile} from 'react-icons/cg';
// Custom
import {useAuth} from '../context/authContext';
import useComponentVisible from './common/useComponentVisible';

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
    title: 'Analytics',
    path: '/analytics',
    icon: <MdAnalytics />,
    cName: 'side-nav-item',
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: <CgProfile />,
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
  // event listener to close outside side-nav
  const {ref, isComponentVisible, setIsComponentVisible} =
  useComponentVisible();
  const {setUser, setIsAuthenticated} = useAuth();
  const logout = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    await axios
        .get('api/user/logout')
        .then((response) => {
          if (response.data) {
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
      <nav
        className="d-flex nav-wrapper"
      >
        <div ref={ref} className="nav-hamburger">
          <Hamburger toggled={isComponentVisible} toggle={setIsComponentVisible} />
        </div>
        <div className="nav-right-menu d-flex">
          <div className="nav-right-icon">
            <img src="https://avatarfiles.alphacoders.com/247/247895.jpg"></img>
          </div>
          <div className="nav-right-darrow">
            <GoTriangleDown/>
          </div>
        </div>
        {isComponentVisible ?
        <div ref={ref} className="side-nav active">
          {SideNavData.map((item, index) => {
            return (
              <>
                <div key={index} className={item.cName}>
                  <Link to={item.path} onClick={item.title == 'Logout' ? ((e) => logout(e)) : (e) => null}>
                    <span className="side-nav-item-icon">{item.icon} </span>
                    <span className="side-nav-item-text">{item.title}</span>
                  </Link>
                </div>
              </>
            );
          })}
        </div> :
        <div className="side-nav">
        </div>
        }
        {isComponentVisible &&
          <div className="side-nav-screen-background"></div>
        }
      </nav>
    </>
  );
};
export default Navbar;

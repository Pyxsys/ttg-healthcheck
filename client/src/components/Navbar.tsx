import React from 'react';
// 3rd Party
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Squash as Hamburger} from 'hamburger-react';
import {DiRasberryPi} from 'react-icons/di';
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
    cName: 'nav-item-wrapper',
  },
  {
    title: 'Devices',
    path: '/devices',
    icon: <DiRasberryPi />,
    cName: 'nav-item-wrapper',
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: <MdAnalytics />,
    cName: 'nav-item-wrapper',
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: <CgProfile />,
    cName: 'nav-item-wrapper',
  },
  {
    title: 'Logout',
    path: '/',
    icon: <MdLogout />,
    cName: 'nav-item-wrapper',
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
        className='d-flex nav-wrapper'
      >
        <div ref={ref} className={isComponentVisible ? 'nav-hamburger active' : 'nav-hamburger'}>
          <Hamburger toggled={isComponentVisible} toggle={setIsComponentVisible} />
        </div>
        {isComponentVisible ?
        <div ref={ref} className='side-nav active'>
          {SideNavData.map((item, index) => {
            return (
              <div key={index} className={item.cName}>
                <Link to={item.path} onClick={item.title == 'Logout' ? ((e) => logout(e)) : (e) => {}}>
                  <span className="nav-item-logo">{item.icon} </span>
                  <span className="nav-item-text">{item.title}</span>
                </Link>
              </div>
            );
          })}
        </div> :
        <div className='side-nav'>
        </div>
        }
      </nav>
    </>
  );
};
export default Navbar;

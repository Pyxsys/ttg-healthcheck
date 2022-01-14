import React from 'react';
import {useRef} from 'react';
// 3rd Party
import axios from 'axios';
import {Squash as Hamburger} from 'hamburger-react';
import {DiRasberryPi} from 'react-icons/di';
import {MdOutlineSpaceDashboard, MdAnalytics, MdLogout} from 'react-icons/md';
import {CgProfile} from 'react-icons/cg';
// Custom
import {useAuth} from '../context/authContext';

const Navbar = () => {
  const sideMenu = useRef<any>();
  const navBar = useRef<any>();
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

  const openNav = () => {
    sideMenu.current.style.width = '250px';
    navBar.current.style.position = 'fixed';
    navBar.current.style.top = '0';
  };

  const closeNav = () => {
    sideMenu.current.style.width = '0';
    navBar.current.style.position = 'static';
  };

  return (
    <>
      <div className='sidenav' ref={sideMenu}>
        <div className='d-flex nav-items-wrapper'>
          <a className="nav-items-logo" href="/dashboard"><MdOutlineSpaceDashboard /></a>
          <a className="nav-items-text" href="/dashboard">Dashboard</a>
        </div>
        <div className='d-flex nav-items-wrapper'>
          <a className="nav-items-logo" href="/devices"><DiRasberryPi /></a>
          <a className="nav-items-text" href="/devices">Devices</a>
        </div>
        <div className='d-flex nav-items-wrapper'>
          <a className="nav-items-logo"><MdAnalytics /></a>
          <a className="nav-items-text">Analytics</a>
        </div>
        <div className='d-flex nav-items-wrapper'>
          <a className="nav-items-logo"><CgProfile /></a>
          <a className="nav-items-text">Profile</a>
        </div>
        <div className='d-flex nav-items-wrapper'>
          <a className="nav-items-logo"><MdLogout /></a>
          <a className="nav-items-text" onClick={(e) => logout(e)}>Exit</a>
        </div>
        <DiRasberryPi />
      </div>
      <div
        className='d-flex nav-wrapper'
      >
        <div className='nav-hamburger' ref={navBar}>
          <Hamburger rounded color={'white'} size={33} onToggle={(toggled) => {
            if (toggled) {
              openNav();
            } else {
              closeNav();
            }
          }} />
        </div>
      </div>
    </>
  );
};
export default Navbar;

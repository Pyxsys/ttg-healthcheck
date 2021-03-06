/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, {useState, useMemo} from 'react';
// 3rd Party
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Squash as Hamburger} from 'hamburger-react';
import {DiRasberryPi} from 'react-icons/di';
import {
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
} from 'react-icons/md';
import useOnclickOutside from 'react-cool-onclickoutside';
import {Dropdown} from 'react-bootstrap';
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
    title: 'Analytics',
    path: '/analytics',
    icon: <MdOutlineAnalytics />,
    cName: 'side-nav-item',
  },
];

const Navbar = (props: any) => {
  const [isOpen, setOpen] = useState(false);
  const ref = useOnclickOutside(() => {
    setOpen(false);
  });
  const {user, setUser, setIsAuthenticated} = useAuth();
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

  // Custom toggle for right navigation
  type Props = any
  type Ref = HTMLDivElement
  const CustomToggle = useMemo(
      () =>
        React.forwardRef<Ref, Props>(({onClick}, ref1) => (
          <div
            ref={ref1}
            onClick={(e) => {
              e.preventDefault();
              onClick(e);
            }}
          >
            <div className="nav-right-icon">
              <img src={user.avatar}></img>
            </div>
          </div>
        )),
      [user],
  );

  return (
    <>
      <div className="d-flex nav-wrapper">
        <div ref={ref} className="nav-hamburger">
          <Hamburger toggled={isOpen} toggle={setOpen} size={28} />
        </div>
        <div className="nav-page-title">{props.name}</div>
        <div>
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText>
                <div className="nav-right-font">
                  Signed in as
                  <div className="fw-bold">{user.name}</div>
                </div>
              </Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="1" href={`/user-profile?Id=${user._id}`}>
                <div id="profile" className="nav-right-font">
                  Profile
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="1"
                style={
                  user.role == 'admin' ?
                    {display: 'block'} :
                    {display: 'none'}
                }
                href={'/admin'}
              >
                <div className="nav-right-font">Admin panel</div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="2">
                <div
                  id="logout"
                  className="nav-right-font"
                  onClick={(e) => logout(e)}
                >
                  Sign out
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
                <Link to={item.path}>
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

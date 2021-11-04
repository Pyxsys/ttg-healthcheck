import React from 'react';
import {Col, Container, Nav, Row} from 'react-bootstrap';
import {IconContext} from 'react-icons';
import {MdOutlineSpaceDashboard, MdAnalytics, MdLogout} from 'react-icons/md';
import {DiRasberryPi} from 'react-icons/di';
import {CgProfile} from 'react-icons/cg';
import axios from 'axios';
import {useAuth} from '../context/authContext';

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
      <Col className="h-100 col-auto">
        <Nav className="h-100 bg-primary" activeKey="/dashboard">
          <Container className="align-items-start h-100">
            <Row className="p-2">
              <Col>
                <Nav.Item>
                  <Nav.Link className="text-secondary mt-5" href="/dashboard">
                    <IconContext.Provider value={{size: '2em'}}>
                      <div>
                        <MdOutlineSpaceDashboard />
                      </div>
                    </IconContext.Provider>
                  </Nav.Link>
                </Nav.Item>
              </Col>
            </Row>
            <Row className="p-2">
              <Col>
                <Nav.Item>
                  <Nav.Link className="text-secondary mt-5" href="/devices">
                    <IconContext.Provider value={{size: '2em'}}>
                      <div>
                        <DiRasberryPi />
                      </div>
                    </IconContext.Provider>
                  </Nav.Link>
                </Nav.Item>
              </Col>
            </Row>
            <Row className="p-2">
              <Col>
                <Nav.Item>
                  <Nav.Link className="text-secondary mt-5" href="/dashboard">
                    <IconContext.Provider value={{size: '2em'}}>
                      <div>
                        <MdAnalytics />
                      </div>
                    </IconContext.Provider>
                  </Nav.Link>
                </Nav.Item>
              </Col>
            </Row>
            <Row className="p-2">
              <Col>
                <Nav.Item>
                  <Nav.Link className="text-secondary mt-5" href="/dashboard">
                    <IconContext.Provider value={{size: '2em'}}>
                      <div>
                        <CgProfile />
                      </div>
                    </IconContext.Provider>
                  </Nav.Link>
                </Nav.Item>
              </Col>
            </Row>
            <Row className="mb-auto p-2">
              <Col>
                <Nav.Item>
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
                </Nav.Item>
              </Col>
            </Row>
          </Container>
        </Nav>
      </Col>
    </>
  );
};
export default Navbar;

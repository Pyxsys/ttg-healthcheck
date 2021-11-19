import {Button, Form, Container, Col, Row} from 'react-bootstrap';
import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/authContext';

const Login = () => {
  interface AxiosResult {
    message: string
    user: {
      name: string
      role: string
    }
  }

  const {setUser, setIsAuthenticated} = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const {email, password} = formData;

  const onChange1 = (e: React.ChangeEvent<any>) =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const body = {
      email: formData.email,
      password: formData.password,
    };
    await axios
        .post<AxiosResult>('api/user/login', body)
        .then((response) => {
          if (response.data) {
            setUser(response.data.user);
            setIsAuthenticated(true);
            setLoggedIn(true);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };

  if (loggedIn) {
    return <Redirect to="/dashboard" />;
  }

  if (loggedIn) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <>
      <div
        className="align-items-center d-flex
         justify-content-center background-image-login"
      >
        <Container
          className="w-25 border increase-roundness rounded-lg d-flex
          justify-content-center bg-secondary"
        >
          <Row className="w-75 mb-5 mt-5">
            <Col>
              <h1 className="text-center">LOGIN</h1>
              <Row className="mb-4">
                <Form onSubmit={(e) => onSubmit(e)}>
                  <Form.Group>
                    <Form.Label className="ml-0 mb-3">Email Address</Form.Label>
                    <Form.Control
                      className="mb-3 email"
                      type="email"
                      placeholder="Email ID"
                      name="email"
                      value={email}
                      onChange={(e) => onChange1(e)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="mb-3">Password</Form.Label>
                    <Form.Control
                      className="mb-3"
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={(e) => onChange1(e)}
                    />
                  </Form.Group>
                  <Button className="w-100 mt-3 login-button" type="submit">
                    Login
                  </Button>
                  <Link to="/signup">
                    <Button className="w-100 mt-3">Signup</Button>
                  </Link>
                </Form>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Login;

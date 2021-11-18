/* eslint-disable max-len*/
import {Button, Form, Container, Col, Row} from 'react-bootstrap';
import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/authContext';
import '../App.scss';
import {notificationService} from '../services/notification.service';

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

  const [formData1, setFormData1] = useState({
    email1: '',
    password1: '',
  });

  const {email1, password1} = formData1;

  const onChange1 = (e: React.ChangeEvent<any>) =>
    setFormData1({...formData1, [e.target.name]: e.target.value});

  const onSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    // check that email is not empty and less than 80 characters
    const emailValid =
      formData1.email1.length < 80 && formData1.email1.length > 0;
    // check that password is not empty and less than 45 characters
    const passwordValid =
      formData1.password1.length < 45 && formData1.password1.length > 0;
    // check that all conditions are true
    const allValid = emailValid && passwordValid;
    if (allValid) {
      const body = {
        email: formData1.email1,
        password: formData1.password1,
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
    } else {
      // call to incorrect input handler
      handleIncorrectInput(emailValid, passwordValid);
    }
  };
  const handleIncorrectInput = (
      emailValid: boolean,
      passwordValid: boolean,
  ) => {
    // since the specific conditions are passed as parameters, you can use that information to display whatever it is that you like, depending on the situation.
    if (!emailValid) {
      notificationService.error(
          'Invalid Email! The email you entered is incorrect or an account for this email does not exist!',
      );
    }
    if (!passwordValid) {
      notificationService.error(
          'Invalid Password! The password you entered is incorrect!',
      );
    }
  };

  if (loggedIn) {
    notificationService.success('Logged in succesfully!');
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
                      className="mb-3"
                      type="email"
                      placeholder="Email ID"
                      name="email1"
                      value={email1}
                      onChange={(e) => onChange1(e)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="mb-3">Password</Form.Label>
                    <Form.Control
                      className="mb-3"
                      type="password"
                      placeholder="Password"
                      name="password1"
                      value={password1}
                      onChange={(e) => onChange1(e)}
                    />
                  </Form.Group>
                  <Button className="w-100 mt-3" type="submit">
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

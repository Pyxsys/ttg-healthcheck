/* eslint-disable max-len*/
import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/authContext';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {notificationService} from '../services/notification.service';
const {handleIncorrectInputSignup} = require('./shared/inputValidation');

const Signup = () => {
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
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const {name, email, password, password2} = formData;

  const onChange = (e: React.ChangeEvent<any>) =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const register = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const regex = /^[A-Za-z0-9 -]+$/;
    // check if name does not include symbols and that length is less than 45
    const nameValid = regex.test(name) && name.length < 45 && name.length > 0;
    // check that email is not empty and less than 80 characters
    const emailValid = email.length < 80 && email.length > 0;
    // check if password is less than 45 characters
    const passwordValid = password.length < 45 && password.length > 0;
    // check if password 2 matches password
    const passwordMatch = password === password2 && password2.length > 0;
    // check if all is valid
    const allValid = passwordMatch && passwordValid && nameValid;
    // only if allValid will the function continue
    if (allValid) {
      const body = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
      };
      const res = await axios
          .post<AxiosResult>('api/user/register', body)
          .catch((error) => {
            if (error.response) {
            // Request made and server responded
              notificationService.error(
                  'An account with the following email already exists! ',
              );
            } else if (error.request) {
            // The request was made but no response was received
              notificationService.error(
                  'The request was made but no response was received!',
              );
            } else {
            // Something happened in setting up the request that triggered an Error
              notificationService.error(
                  'Something happened in setting up the request that triggered an Error!',
              );
            }
            return error;
          });
      if (res.data) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setLoggedIn(true);
      }
    } else {
      handleIncorrectInputSignup(
          nameValid,
          emailValid,
          passwordValid,
          passwordMatch,
      );
    }
  };
  if (loggedIn) {
    notificationService.success('New account succesfully created!');
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
              <h1 className="text-center">SIGNUP</h1>
              <Row className="mb-4">
                <Form onSubmit={(e: any) => register(e)}>
                  <Form.Group>
                    <Form.Label className="ml-0 mb-3">Name</Form.Label>
                    <Form.Control
                      className="mb-3"
                      type="name"
                      placeholder="Enter name"
                      name="name"
                      value={name}
                      onChange={(e: any) => onChange(e)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="ml-0 mb-3">Email Address</Form.Label>
                    <Form.Control
                      className="mb-3"
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={email}
                      onChange={(e: any) => onChange(e)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="mb-3">Password</Form.Label>
                    <Form.Control
                      className="mb-3"
                      type="password"
                      placeholder="password"
                      name="password"
                      value={password}
                      onChange={(e: any) => onChange(e)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="mb-3">Confirm Password</Form.Label>
                    <Form.Control
                      className="mb-3"
                      type="password"
                      placeholder="password"
                      name="password2"
                      value={password2}
                      onChange={(e: any) => onChange(e)}
                    />
                  </Form.Group>
                  <Button className="w-100 mt-3" type="submit">
                    Signup
                  </Button>
                  <Link to="/">
                    <Button className="w-100 mt-3">Back</Button>
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

export default Signup;

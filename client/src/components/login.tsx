// 3rd Party
import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Button, Form, Container, Col, Row} from 'react-bootstrap';

// Custom
import {useAuth} from '../context/authContext';
import {notificationService} from '../services/notification.service';
import {handleIncorrectInput, sendRequest} from './common/inputValidation';
import '../App.scss';

const Login = () => {
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
    if (handleIncorrectInput(formData.email, formData.password, 'login')) {
      try {
        const res = await sendRequest(formData.email, formData.password, 'login') as any;
        if (res.data) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          setLoggedIn(true);
        }
      } catch (error) {
        notificationService.error(
            'Invalid Email or Password! Either the email or password you have entered is invalid!',
        );
      }
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
                <Form onSubmit={(e: any) => onSubmit(e)}>
                  <Form.Group>
                    <Form.Label className="ml-0 mb-3">Email Address</Form.Label>
                    <Form.Control
                      className="mb-3 email"
                      type="email"
                      placeholder="Email ID"
                      name="email1"
                      value={email}
                      onChange={(e: any) => onChange1(e)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="mb-3">Password</Form.Label>
                    <Form.Control
                      className="mb-3"
                      type="password"
                      placeholder="Password"
                      name="password1"
                      value={password}
                      onChange={(e: any) => onChange1(e)}
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

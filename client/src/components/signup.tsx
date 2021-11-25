// 3rd Party
import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Button, Container, Form, Row} from 'react-bootstrap';

// Custom
import {useAuth} from '../context/authContext';
import {notificationService} from '../services/notification.service';
import {handleIncorrectInput, sendRequest} from './common/inputValidation';

const Signup = () => {
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
    if (handleIncorrectInput(email, password, name, password2)) {
      const res = (await sendRequest(email, password, name, password2)) as any;
      if (res.data) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setLoggedIn(true);
      }
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
          style={{width: 'fit-content'}}
          className="border increase-roundness rounded-lg
            justify-content-center bg-secondary"
        >
          <Row className="mb-5 mt-5">
            <div className="col d-flex px-5">
              <div className="flex-col">
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
                      <Form.Label className="ml-0 mb-3">
                        Email Address
                      </Form.Label>
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
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Signup;

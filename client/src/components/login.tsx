// 3rd Party
import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Button, Form, InputGroup} from 'react-bootstrap';

// Custom
import {useAuth} from '../context/authContext';
import {notificationService} from '../services/notification.service';
import {handleIncorrectInput, sendRequest} from './common/inputValidation';
import '../App.scss';

const Login = () => {
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
    if (handleIncorrectInput(formData1.email1, formData1.password1, 'login')) {
      try {
        const res = (await sendRequest(
            formData1.email1,
            formData1.password1,
            'login',
        )) as any;
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
      <div className="login-header-container">
        <div className="login-header-title">PI-HEALTH</div>
        <div className="login-header-subtitle">
          Dear user, log in to manage pi devices!
        </div>
      </div>
      <div className="login-form-container">
        <div className="login-form">
          <Form onSubmit={(e: any) => onSubmit(e)}>
            <Form.Group className="login-space-input">
              <InputGroup className="mb-2">
                <InputGroup.Text>@</InputGroup.Text>
                <Form.Control
                  size="sm"
                  className="login-input-size"
                  type="email"
                  placeholder="Email"
                  name="email1"
                  value={email1}
                  onChange={(e: any) => onChange1(e)}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <InputGroup className="mb-2">
                <InputGroup.Text>@</InputGroup.Text>
                <Form.Control
                  size="sm"
                  className="login-input-size"
                  type="password"
                  placeholder="Password"
                  name="password1"
                  value={password1}
                  onChange={(e: any) => onChange1(e)}
                />
              </InputGroup>
            </Form.Group>
            <Button className="w-100 mt-3 login-input-size" type="submit">
              Login
            </Button>
            <Link to="/signup">
              <Button className="w-100 mt-3 login-input-size">Signup</Button>
            </Link>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;

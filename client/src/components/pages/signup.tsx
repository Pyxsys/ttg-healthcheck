// 3rd Party
import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Button, InputGroup, Form} from 'react-bootstrap';
import {FaUserAlt, FaKey, FaLock, FaRegEnvelope} from 'react-icons/fa';

// Custom
import {useAuth} from '../../context/authContext';
import {notificationService} from '../../services/notification.service';
import {handleIncorrectInput, sendRequest} from '../common/inputValidation';
import FrontPageWrapper from '../common/frontPageWrapper';

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
    <FrontPageWrapper>
      <div className="home-form">
        <Form onSubmit={(e: any) => register(e)}>
          <Form.Group>
            <InputGroup>
              <InputGroup.Text>
                <FaUserAlt />
              </InputGroup.Text>
              <Form.Control
                size="sm"
                className="home-input"
                type="name"
                placeholder="Full Name"
                name="name"
                value={name}
                onChange={(e: any) => onChange(e)}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mt-3">
            <InputGroup>
              <InputGroup.Text>
                <FaRegEnvelope />
              </InputGroup.Text>
              <Form.Control
                size="sm"
                className="home-input"
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e: any) => onChange(e)}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mt-3">
            <InputGroup>
              <InputGroup.Text>
                <FaKey />
              </InputGroup.Text>
              <Form.Control
                size="sm"
                className="home-input"
                type="password"
                placeholder="Choose Password"
                name="password"
                value={password}
                onChange={(e: any) => onChange(e)}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mt-3">
            <InputGroup>
              <InputGroup.Text>
                <FaLock />
              </InputGroup.Text>
              <Form.Control
                size="sm"
                className="home-input"
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={password2}
                onChange={(e: any) => onChange(e)}
              />
            </InputGroup>
          </Form.Group>
          <Button className="w-100 mt-3 home-button" type="submit">
            Register
          </Button>
          <Link to="/">
            <Button className="w-100 mt-3 home-button">Back</Button>
          </Link>
        </Form>
      </div>
    </FrontPageWrapper>
  );
};

export default Signup;

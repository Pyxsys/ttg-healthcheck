/* eslint-disable max-len*/
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/authContext';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';

interface CollectionEvent {
  _id: string
  collection?: string
  operation?: string
  updatedFields?: any
}

const Signup = () => {
  const [realTimeData, setRealTimeData] = useState([] as CollectionEvent[]);
  const [collectionData, setCollectionData] = useState(
    null as CollectionEvent | null,
  );

  useEffect(() => {
    if (collectionData) {
      setRealTimeData([...realTimeData, collectionData]);
    }
  }, [collectionData]);

  useEffect(() => {
    const ws1 = new WebSocket('ws://localhost:5000/?collection=cpu_logs');
    const ws2 = new WebSocket('ws://localhost:5000/?collection=memory_logs');

    ws1.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const realTimeData: CollectionEvent = {
        _id: data.documentKey._id,
        collection: 'cpu',
        operation: data.operationType,
        updatedFields:
          data.operationType === 'update' ?
            data.updateDescription.updatedFields :
            data.fullDocument,
      };
      setCollectionData(realTimeData);
    };

    ws2.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const realTimeData: CollectionEvent = {
        _id: data.documentKey._id,
        collection: 'memory',
        operation: data.operationType,
        updatedFields:
          data.operationType === 'update' ?
            data.updateDescription.updatedFields :
            data.fullDocument,
      };
      setCollectionData(realTimeData);
    };

    return () => {
      ws1.close();
      ws2.close();
    };
  }, []);

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
    const regex = /^[A-Za-z0-9]+$/;
    // check if name does not include symbols and that length is less than 45
    const nameValid = regex.test(name) && name.length < 45;
    // check if password is less than 45 characters
    const passwordValid = password.length < 45;
    // check if password 2 matches password
    const passwordMatch = password === password2;
    // check if all is valid
    const allValid = passwordMatch && passwordValid && nameValid;
    // only if allValid will the function continue
    if (allValid) {
      const newUser = {
        name,
        email,
        password,
        password2,
      };
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const body = JSON.stringify(newUser);
        await axios
            .post<AxiosResult>('/api/user/register', body, config)
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
      } catch (err) {
        console.error(err);
      }
    } else {
      handleIncorrectInput(nameValid, passwordValid, passwordMatch);
    }
  };
  const handleIncorrectInput = (nameValid: boolean, passwordValid: boolean, passwordMatch: boolean) => {
    // since the specific conditions are passed as parameters, you can use that information to display whatever it is that you like, depending on the situation.
    if (!nameValid) {
      // do whatever you want here
    }
    if (!passwordValid) {
      // do whatever you want here
    }
    if (!passwordMatch) {
      // do whatever you want here
    }
  };
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
              <h1 className="text-center">SIGNUP</h1>
              <Row className="mb-4">
                <Form onSubmit={(e) => register(e)}>
                  <Form.Group>
                    <Form.Label className="ml-0 mb-3">Name</Form.Label>
                    <Form.Control
                      className="mb-3"
                      type="name"
                      placeholder="Enter name"
                      name="name"
                      value={name}
                      onChange={(e) => onChange(e)}
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
                      onChange={(e) => onChange(e)}
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
                      onChange={(e) => onChange(e)}
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
                      onChange={(e) => onChange(e)}
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

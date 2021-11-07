import {Button, Form, Container, Col, Row} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/authContext';
import '../App.scss';

interface CollectionEvent {
  _id: string
  collection?: string
  operation?: string
  updatedFields?: any
}

const Login = () => {
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
      console.log('event from cpu: ', JSON.parse(event.data));

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
      console.log('event from mem: ', JSON.parse(event.data));

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

  const [formData1, setFormData1] = useState({
    email1: '',
    password1: '',
  });

  const {email1, password1} = formData1;

  const onChange1 = (e: React.ChangeEvent<any>) =>
    setFormData1({...formData1, [e.target.name]: e.target.value});

  const onSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const body = {
      email: formData1.email1,
      password: formData1.password1,
    };
    await axios
        .post<AxiosResult>('api/user/login', body)
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            setUser(response.data.user);
            setIsAuthenticated(true);
            setLoggedIn(true);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };

  /* const logout = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    await axios
        .get('api/user/logout')
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            setUser({name: '', role: ''});
            setIsAuthenticated(false);
            setLoggedIn(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };
*/
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

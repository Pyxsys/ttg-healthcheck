import React from 'react';
import {useAuth} from '../context/authContext';
import Navbar from './nav';
import {Col, Row} from 'react-bootstrap';

const Dashboard = () => {
  const {user} = useAuth();
  return (
    <div>
      <Row className="h-100">
        <Navbar />
        <Col>
          <div className="">
            dashboard, user: {user.name}, role: {user.role}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

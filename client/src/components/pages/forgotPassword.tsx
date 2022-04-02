// 3rd Party
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Form, InputGroup} from 'react-bootstrap';
import {FaCheck, FaUserAlt} from 'react-icons/fa';

// Custom
import {notificationService} from '../../services/notification.service';
import FrontPageWrapper from '../common/frontPageWrapper';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const sumbitForgotForm = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    await axios.post<{message: string}>('api/user/requestResetPassword', {email: email})
        .then((res) => {
          notificationService.success(res.data.message);
          setEmailSent(true);
        })
        .catch((err) => {
          notificationService.error(err.response.data);
        });
  };

  return (
    <FrontPageWrapper>
      <div>
        {emailSent ?
        <>
          <div className="d-flex flex-column align-items-center text-white w-50">
            <h1><FaCheck /> Email Sent</h1>
            <div className="pt-3">
              <h3>Please check your email at: </h3>
              <h5 className="text-muted">{email}</h5>
            </div>
          </div>
        </> : <div className="home-form">
          <div className="pb-4 home-header-subtitle">
            Send an email to reset you password
          </div>
          <Form onSubmit={(e: any) => sumbitForgotForm(e)}>
            <Form.Group>
              <InputGroup>
                <InputGroup.Text>
                  <FaUserAlt />
                </InputGroup.Text>
                <Form.Control
                  className="home-input"
                  name="email"
                  type="email"
                  placeholder="Email"
                  size="sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
            <Button className="w-100 mt-3 home-button" type="submit">
              Send Email
            </Button>
            <Link to="/">
              <Button className="w-100 mt-3 home-button">Back</Button>
            </Link>
          </Form>
        </div>}
      </div>
    </FrontPageWrapper>
  );
};

export default ForgotPassword;

// Third party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Button, Form, InputGroup} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';

// Custom
import Navbar from '../common/Navbar';
import {IUserObject} from '../../types/users';
import {IProfileResponse} from '../../types/queries';
import {useAuth} from '../../context/authContext';

const UserProfile = (props: any) => {
  const userId: string = props.location.search.replace('?Id=', '');
  const [inputDisabled, setInputDisabled] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [inputDisabled1, setInputDisabled1] = useState(true);
  const [applyDisabled, setApplyDisabled] = useState(true);
  const {user} = useAuth();
  const [formData, setFormData] = useState({
    _id: '',
    originalName: '',
    name: '',
    email: '',
    avatar: '',
    role: '',
  } as IUserObject);
  const {name, email, avatar, role, _id, originalName} = formData;

  const onSubmit = async (e: React.ChangeEvent<any>) => {
    console.log(e);
  };

  // Account information onchange
  const onChange = (e: any) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setApplyDisabled(false);
    console.log(formData);
  };

  // Retrieve user info based on url ID
  const userInfo = async (userId: string) => {
    await axios.get<IProfileResponse<IUserObject>>(
        'api/user/profile',
        {
          params: {userId: userId},
        },
    )
        .then((result) => {
          setFormData({
            ['_id']: result.data.Results._id,
            ['originalName']: result.data.Results.name,
            ['name']: result.data.Results.name,
            ['email']: result.data.Results.email,
            ['avatar']: result.data.Results.avatar,
            ['role']: result.data.Results.role,
          });
        })
        .catch(() => {
          setRedirect(true);
        });
  };

  // Hide img while loading not to show a white border
  const [didLoad, setLoad] = useState(false);
  const imageStyle = didLoad ? {} : {display: 'none'};

  useEffect(() => {
    // User should be only allowed on his profile page, else redirect
    (user.role == 'user' && user._id !== userId ? setRedirect(true) : userInfo(userId));
  }, []);

  // User should be only allowed on his profile page, else redirect
  if (redirect) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="h-100 d-flex flex-column">
      <Navbar />
      <div className="user-profile-content pt-5">
        {/* Table */}
        <div className="d-flex flex-column container user-profile-container">
          <div className="flex-grow-1 table-container mt-4 ms-2 me-2 mb-4">
            <table>
              <tbody>
                <tr>
                  <td>
                    <div className="user-profile-img-container">
                      <img
                        className="user-profile-img"
                        src={avatar}
                        style={imageStyle}
                        onLoad={() => setLoad(true)}
                      />
                    </div>
                    <div className="user-profile-img-spacing"></div>
                  </td>
                  <td className="user-profile-header">
                    <h1>{originalName}</h1>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <div className="user-profile-inner-container">
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <h5 className="color-white">Account Information</h5>
                      </td>
                      <td>
                        &emsp;
                        <Button
                          size='sm'
                          onClick={() => setInputDisabled(!inputDisabled)}
                          className="btn btn-primary color-white"
                        >
                          Edit Profile
                        </Button>
                      </td>
                      <td>
                        &nbsp;
                        <Button
                          size='sm'
                          className="btn btn-primary color-white"
                          form="account-info-form"
                          disabled={applyDisabled}
                          type="submit"
                        >
                          Apply
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <form id="account-info-form" onSubmit={(e: any) => onSubmit(e)}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <InputGroup>
                            <InputGroup.Text className="user-profile-input-label">
                              ACCOUNT NAME
                            </InputGroup.Text>
                            <Form.Control
                              className="user-profile-input"
                              type="text"
                              value={name}
                              name="name"
                              disabled={inputDisabled}
                              onChange={(e) => onChange(e)}
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputGroup className="mt-2">
                            <InputGroup.Text className="user-profile-input-label">
                              EMAIL ADDRESS
                            </InputGroup.Text>
                            <Form.Control
                              className="user-profile-input"
                              type="email"
                              value={email}
                              name="email"
                              disabled={inputDisabled}
                              onChange={(e) => onChange(e)}
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputGroup className="mt-2">
                            <InputGroup.Text className="user-profile-input-label">
                              AVATAR
                            </InputGroup.Text>
                            <Form.Control
                              className="user-profile-input"
                              type="text"
                              name="avatar"
                              value={avatar}
                              disabled={inputDisabled}
                              onChange={(e) => onChange(e)}
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputGroup className="mt-2">
                            <InputGroup.Text className="user-profile-input-label">
                              ROLE
                            </InputGroup.Text>
                            <Form.Select
                              className="user-profile-input"
                              value={role}
                              name="role"
                              disabled={user.role !== 'admin' || inputDisabled}
                              onChange={(e) => onChange(e)}
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </Form.Select>
                          </InputGroup>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
              <br />
              <br />
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <h5 className="color-white">Account Management</h5>
                      </td>
                      <td>
                        &emsp;
                        <Button
                          size='sm'
                          onClick={() => setInputDisabled1(!inputDisabled1)}
                          className="btn btn-primary"
                        >
                          Change Password
                        </Button>
                        &nbsp;
                        <Button
                          size='sm'
                          className="btn btn-primary color-white"
                          disabled
                        >
                          Apply
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <form onSubmit={(e: any) => onSubmit(e)}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <InputGroup>
                            <InputGroup.Text className="user-profile-input-label">
                              OLD PASSWORD
                            </InputGroup.Text>
                            <Form.Control
                              className="user-profile-input"
                              type="password"
                              placeholder="Enter Old Password"
                              disabled={
                                (user.role === 'admin' && _id !== user._id) ||
                                inputDisabled1
                              }
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputGroup className="mt-2">
                            <InputGroup.Text className="user-profile-input-label">
                              NEW PASSWORD
                            </InputGroup.Text>
                            <Form.Control
                              className="user-profile-input"
                              type="password"
                              placeholder="Enter New Password"
                              disabled={inputDisabled1}
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputGroup className="mt-2 mb-2">
                            <InputGroup.Text className="user-profile-input-label">
                              RE-ENTER PASSWORD
                            </InputGroup.Text>
                            <Form.Control
                              className="user-profile-input"
                              type="password"
                              placeholder="Re-enter New Password"
                              disabled={inputDisabled1}
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <br />
                      <tr>
                        <td>
                          <Button variant="danger">Delete Account</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center devices-footer">
          <div className="pt-5 pb-3 devices-copyright">
            &#169; SOEN490 TTG-HEALTCHECK
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

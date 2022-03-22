// Third party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Button, Form, InputGroup} from 'react-bootstrap';

// Custom
import Navbar from '../common/Navbar';
import {IUserObject} from '../../types/users';
import {IProfileResponse} from '../../types/queries';
import {useAuth} from '../../context/authContext';

const UserProfile = (props: any) => {
  const [userProfile, setUserProfile] = useState({} as IUserObject);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [inputDisabled1, setInputDisabled1] = useState(true);
  const {user} = useAuth();

  const onSubmit = async (e: React.ChangeEvent<any>) => {
    console.log(e);
  };

  // Retrieve user info based on url ID
  const userInfo = async (userId: string) => {
    const result = await axios.get<IProfileResponse<IUserObject>>(
        'api/user/profile',
        {
          params: {userId: userId},
        },
    );
    setUserProfile(result.data.Results);
  };

  useEffect(() => {
    const userId: string = props.location.search.replace('?Id=', '');
    userInfo(userId);
  }, []);

  return (
    <div className="h-100 d-flex flex-column">
      <div id="outer-container">
        <Navbar />
      </div>
      <div className="flex-grow-1 d-flex flex-column align-items-center overflow-auto devices-content pt-5">
        {/* Table */}
        <div
          className="flex-grow-1 d-flex flex-column container w-40"
          style={{
            backgroundColor: '#343a43',
            borderRadius: '7px',
            position: 'relative',
          }}
        >
          <div className="flex-grow-1 overflow-auto table-container mt-4 ms-2 me-2 mb-4">
            <table>
              <tbody>
                <tr>
                  <td>
                    <div
                      style={{
                        top: '-3%',
                        zIndex: '10',
                        position: 'absolute',
                        paddingTop: '10px',
                        backgroundColor: '#343a43',
                        borderRadius: '50%',
                      }}
                    >
                      <img
                        className="user-profile-img"
                        src={userProfile.avatar}
                      />
                    </div>
                    <div style={{height: '180px', width: '250px'}}></div>
                  </td>
                  <td className="user-profile-text">
                    <h1>{userProfile.name}</h1>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <div
              style={{
                backgroundColor: '#3F4651',
                borderRadius: '7px',
                padding: '20px',
              }}
            >
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <h4 style={{color: 'white'}}>Account Information</h4>
                      </td>
                      <td>
                        &emsp;
                        <Button
                          onClick={() => setInputDisabled(!inputDisabled)}
                          className="btn btn-primary"
                          style={{color: 'white'}}
                        >
                          Edit Profile
                        </Button>
                      </td>
                      <td>
                        &nbsp;
                        <Button
                          className="btn btn-primary"
                          style={{color: 'white'}}
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
                            <InputGroup.Text className="user-profile-input-group">
                              ACCOUNT NAME
                            </InputGroup.Text>
                            <Form.Control
                              className="user-profile-input"
                              type="text"
                              value={userProfile.name}
                              disabled={inputDisabled}
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputGroup className="mt-2">
                            <InputGroup.Text className="user-profile-input-group">
                              EMAIL ADDRESS
                            </InputGroup.Text>
                            <Form.Control
                              className="user-profile-input"
                              type="email"
                              value={userProfile.email}
                              disabled={inputDisabled}
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputGroup className="mt-2">
                            <InputGroup.Text className="user-profile-input-group">
                              AVATAR
                            </InputGroup.Text>
                            <Form.Control
                              className="user-profile-input"
                              type="text"
                              value={userProfile.avatar}
                              disabled={inputDisabled}
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputGroup className="mt-2">
                            <InputGroup.Text className="user-profile-input-group">
                              ROLE
                            </InputGroup.Text>
                            <Form.Select
                              className="user-profile-input"
                              value={userProfile.role}
                              disabled={user.role !== 'admin' || inputDisabled}
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
                        <h4 style={{color: 'white'}}>Account Management</h4>
                      </td>
                      <td>
                        &emsp;
                        <Button
                          onClick={() => setInputDisabled1(!inputDisabled1)}
                          className="btn btn-primary"
                        >
                          Change Password
                        </Button>
                        &nbsp;
                        <Button
                          className="btn btn-primary"
                          style={{color: 'white'}}
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
                        <td style={{display: 'block'}}>
                          <InputGroup>
                            <InputGroup.Text className="user-profile-input-group">
                              OLD PASSWORD
                            </InputGroup.Text>
                            <Form.Control
                              className="user-profile-input"
                              type="password"
                              placeholder="Enter Old Password"
                              disabled={
                                (user.role === 'admin' &&
                                  userProfile._id !== user._id) ||
                                inputDisabled1
                              }
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td style={{display: 'block'}}>
                          <InputGroup className="mt-2">
                            <InputGroup.Text className="user-profile-input-group">
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
                        <td style={{display: 'block'}}>
                          <InputGroup className="mt-2 mb-2">
                            <InputGroup.Text className="user-profile-input-group">
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

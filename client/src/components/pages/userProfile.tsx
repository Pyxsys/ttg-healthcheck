// Third party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Button, Form, InputGroup} from 'react-bootstrap';
import {Redirect, useHistory} from 'react-router-dom';
import {Link} from 'react-router-dom';

// Custom
import Navbar from '../common/Navbar';
import {IUserObject, IUserPassword} from '../../types/users';
import {IResponse} from '../../types/queries';
import {useAuth} from '../../context/authContext';
import {notificationService} from '../../services/notification.service';
import {useModalService} from '../../context/modal.context';

const UserProfile = (props: any) => {
  const history = useHistory();
  const modalService = useModalService();

  const {user: loggedUser, setUser: setLoggedUser} = useAuth();
  const [editUser, setEditUser] = useState({
    _id: '',
    name: '',
    email: '',
    avatar: '',
    role: '',
  } as IUserObject);
  const userId: string = props.location.search.replace('?Id=', '');
  const [redirect, setRedirect] = useState(false);

  const [inputDisabled, setInputDisabled] = useState(true);
  const [passwordDisabled, setPasswordDisabled] = useState(true);
  const [userInfoSaveDisabled, setUserInfoSaveDisabled] = useState(true);
  const [passwordSaveDisabled, setPasswordSaveDisabled] = useState(true);
  const [brokenLink, setBrokenLink] = useState(true);

  const [userInfoForm, setUserInfoForm] = useState({
    _id: '',
    name: '',
    email: '',
    avatar: '',
    role: '',
  } as IUserObject);
  const [userPasswordForm, userUserPasswordForm] = useState({
    _id: userId,
    oldPassword: '',
    newPassword: '',
    newPassword1: '',
  } as IUserPassword);
  const {name, email, avatar, role} = userInfoForm;
  const {oldPassword, newPassword, newPassword1} = userPasswordForm;

  // Retrieve user info based on url ID
  const userInfo = async (userId1: string) => {
    await axios
        .get<IResponse<IUserObject>>('api/user/profile', {
          params: {userId: userId1},
        })
        .then((result) => {
          const userProfile = result.data.Results[0];
          setEditUser({
            ['_id']: userProfile._id,
            ['name']: userProfile.name,
            ['email']: userProfile.email,
            ['avatar']: userProfile.avatar,
            ['role']: userProfile.role,
          });
        })
        .catch(() => {
          setRedirect(true);
        });
  };

  // Initialize page
  useEffect(() => {
    if (loggedUser.role == 'user' && loggedUser._id !== userId) {
      setRedirect(true);
    }
    userInfo(userId);
  }, []);

  // If the editted user change, update the forms
  useEffect(() => {
    setUserInfoForm(editUser);
  }, [editUser]);

  // Account information onchange
  const userInfoChange = (e: any) => {
    setUserInfoForm({...userInfoForm, [e.target.name]: e.target.value});
    setUserInfoSaveDisabled(false);
  };

  // Account password onchange
  const userPasswordChange = (e: any) => {
    userUserPasswordForm({
      ...userPasswordForm,
      [e.target.name]: e.target.value,
    });
    setPasswordSaveDisabled(false);
  };

  // Submit account information edit
  const saveUserInfoForm = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    if (brokenLink && userInfoForm.avatar) {
      return notificationService.error('Cannot save invalid link');
    }
    const updatedForm = {
      ...userInfoForm,
      avatar:
        userInfoForm.avatar ||
        'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    };
    await axios
        .post<IResponse<IUserObject>>('api/user/editUserProfileInfo', {
          formData: updatedForm,
        })
        .then(() => {
          notificationService.success('Update successful');
          setEditUser(updatedForm);
          setInputDisabled(true);
          setUserInfoSaveDisabled(true);
          if (loggedUser.name === userInfoForm.name) {
            setLoggedUser(updatedForm);
          }
        })
        .catch((err) => {
          notificationService.error(err.response.data);
        });
  };

  // Submit account password edit
  const saveUserPasswordForm = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    await axios
        .post<IResponse<IUserPassword>>('api/user/editUserProfilePassword', {
          formData: userPasswordForm,
        })
        .then(() => {
          notificationService.success('Update successful');
          setPasswordDisabled(true);
          setPasswordSaveDisabled(true);
          userUserPasswordForm({
            _id: userId,
            oldPassword: '',
            newPassword: '',
            newPassword1: '',
          });
        })
        .catch((err) => {
          notificationService.error(err.response.data);
        });
  };

  modalService.onPrimaryClicked = async (): Promise<void> => {
    await axios
        .delete(`api/user/delete/${userId}`, {})
        .then((result: any) => {
          notificationService.success(result.data.message);
          setTimeout(() => {
            if (loggedUser.role === 'admin') {
              history.push('/admin');
            } else {
              window.location.reload();
            }
          }, 2000);
        })
        .catch((e) => {
          notificationService.error(e.response.data);
        });
  };

  // Hide img while loading not to show a white border
  const [didLoad, setLoad] = useState(false);
  const imageStyle = didLoad ? {} : {display: 'none'};

  // User should be only allowed on his profile page, else redirect
  if (redirect) {
    if (loggedUser.role == 'admin') {
      return <Redirect to="/admin" />;
    } else {
      return <Redirect to="/dashboard" />;
    }
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
                      {/* What user sees */}
                      <img
                        className="user-profile-img"
                        src={avatar}
                        style={imageStyle}
                        onError={({currentTarget}) => {
                          currentTarget.onerror = null; // prevents looping
                          // display default image while link is broken
                          currentTarget.src =
                            'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                        }}
                        onLoad={() => setLoad(true)}
                      />
                      {/* Check to evaluate if user sending broken link to backend*/}
                      <img
                        style={{display: 'none'}}
                        src={avatar}
                        onError={({currentTarget}) => {
                          currentTarget.onerror = null; // prevents looping
                          // If image link is broken, use default avatar
                          setBrokenLink(true);
                        }}
                        onLoad={() => setBrokenLink(false)}
                      />
                    </div>
                    <div className="user-profile-img-spacing"></div>
                  </td>
                  <td className="user-profile-header">
                    <h1>{editUser.name}</h1>
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
                        <Button
                          size="sm"
                          onClick={() => setInputDisabled(!inputDisabled)}
                          className="ms-2"
                        >
                          Edit Profile
                        </Button>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          className="ms-2"
                          form="account-info-form"
                          disabled={userInfoSaveDisabled}
                          type="submit"
                        >
                          Save
                        </Button>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          className="ms-2"
                          onClick={() => {
                            setInputDisabled(true);
                            setUserInfoSaveDisabled(true);
                            setUserInfoForm(editUser);
                          }}
                          disabled={userInfoSaveDisabled}
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <form
                  id="account-info-form"
                  onSubmit={(e: any) => saveUserInfoForm(e)}
                >
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
                              onChange={(e) => userInfoChange(e)}
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
                              onChange={(e) => userInfoChange(e)}
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
                              onChange={(e) => userInfoChange(e)}
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
                              disabled={
                                loggedUser.role !== 'admin' || inputDisabled
                              }
                              onChange={(e) => userInfoChange(e)}
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                              <option value="disabled">disabled</option>
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
                        <Button
                          size="sm"
                          onClick={() => setPasswordDisabled(!passwordDisabled)}
                          className="ms-2"
                        >
                          Change Password
                        </Button>
                        <Button
                          size="sm"
                          form="account-password-form"
                          className="ms-2"
                          type="submit"
                          disabled={passwordSaveDisabled}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          className="ms-2"
                          onClick={() => {
                            setPasswordDisabled(true);
                            setPasswordSaveDisabled(true);
                            userUserPasswordForm({
                              _id: userId,
                              oldPassword: '',
                              newPassword: '',
                              newPassword1: '',
                            });
                          }}
                          disabled={passwordSaveDisabled}
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <form
                  id="account-password-form"
                  onSubmit={(e: any) => saveUserPasswordForm(e)}
                >
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
                              name="oldPassword"
                              value={oldPassword}
                              onChange={(e) => userPasswordChange(e)}
                              disabled={
                                loggedUser.role === 'admin' || passwordDisabled
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
                              name="newPassword"
                              value={newPassword}
                              onChange={(e) => userPasswordChange(e)}
                              disabled={passwordDisabled}
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
                              name="newPassword1"
                              value={newPassword1}
                              onChange={(e) => userPasswordChange(e)}
                              disabled={passwordDisabled}
                            />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="pt-2">
                            <Button variant="danger" className="user-profile-delete-button mt-2" size="sm" onClick={() =>
                              modalService.open(
                                  <div className="d-flex flex-column">
                                    <h2>Confirm Deletion</h2>
                                    <span>Are you sure you wish to delete {loggedUser.name}?</span>
                                  </div>,
                                  'lg',
                                  {
                                    width: 60,
                                    primaryButtonText: 'Yes',
                                    secondaryButtonText: 'No',
                                  },
                              )}
                            >Delete Account</Button>
                            <Link
                              to={{
                                pathname: '/user-logs',
                                search: `?Id=${userId}`,
                              }}
                            >
                              <Button className="ms-2 mt-2" size="sm">
                                Log history
                              </Button>
                            </Link>
                          </div>
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
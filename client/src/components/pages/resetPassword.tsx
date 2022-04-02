// Third party
import React, {useEffect, useState} from 'react';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

// Custom
import {notificationService} from '../../services/notification.service';
import {IUserObject} from '../../types/users';
import {IResponse} from '../../types/queries';

const ResetPassword = (props: any): JSX.Element => {
  const resetPasswordKey: string = props.location.search.replace('?Key=', '');
  const [redirect, setRedirect] = useState(false);

  const [user, setUser] = useState({} as IUserObject);
  const [validEntry, setValidEntry] = useState(null as boolean | null);
  const [showPassword, setShowpasword] = useState(false);
  const [showPasswordConfirm, setShowpaswordConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // Retrieve user info based on reset key
  const getUser = async (): Promise<void> => {
    await axios
        .get<IResponse<IUserObject>>('api/user/resetPasswordUser', {
          params: {key: resetPasswordKey},
        })
        .then((result) => {
          setUser(result.data.Results[0]);
          setValidEntry(true);
        })
        .catch(() => {
          setValidEntry(false);
        });
  };

  useEffect((): void => {
    getUser();
  }, []);

  const saveNewPassword = async (): Promise<void> => {
    await axios
        .post<boolean>('api/user/resetPassword', {
          key: resetPasswordKey,
          _id: user._id,
          password: password,
          passwordConfirm: passwordConfirm,
        })
        .then(() => {
          notificationService.success('Successfully Reset Password');
          setRedirect(true);
        })
        .catch((err) => {
          notificationService.error(err.response.data);
        });
  };

  const getInputType = (showPasswordText: boolean): string =>
    showPasswordText ? 'text' : 'password';

  const getInputIcon = (showPasswordText: boolean): JSX.Element =>
    showPasswordText ? <FaEye size={30} /> : <FaEyeSlash size={30} />;

  // User should be redirected to login page after success
  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <div className="h-100 d-flex flex-column devices-content">
      <div className="flex-grow-1 d-flex flex-column align-items-center px-5">
        {/* Not loaded yet */}
        {validEntry === null ? <></> : <></>}

        {/* Invalid entry to the page */}
        {validEntry === false ?
          <h1 className="pt-5 text-white">
            <span>Your link has expired</span>
          </h1> : <></>
        }

        {/* Reset Password */}
        {validEntry === true ?
          <>
            <div className="text-white pt-3 pb-5">
              <h1>Forgot Your Password</h1>
            </div>

            <div className="form-container w-40 p-4 pb-5">
              <h5 className="color-white">Reset Password</h5>

              <div className="input-group pt-4">
                <span className="form-input-label input-group-text">NEW PASSWORD</span>
                <input
                  className="form-input form-control"
                  type={getInputType(showPassword)}
                  name="newPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
                <div
                  className="d-flex align-items-center cursor-pointer user-select-none ms-2"
                  onClick={() => setShowpasword(!showPassword)}>
                  {getInputIcon(showPassword)}
                </div>
              </div>

              <div className="input-group pt-4">
                <span className="form-input-label input-group-text">RE-NEW PASSWORD</span>
                <input
                  className="form-input form-control"
                  type={getInputType(showPasswordConfirm)}
                  name="newPasswordConfirm"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)} />
                <div
                  className="d-flex align-items-center cursor-pointer user-select-none ms-2"
                  onClick={() => setShowpaswordConfirm(!showPasswordConfirm)}>
                  {getInputIcon(showPasswordConfirm)}
                </div>
              </div>

              <div className="pt-3">
                <button
                  className="btn btn-primary"
                  onClick={() => saveNewPassword()}>
                  Save New Password
                </button>
              </div>
            </div>
          </> : <></>
        }
      </div>
      <div className="d-flex justify-content-center">
        <div className="pt-5 pb-3 devices-copyright">
          &#169; SOEN490 TTG-HEALTCHECK
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

// Third party
import React, {useEffect, useState} from 'react';
import axios from 'axios';

// Custom
import Navbar from '../common/Navbar';
import {IUserObject} from '../../types/users';
import {IProfileResponse} from '../../types/queries';

const UserProfile = (props: any) => {
  const [userProfile, setUserProfile] = useState({} as IUserObject);
  const onSubmit = async (e: React.ChangeEvent<any>) => {
    console.log(e);
  };

  // Retrieve user info based on url ID
  const userInfo = async (userId: string) => {
    const result = await axios.get<IProfileResponse<IUserObject>>('api/user/profile', {
      params: {userId: userId},
    });
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
      <div className="flex-grow-1 d-flex flex-column align-items-center overflow-auto devices-content pt-5 pb-5">
        {/* Table */}
        <div className="flex-grow-1 d-flex flex-column overflow-auto container" style={{backgroundColor: '#343a43', borderRadius: '0.5%'}}>
          <div className="flex-grow-1 overflow-auto table-container mt-4 ms-2 me-2">
            <table>
              <tbody>
                <tr>
                  <td>
                    <img
                      className="user-profile-img"
                      height={250}
                      width={250}
                      src={userProfile.avatar}
                    />
                  </td>
                  <td className="user-profile-text">
                    <h1>{userProfile.name}</h1>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
            <div style={{backgroundColor: '#3F4651', borderRadius: '0.5%', padding: '15px'}}>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <h3 style={{color: 'white'}}>Account Information</h3>
                      </td>
                      <td>
                        &emsp;
                        <button className="btn btn-primary" style={{color: 'white'}}>Edit Profile</button>
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
                          <label style={{color: 'white'}}>Account Name</label>
                        </td>
                        <td>
                          <input type="text" placeholder={userProfile.name} disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label style={{color: 'white'}}>Email Address</label>
                        </td>
                        <td>
                          <input type="text" placeholder={userProfile.email} disabled />
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
                        <h3 style={{color: 'white'}}>Password</h3>
                      </td>
                      <td>
                        &emsp;
                        <button className="btn btn-primary">
                          Change Password
                        </button>
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
                          <label style={{color: 'white'}}>Old Password</label>
                        </td>
                        <td>
                          <input type="text" placeholder="OLD in *" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label style={{color: 'white'}}>New Password</label>
                        </td>
                        <td>
                          <input type="text" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label style={{color: 'white'}}>Re-enter New Password</label>
                        </td>
                        <td>
                          <input type="text" disabled />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center devices-footer">
        <div className="pt-1 pb-3 devices-copyright">
          &#169; SOEN490 TTG-HEALTCHECK
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

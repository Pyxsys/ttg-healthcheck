import React from 'react';

// Custom
import Navbar from '../common/Navbar';

const UserProfile = () => {
  const onSubmit = async (e: React.ChangeEvent<any>) => {
    console.log(e);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div id="outer-container">
        <Navbar />
      </div>
      <div className="flex-grow-1 d-flex flex-column align-items-center overflow-auto devices-content">
        {/* Table */}
        <div className="flex-grow-1 d-flex flex-column overflow-auto container">
          <div className="flex-grow-1 overflow-auto table-container mt-5">
            <table>
              <tbody>
                <tr>
                  <td>
                    <img
                      className="user-profile-img"
                      height={250}
                      width={250}
                      src={'https://avatarfiles.alphacoders.com/129/129400.png'}
                    />
                  </td>
                  <td className="user-profile-text">
                    <h1>Admin</h1>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <h2>Account Information</h2>
                    </td>
                    <td>
                      &emsp;
                      <button className="btn btn-primary">Edit Profile</button>
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
                        <label>Account Name</label>
                      </td>
                      <td>
                        <input type="text" placeholder="NAME" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Email Address</label>
                      </td>
                      <td>
                        <input type="text" placeholder="EMAIL" disabled />
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
                      <h2>Password</h2>
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
                        <label>Old Password</label>
                      </td>
                      <td>
                        <input type="text" placeholder="OLD in *" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>New Password</label>
                      </td>
                      <td>
                        <input type="text" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Re-enter New Password</label>
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
      <div className="d-flex justify-content-center devices-footer">
        <div className="pt-1 pb-3 devices-copyright">
          &#169; SOEN490 TTG-HEALTCHECK
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

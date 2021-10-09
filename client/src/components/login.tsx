import React, {useState} from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const {email, password} = formData;

  const onChange = (e: React.ChangeEvent<any>) =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const body = {
      email: formData.email,
      password: formData.password,
    };
    await axios
        .post('/api/login', body)
        .then((response) => {
          if (response.data) {
            console.log('im logged in');
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };

  return (
    <>
      <div>
        <form onSubmit={(e) => onSubmit(e)} className="adminlogin-form">
          <div>SIGN IN</div>
          <div>
            <div>Email address</div>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div>
            <div>Password</div>
            <input
              type="password"
              placeholder="password"
              name="password"
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default Login;

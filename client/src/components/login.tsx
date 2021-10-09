import React, {useState} from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const {name, email, password, password2} = formData;

  const onChange = (e: React.ChangeEvent<any>) =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const body = {
      email: formData.email,
      password: formData.password,
    };
    await axios
        .post('api/user/login', body)
        .then((response) => {
          if (response.data) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };

  const logout = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    await axios
        .get('api/user/logout')
        .then((response) => {
          if (response.data) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };

  const protect = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    await axios
        .get('api/user/protected')
        .then((response) => {
          if (response.data) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };

  const register = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    if (password === password2) {
      const newUser = {
        name,
        email,
        password,
        password2,
      };
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const body = JSON.stringify(newUser);
        await axios
            .post('/api/user/register', body, config)
            .then((response) => {
              if (response.data) {
                console.log(response.data);
              }
            })
            .catch((error) => {
              console.error(error);
            });
      } catch (err) {
        console.error(err);
      }
    }
  };


  return (
    <>
      <div>
        <form onSubmit={(e) => onSubmit(e)}>
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
        <button onClick={(e) => logout(e)}>Log Out</button>
        <button onClick={(e) => protect(e)}>only logged users</button>
        <form onSubmit={(e) => register(e)}>
          <div>SIGN UP</div>
          <div>
            <div>Name</div>
            <input
              type="name"
              placeholder="Enter name"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
            />
          </div>
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
          <div>
            <div>Confirm Password</div>
            <input
              type="password"
              placeholder="password"
              name="password2"
              value={password2}
              onChange={(e) => onChange(e)}
            />
          </div>
          <button type="submit">Sign up</button>
        </form>
      </div>
    </>
  );
};

export default Login;

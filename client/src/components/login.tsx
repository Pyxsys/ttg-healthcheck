import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AuthService from '../services/authService';

interface CollectionEvent {
  _id: string
  collection?: string
  operation?: string
  updatedFields?: any
}

const Login = () => {
  const [realTimeData, setRealTimeData] = useState([] as CollectionEvent[]);
  const [collectionData, setCollectionData] = useState(
    null as CollectionEvent | null,
  );

  useEffect(() => {
    if (collectionData) {
      setRealTimeData([...realTimeData, collectionData]);
    }
  }, [collectionData]);

  useEffect(() => {
    const ws1 = new WebSocket('ws://localhost:5000/?collection=cpu_logs');
    const ws2 = new WebSocket('ws://localhost:5000/?collection=memory_logs');

    ws1.onmessage = (event) => {
      console.log('event from cpu: ', JSON.parse(event.data));

      const data = JSON.parse(event.data);
      const realTimeData: CollectionEvent = {
        _id: data.documentKey._id,
        collection: 'cpu',
        operation: data.operationType,
        updatedFields:
          data.operationType === 'update' ?
            data.updateDescription.updatedFields :
            data.fullDocument,
      };
      setCollectionData(realTimeData);
    };

    ws2.onmessage = (event) => {
      console.log('event from mem: ', JSON.parse(event.data));

      const data = JSON.parse(event.data);
      const realTimeData: CollectionEvent = {
        _id: data.documentKey._id,
        collection: 'memory',
        operation: data.operationType,
        updatedFields:
          data.operationType === 'update' ?
            data.updateDescription.updatedFields :
            data.fullDocument,
      };
      setCollectionData(realTimeData);
    };

    return () => {
      ws1.close();
      ws2.close();
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const {name, email, password, password2} = formData;

  const onChange = (e: React.ChangeEvent<any>) =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const [formData1, setFormData1] = useState({
    email1: '',
    password1: '',
  });

  const {email1, password1} = formData1;

  const onChange1 = (e: React.ChangeEvent<any>) =>
    setFormData1({...formData1, [e.target.name]: e.target.value});

  const onSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const body = {
      email: formData1.email1,
      password: formData1.password1,
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

  interface Authenticate {
    authenticated: boolean
  }

  useEffect(() => {
    AuthService.isAuthenticated().then((data: Authenticate | any) => {
      console.log(data.isAuthenticated);
      console.log('hello');
    });
  }, [formData1]);

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
              name="email1"
              value={email1}
              onChange={(e) => onChange1(e)}
            />
          </div>
          <div>
            <div>Password</div>
            <input
              type="password"
              placeholder="password"
              name="password1"
              value={password1}
              onChange={(e) => onChange1(e)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <button onClick={(e) => logout(e)}>Log Out</button>
        <button onClick={(e) => protect(e)}>only logged users</button>
        <br />
        <br />
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

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: '1.5rem',
          }}
        >
          <div>Updated Data From MongoDB</div>
          <table style={{borderCollapse: 'collapse'}}>
            <tbody>
              <tr>
                <th>Object ID</th>
                <th>Collection</th>
                <th>Operation</th>
                <th>data Changed</th>
              </tr>

              {realTimeData.map((data, i) => (
                <tr
                  key={`${data._id}-${i}`}
                  style={{borderBottom: 'solid 2px black'}}
                >
                  <td>{data._id}</td>
                  <td>{data.collection}</td>
                  <td>{data.operation}</td>
                  <td>
                    {Object.keys(data.updatedFields).map((col) => (
                      <div key={col}>
                        {col} - {data.updatedFields[col]}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Login;

import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/authContext';

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

  interface AxiosResult {
    message: string
    user: {
      name: string
      role: string
    }
  }

  const {setUser, setIsAuthenticated} = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);

  const [formData1, setFormData1] = useState({
    email1: '',
    password1: '',
  });

  if (loggedIn) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <>
      <div>
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

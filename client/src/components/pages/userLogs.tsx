// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {format} from 'fecha';

// Custom
import Navbar from '../common/Navbar';
import {IColumnDetail} from '../../types/tables';
import Pagination from '../common/pagination';
import ViewTable from '../common/viewTable';
import {IUserLogs, IUserObject} from '../../types/users';
import {IResponse, IResponse1} from '../../types/queries';
import {useAuth} from '../../context/authContext';
import {exportCSV} from '../../services/export.service';

const UserLogs = (props: any) => {
  // Readonly Values
  const initialPage: number = 1;
  const pageSize: number = 10;
  const initialOrderBy: string = '-timestamp';
  const userId: string = props.location.search.replace('?Id=', '');
  const {user: loggedUser} = useAuth();
  const [redirect, setRedirect] = useState(false);
  const [logsTable, setLogsTable] = useState([] as IUserLogs[]);
  const [user, setUser] = useState({} as IUserObject);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  // Retrieve user logs based on url ID
  const queryTable = async () => {
    await axios
        .get<IResponse<IUserLogs>>('api/user/log', {
          params: {userId: userId},
        })
        .then((results) => {
          const users = results.data.Results;

          setTotalPages(Math.ceil(results.data.Total / pageSize));
          setLogsTable(users);
        })
        .catch(() => {
          setRedirect(true);
        });
  };

  const queryUser = async () => {
    await axios
        .get<IResponse1<IUserObject>>('api/user/profile', {
          params: {userId: userId},
        })
        .then((result) => {
          setUser(result.data.Results);
        })
        .catch(() => {
          setRedirect(true);
        });
  };

  useEffect(() => {
    queryTable();
    queryUser();
  }, []);

  // User should be only allowed on his profile page, else redirect
  if (redirect) {
    if (loggedUser.role == 'admin') {
      return <Redirect to="/admin" />;
    } else {
      return <Redirect to="/dashboard" />;
    }
  }

  const column: IColumnDetail[] = [
    {
      key: 'userPerformingAction',
      name: 'Action User\'s Name',
    },
    {
      key: 'event',
      name: 'Event Type',
    },
    {
      key: 'description',
      name: 'Description',
    },
    {
      key: 'timestamp',
      name: 'Timestamp',
      override: (cellValue) => (
        <div>
          {cellValue ?
            format(new Date(cellValue), 'MMM DD, YYYY, h:mm:ss A') :
            'N/A'}
        </div>
      ),
    },
  ];

  const getLogsCSV = (): void => {
    const logValues = logsTable.map((log) => ({
      Action_Users_Name: log.userPerformingAction,
      Event_Type: log.event,
      Affected_Users_Name: log.affectedUser,
      Description: log.description,
      Timestamp: log.timestamp,
    }));
    const today = new Date();
    exportCSV(logValues, `${user.name}-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <Navbar />
      <div className="flex-grow-1 d-flex flex-column align-items-center overflow-auto devices-content">
        <div className="flex-grow-1 d-flex flex-column overflow-auto container">
          {/* Row of Export Button */}
          <div className="d-flex pt-5">
            <div className="p-1 ms-auto">
              <button className="btn btn-primary"
                onClick={() => getLogsCSV()}
              >
                Export as CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-grow-1 overflow-auto table-container">
            <ViewTable
              tableData={logsTable}
              page={page}
              pageSize={pageSize}
              columns={column}
              initialOrderBy={initialOrderBy}
            />
          </div>
          <div className="d-flex py-2 ms-auto">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChanged={(newPage) => setPage(newPage)}
            />
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

export default UserLogs;

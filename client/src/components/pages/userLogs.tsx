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
import {IUserLogs} from '../../types/users';
import {IResponse} from '../../types/queries';
import {useAuth} from '../../context/authContext';

const UserLogs = (props: any) => {
  // Readonly Values
  const initialPage: number = 1;
  const pageSize: number = 10;
  const initialOrderBy: string = 'static.timestamp';
  const userId: string = props.location.search.replace('?Id=', '');
  const {user: loggedUser} = useAuth();
  const [redirect, setRedirect] = useState(false);
  const [logsTable, setLogsTable] = useState([] as IUserLogs[]);
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

  useEffect(() => {
    queryTable();
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
      key: 'timestamp',
      name: 'timestamp',
      disableOrderBy: true,
      override: (cellValue) => (
        <div>
          {cellValue ?
            format(new Date(cellValue), 'MMM DD, YYYY, h:mm:ss A') :
            'N/A'}
        </div>
      ),
    },
    {
      key: 'userPerformingAction',
      name: 'userPerformingAction',
    },
    {
      key: 'event',
      name: 'event',
    },
    {
      key: 'description',
      name: 'description',
    },
  ];

  return (
    <div className="h-100 d-flex flex-column">
      <Navbar />
      <div className="flex-grow-1 d-flex flex-column align-items-center overflow-auto devices-content">
        {/* Table */}
        <div className="flex-grow-1 d-flex flex-column overflow-auto container">
          <div className="flex-grow-1 overflow-auto table-container mt-5">
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

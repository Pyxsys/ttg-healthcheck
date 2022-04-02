// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

// Custom
import {IResponse} from '../../types/queries';
import Navbar from '../common/Navbar';
import {IColumnDetail} from '../../types/tables';
import Pagination from '../common/pagination';
import ViewTable from '../common/viewTable';
import {IUserObject} from '../../types/users';

const AdminPanel = () => {
  // Readonly Values
  const initialPage: number = 1;
  const pageSize: number = 10;
  const initialOrderBy: string = 'static.name';

  const [usersTable, setUsersTable] = useState([] as IUserObject[]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const queryTable = async () => {
    await axios
        .get<IResponse<IUserObject>>('api/user/all')
        .then((results) => {
          const users = results.data.Results;

          setTotalPages(Math.ceil(results.data.Total / pageSize));
          setUsersTable(users);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  useEffect(() => {
    queryTable();
  }, []);

  const column: IColumnDetail[] = [
    {
      key: 'name',
      name: 'Name',
      override: (cellValue, user: IUserObject) => (
        <div className="mx-auto h-100 py-3">
          <Link
            className="text-white"
            to={{
              pathname: '/user-profile',
              search: `?Id=${user._id}`,
            }}
          >
            {cellValue}
          </Link>
        </div>
      ),
    },
    {
      key: 'email',
      name: 'Email',
    },
    {
      key: 'role',
      name: 'role',
    },
    {
      key: 'avatar',
      name: 'Icon',
      disableOrderBy: true,
      override: (cellValue) => (
        <img
          height={50}
          width={50}
          src={String(cellValue)}
          style={{borderRadius: '50%'}}
        />
      ),
    },
  ];

  return (
    <div className="h-100 d-flex flex-column">
      <Navbar name="Admin panel"/>
      <div className="flex-grow-1 d-flex flex-column align-items-center overflow-auto devices-content">
        {/* Table */}
        <div className="flex-grow-1 d-flex flex-column overflow-auto container">
          <div className="flex-grow-1 overflow-auto table-container mt-5">
            <ViewTable
              tableData={usersTable}
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

export default AdminPanel;

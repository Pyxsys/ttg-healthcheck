// 3rd Party
import React from 'react';
import BootstrapTable, {ColumnDescription} from 'react-bootstrap-table-next';

// Custom
import {DeviceLog, Process} from '../../types/queries';

const processTable = (props: {deviceDynamic: DeviceLog}) => {
  const processes: Process[] = props.deviceDynamic?.processes || [];
  const columns: ColumnDescription[] = [
    {
      dataField: 'pid',
      text: 'ID',
      sort: true,
    },
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
      style: {minWidth: '20%'},
    },
    {
      dataField: 'cpu.usagePercentage',
      text: 'CPU',
      sort: true,
    },
    {
      dataField: 'memory.usagePercentage',
      text: 'Memory',
      sort: true,
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
    },
  ];

  return (
    <div className="p-2">
      <BootstrapTable
        headerClasses="border"
        striped={true}
        keyField="pid"
        data={processes}
        columns={columns}
        wrapperClasses="table-responsive"
        sort={{dataField: 'name', order: 'asc'}}
      />
    </div>
  );
};

export default processTable;

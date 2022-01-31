// 3rd Party
import React from 'react';

// Custom
import {DeviceLog, Process} from '../../types/queries';
import {ColumnDetail} from '../../types/tables';
import ViewTable from '../common/viewTable';

interface ProcessTableInputs {
  deviceDynamic: DeviceLog
}

const ProcessTable = (props: ProcessTableInputs) => {
  const processes: Process[] = props.deviceDynamic?.processes || [];

  const column: ColumnDetail[] = [
    {key: 'pid', name: 'ID'},
    {key: 'name', name: 'Name'},
    {key: 'cpu.usagePercentage', name: 'CPU'},
    {key: 'memory.usagePercentage', name: 'Memory'},
    {key: 'status', name: 'Status'},
  ];

  return (
    <div className="flex-grow-1 overflow-auto p-2">
      <ViewTable tableData={processes} columns={column} initialOrderBy="pid" />
    </div>
  );
};

export default ProcessTable;

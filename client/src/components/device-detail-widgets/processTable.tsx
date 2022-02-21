// 3rd Party
import React from 'react';

// Custom
import {IDeviceLog, IProcess} from '../../types/device';
import {IColumnDetail} from '../../types/tables';
import ViewTable from '../common/viewTable';

interface ProcessTableInputs {
  deviceDynamic: IDeviceLog
}

const ProcessTable = (props: ProcessTableInputs) => {
  const processes: IProcess[] = props.deviceDynamic?.processes || [];

  const column: IColumnDetail[] = [
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

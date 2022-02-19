// 3rd Party
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';

// Custom
import {IColumnDetail} from '../../types/tables';

interface ViewTableInputs<T> {
  tableData: T[]
  columns: IColumnDetail[]
  page?: number
  pageSize?: number
  initialOrderBy?: string
}

const useDebounce = (initialValue: string, delay: number) => {
  const [actualValue, setActualValue] = useState(initialValue);
  const [debounceValue, setDebounceValue] = useState(initialValue);
  useEffect(() => {
    const debounceId = setTimeout(() => setDebounceValue(actualValue), delay);
    return () => clearTimeout(debounceId);
  }, [actualValue, delay]);
  return [actualValue, debounceValue, setActualValue] as [
    string,
    string,
    Dispatch<SetStateAction<string>>
  ];
};

const ViewTable = (props: ViewTableInputs<any>) => {
  const [orderBy, setOrderBy] = useState(props.initialOrderBy || '');
  const [orderByAsc, setOrderByAsc] = useState(true);
  const [actualFilter, delayedFilter, setFilter] = useDebounce('', 500);
  const [filterKey, setFilterKey] = useState('');

  useEffect(() => {
    setFilterKey(props.columns.find((c) => c.filter)?.key || '');
  }, []);

  const getAttribute = (
      object: any,
      attribute: string,
  ): number | string | undefined => {
    const attributes = attribute.split('.');
    return attributes.reduce(
        (prev, attr) => (prev ? prev[attr] : undefined),
        object,
    );
  };

  const filterTable = (device: any): boolean => {
    const value = getAttribute(device, filterKey) || '';
    return String(value)
        .toLocaleLowerCase()
        .includes(delayedFilter.toLocaleLowerCase());
  };

  const sortTable = (device1: any, device2: any): number => {
    const device1Swapped = orderByAsc ? device1 : device2;
    const device2Swapped = orderByAsc ? device2 : device1;

    const value1 = getAttribute(device1Swapped, orderBy);
    const value2 = getAttribute(device2Swapped, orderBy);

    if (value1 === undefined || value1 === null) return -1;
    if (value2 === undefined || value2 === null) return 1;
    if (typeof value1 === 'string' && typeof value2 === 'string') {
      return value1.localeCompare(value2);
    } else if (typeof value1 === 'number' && typeof value2 === 'number') {
      return value1 - value2;
    }
    return 0;
  };

  const selectOrderBy = (order: string): void => {
    if (orderBy === order) {
      setOrderByAsc(!orderByAsc);
    } else {
      setOrderBy(order);
      setOrderByAsc(true);
    }
  };

  const orderByIcon = (orderValue: string): JSX.Element => {
    if (orderBy !== orderValue) {
      return (
        <div className="d-flex">
          <span className="dropdown">
            <i className="caret"></i>
          </span>
          <span className="dropup">
            <i className="caret"></i>
          </span>
        </div>
      );
    }
    if (orderByAsc) {
      return (
        <span className="dropup px-1">
          <i className="caret"></i>
        </span>
      );
    }
    return (
      <span className="dropdown px-1">
        <i className="caret"></i>
      </span>
    );
  };

  return (
    <table className="cerebellum-table table-striped text-white overflow-auto w-100 m-1">
      <thead>
        <tr className="sticky-header">
          {props.columns.map((column) => (
            <th
              key={column.key}
              tabIndex={0}
              className="cursor-pointer"
              onClick={() => selectOrderBy(column.key)}
            >
              <div className="d-flex align-items-center">
                <span>{column.name}</span>
                <div className="ps-2">{orderByIcon(column.key)}</div>
                {column.filter ? (
                  <label className="ps-2 user-select-none">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Filter by ${column.name}..."`}
                      value={actualFilter}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                  </label>
                ) : (
                  <></>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="overflow-auto">
        {props.tableData
            .filter(filterTable)
            .sort(sortTable)
            .slice(
            props.page && props.pageSize ?
              (props.page - 1) * props.pageSize :
              0,
            props.page && props.pageSize ?
              (props.page - 1) * props.pageSize + props.pageSize :
              undefined,
            )
            .map((data, index) => (
              <tr key={`view_table_${index}`}>
                {props.columns.map((column) => (
                  <td key={column.key}>
                    {column.override ? (
                    column.override(getAttribute(data, column.key), data)
                  ) : (
                    <span>{getAttribute(data, column.key)}</span>
                  )}
                  </td>
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  );
};

export default ViewTable;

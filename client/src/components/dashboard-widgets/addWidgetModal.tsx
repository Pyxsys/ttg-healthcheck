// 3rd Party
import React, {useState} from 'react';
import SelectSearch, {SelectSearchOption} from 'react-select-search';
import Fuse from 'fuse.js';

import PropTypes from 'prop-types';
type Props = {
  setType: Function
  setName: Function
  ids: String[]
}

const fuzzySearch = (options: SelectSearchOption[]) => {
  const fuse = new Fuse(options, {
    keys: ['name', 'groupName', 'items.name'],
    threshold: 0.3,
  });

  return (value: string) => {
    if (!value.length) {
      return options;
    }

    return fuse.search(value);
  };
};
const AddWidgetModal = ({setType, setName, ids}: Props) => {
  const idOptions = ids.map((e) => {
    return {name: e as string, value: e as string};
  });
  const [types, setTypes] = useState('');
  return (
    <>
      <div className="d-flex flex-column" style={{minHeight: '25vh'}}>
        <h3 className="text-center">Add New Widget</h3>
        <div className="d-flex justify-content-around pt-4">
          <span>Widget Type</span>
          <select
            onChange={(e) => {
              setTypes(e.target.value);
              setType(e.target.value);
            }}
          >
            <option value=""></option>
            <option value="CPU">CPU</option>
            <option value="Memory">Memory</option>
          </select>
        </div>
        {types ? (
          <>
            <div className="modal-options my-2">Options</div>
            <div className="d-flex justify-content-around pt-2">
              <span>Device UUID/Name</span>
              <SelectSearch
                search={true}
                filterOptions={fuzzySearch}
                options={idOptions}
              >
                {' '}
              </SelectSearch>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

AddWidgetModal.propTypes = {
  setType: PropTypes.func.isRequired,
};

export default AddWidgetModal;

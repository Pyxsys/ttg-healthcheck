// 3rd Party
import React, {useState} from 'react';

import PropTypes from 'prop-types';
type Props = {
  setType: Function
  setName: Function
  ids: String[]
}

const AddWidgetModal = ({setType, setName, ids}: Props) => {
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
              <input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
              />
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

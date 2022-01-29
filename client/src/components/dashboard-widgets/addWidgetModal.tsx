// 3rd Party
import React, {useState} from 'react';

// Custom
// import {DisplayWidget} from '../../types/displayWidget';
import PropTypes from 'prop-types';
type Props = {
  setType: Function
}
const AddWidgetModal = ({setType}: Props) => {
  const [types, setTypes] = useState('');
  return (
    <>
      <div className="backgr d-flex flex-column" style={{minHeight: '50vh'}}>
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
            <option value="cpu">CPU</option>
            <option value="mem">Memory</option>
          </select>
        </div>
        {types ? (
          <>
            <div className="border-bottom my-2">Options</div>
            <div className="d-flex justify-content-around pt-2">
              <span>Device UUID/Name</span>
              <input type="text" />
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

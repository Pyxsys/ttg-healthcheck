// 3rd Party
import React, {useState} from 'react';

type Props = {
  setType: (type: string) => void
  setName: (name: string) => void
  deviceIds: string[]
}
const generateOptions = (listOfOptions: string[]) => {
  const returnString = [];
  console.log(listOfOptions.length);
  for (let i = 0; i < listOfOptions.length; i++) {
    console.log(i);
    returnString.push(<option key= {i}>{listOfOptions[i]}</option>);
  }
  return returnString;
};
const AddWidgetModal = ({setType, setName, deviceIds}: Props) => {
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
            <option value="CPU-Dynamic">CPU</option>
            <option value="CPU-Static">CPU Additional</option>
            <option value="Memory-Dynamic">Memory</option>
            <option value="Memory-Static">Memory Additional</option>
            <option value="Disk-Dynamic">Disk</option>
            <option value="Disk-Static">Disk Additional</option>
            <option value="Network-Dynamic">Network</option>
            <option value="Network-Static">Network Additional</option>
          </select>
        </div>
        {types ? (
          <>
            <div className="modal-options my-2">Options</div>
            <div className="d-flex justify-content-around pt-2">
              <span>Device UUID/Name</span>
              <select onChange={(e) => {
                setName(e.target.value);
                console.log(e.target.value);
              }}>
                {generateOptions(deviceIds)}
              </select>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default AddWidgetModal;

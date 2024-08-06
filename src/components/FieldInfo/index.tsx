import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';


interface Field {
  name: string;
  area: number;
  crop: string;
}

const fields: Field[] = [
  { name: 'North Field', area: 1000, crop: 'Mung Bean' },
  { name: 'South Field', area: 1500, crop: 'Mung Bean' },
  { name: 'East Field', area: 800, crop: 'Mung Bean' },
//   { name: 'West Field', area: 1200, crop: 'Wheat' },
//   { name: 'Central Field', area: 2000, crop: 'Corn' },
];

const FieldTable: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div>
      <Button onClick={togglePopup}>Show Field Data</Button>
      
      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h2>Field Data</h2>
            <table>
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Field Area (m²)</th>
                  <th>Crop</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={index}>
                    <td>{field.name}</td>
                    <td>{field.area}</td>
                    <td>{field.crop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldTable;
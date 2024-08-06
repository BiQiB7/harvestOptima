import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Polygon, StandaloneSearchBox } from '@react-google-maps/api';

interface FieldInfo {
  id: number;
  name: string;
  area: number;
  coordinates: google.maps.LatLngLiteral[];
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 0,
  lng: 0
};

const LandDrawingMap: React.FC = () => {
  const [polygon, setPolygon] = useState<google.maps.LatLngLiteral[]>([]);
  const [area, setArea] = useState<number>(0);
  const [landName, setLandName] = useState<string>('');
  const [savedFields, setSavedFields] = useState<FieldInfo[]>([]);
  const [selectedField, setSelectedField] = useState<FieldInfo | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng && !selectedField) {
      setPolygon(prev => [...prev, e.latLng!.toJSON()]);
    }
  }, [selectedField]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onSearchBoxLoad = useCallback((ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBoxRef.current && mapRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
          if (place.geometry && place.geometry.location) {
            bounds.extend(place.geometry.location);
          }
        });
        mapRef.current.fitBounds(bounds);
      }
    }
  }, []);

  useEffect(() => {
    if (polygon.length > 2) {
      const calculatedArea = google.maps.geometry.spherical.computeArea(
        polygon.map(point => new google.maps.LatLng(point.lat, point.lng))
      );
      setArea(calculatedArea);
    } else {
      setArea(0);
    }
  }, [polygon]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLandName(e.target.value);
  };

  const handleSave = () => {
    if (landName && polygon.length > 2) {
      const newField: FieldInfo = {
        id: Date.now(),
        name: landName,
        area: area,
        coordinates: polygon,
      };
      setSavedFields(prev => [...prev, newField]);
      handleClear();
    } else {
      alert('Please enter a name and draw a valid polygon');
    }
  };

  const handleView = (field: FieldInfo) => {
    // setSelectedField(field);
    setPolygon(field.coordinates);
    // setArea(field.area);
    // setLandName(field.name);
    if (mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      field.coordinates.forEach(coord => bounds.extend(coord));
      mapRef.current.fitBounds(bounds);
    }
  };

  const handleDelete = (id: number) => {
    setSavedFields(prev => prev.filter(field => field.id !== id));
    if (selectedField && selectedField.id === id) {
      handleClear();
    }
  };

  const handleClear = useCallback(() => {
    setSelectedField(null);
    setPolygon([]);
    setArea(0);
    setLandName('');
  }, []);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCxq4kM5hb4lVVTQyNupIXu1dxp8WEm_Sw"
      libraries={['places', 'geometry']}
    >
      <div>
        <StandaloneSearchBox
          onLoad={onSearchBoxLoad}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search for a location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              marginBottom: '10px',
            }}
          />
        </StandaloneSearchBox>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={3}
          onClick={onMapClick}
          onLoad={onLoad}
        >
          {polygon.length > 0 && (
            <Polygon
              path={polygon}
              options={{
                fillColor: 'lightblue',
                fillOpacity: 0.4,
                strokeColor: 'blue',
                strokeOpacity: 1,
                strokeWeight: 2,
                editable: !selectedField,
                draggable: !selectedField,
              }}
            />
          )}
        </GoogleMap>
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            value={landName}
            onChange={handleNameChange}
            placeholder="Enter land name"
          />
          <button onClick={handleSave}>Save Land</button>
          <button onClick={handleClear}>Clear</button>
        </div>
        <div>Area: {area.toFixed(2)} square meters</div>
        <div>
          <h3>Saved Fields</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Area (m²)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedFields.map(field => (
                <tr key={field.id}>
                  <td>{field.name}</td>
                  <td>{field.area.toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleView(field)}>View</button>
                    <button onClick={() => handleDelete(field.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LoadScript>
  );
};

export default LandDrawingMap;
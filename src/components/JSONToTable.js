import React, { useState, useEffect } from 'react';

// Define the fields to display and their custom headers
const DISPLAY_FIELDS = {
  alg: 'Algorithm Name',
  decodedMediaTypes: 'Media Types',
  'entryMetadata.informationalUrl': 'URL',
  'entryMetadata.contact': 'Contact',
};

// Helper function to safely extract nested values and flatten arrays
const getNestedValue = (obj, path) => {
  const value = path
    .split('.')
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : 'N/A'),
      obj,
    );
  return Array.isArray(value) ? value.join(', ') : value; // Flatten arrays into a comma-separated string
};

// Function to extract and filter only the required fields
const extractAndFilterObject = (obj) => {
  let result = {};
  for (const key in DISPLAY_FIELDS) {
    result[key] = getNestedValue(obj, key);
  }
  return result;
};

// Helper function to capitalize each word in a string
const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const JSONToTable = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/sb-alg-list.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch the JSON file');
        }
        return response.json();
      })
      .then((data) => {
        setJsonData(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setJsonData(null);
      });
  }, []);

  // Function to group data by the 'type' field
  const groupDataByType = (data) => {
    return data.reduce((acc, item) => {
      const type = getNestedValue(item, 'type');
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  };

  const generateTableHeaders = () => {
    return Object.keys(DISPLAY_FIELDS).map((key) => (
      <th key={key}>{DISPLAY_FIELDS[key]}</th>
    ));
  };

  const generateTableRows = (data) => {
    return data.map((item, rowIndex) => {
      const filteredData = extractAndFilterObject(item);
      const url = filteredData['entryMetadata.informationalUrl'];
      const description = getNestedValue(item, 'entryMetadata.description');

      return (
        <tr key={rowIndex}>
          {Object.keys(DISPLAY_FIELDS).map((key, index) => (
            <td key={index}>
              {key === 'entryMetadata.informationalUrl' ? (
                url !== 'N/A' && description !== 'N/A' ? (
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {description}
                  </a>
                ) : (
                  'N/A'
                )
              ) : (
                filteredData[key]
              )}
            </td>
          ))}
        </tr>
      );
    });
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (!jsonData || !Array.isArray(jsonData)) {
    return <p>No data found in the JSON. Expected an array of objects.</p>;
  }

  const groupedData = groupDataByType(jsonData);

  return (
    <div>
      {Object.entries(groupedData).map(([type, data]) => (
        <div key={type} style={{ marginBottom: '30px' }}>
          <h2>{capitalizeWords(type)} algorithms</h2>
          <table style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>{generateTableHeaders()}</tr>
            </thead>
            <tbody>{generateTableRows(data)}</tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default JSONToTable;

import React, { useState } from 'react';
import './App.css';

function App() {
  const [jsonData, setJsonData] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleInputChange = (e) => {
    setJsonData(e.target.value);
  };

  const handleDropdownChange = (e) => {
    const selected = e.target.value;
    if (selected && !selectedFilters.includes(selected)) {
      setSelectedFilters([...selectedFilters, selected]);
    }
  };

  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter));
  };

  const submitData = async () => {
    try {
      // Attempt to parse JSON input to validate
      const jsonObject = JSON.parse(jsonData);
      const res = await fetch('http://localhost:3001/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonObject)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const result = await res.json();
      setResponse(result);
    } catch (error) {
      console.error('Error:', error.message);

      // Set error message in response state for display
      setResponse({ error: 'Invalid input! Please check your JSON format.' });
    }
  };

  const displayResponse = () => {
    if (!response) return null;

    if (response.error) {
      // Display the error message if there is an error
      return <pre>{response.error}</pre>;
    }

    // Safely check if properties exist and are arrays
    const numbers = Array.isArray(response.numbers) ? response.numbers : [];
    const alphabets = Array.isArray(response.alphabets) ? response.alphabets : [];
    const highestLowercaseAlphabet = Array.isArray(response.highest_lowercase_alphabet) ? response.highest_lowercase_alphabet : [];

    let displayText = '';

    if (selectedFilters.length === 0) {
      displayText = `Numbers: ${numbers.join(', ')}\nAlphabets: ${alphabets.join(', ')}\nHighest Lowercase Alphabet: ${highestLowercaseAlphabet.join(', ')}`;
    } else {
      if (selectedFilters.includes('Numbers')) {
        displayText += `Numbers: ${numbers.join(', ')}`;
      }
      if (selectedFilters.includes('Alphabets')) {
        if (displayText) displayText += '\n';
        displayText += `Alphabets: ${alphabets.join(', ')}`;
      }
      if (selectedFilters.includes('Highest Lowercase Alphabet')) {
        if (displayText) displayText += '\n';
        displayText += `Highest Lowercase Alphabet: ${highestLowercaseAlphabet.join(', ')}`;
      }
    }

    return <pre>{displayText}</pre>;
  };

  const availableFilters = ['Numbers', 'Alphabets', 'Highest Lowercase Alphabet'].filter(
    (filter) => !selectedFilters.includes(filter)
  );

  return (
    <div className="container">
      <h2>API Input</h2>
      <textarea
        id="jsonInput"
        rows="3"
        cols="50"
        placeholder='{"data":["M","1","334","4","B"]}'
        value={jsonData}
        onChange={handleInputChange}
      ></textarea>
      <br />
      <button id="submitButton" onClick={submitData}>Submit</button>

      <h3>Filter Selection</h3>
      <div className="filter-section">
        <select id="filterDropdown" onChange={handleDropdownChange} value="">
          <option value="" disabled>Select a filter</option>
          {availableFilters.map((filter, index) => (
            <option key={index} value={filter}>{filter}</option>
          ))}
        </select>

        <div id="multiFilter" className="multi-filter">
          {selectedFilters.map((filter, index) => (
            <span key={index} className="filterTag">
              {filter} <button className="remove-button" onClick={() => removeFilter(filter)}>x</button>
            </span>
          ))}
        </div>
      </div>

      <h3>Filtered Response</h3>
      <div id="filteredResponse">
        {displayResponse()}
      </div>
    </div>
  );
}

export default App;

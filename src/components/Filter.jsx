import React, { useState } from 'react';

const Filter = ({ onSort }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSelectedOption(option);
    onSort(option);
  };

  return (
    <div className="flex items-center space-x-4 mb-4 relative">
      <label htmlFor="sortDropdown" className="text-sm"><b>Sort by:</b></label>
      <select
        id="sortDropdown"
        value={selectedOption}
        onChange={handleSortChange}
        className="p-2 text-sm border-none placeholder:text-base placeholder:text-dark-gray dark:placeholder:text-white rounded-md drop-shadow-md dark:bg-dark-blue"
      >
        <option value="">Select an option</option>
        <option value="number_of_likes">By number of Likes</option>
        <option value="applied_for_jobs">By number of jobs applied</option>
      </select>
    </div>
  );
};

export default Filter;

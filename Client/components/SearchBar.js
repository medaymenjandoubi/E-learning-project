import React, { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Search } = Input;

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <Search
        placeholder="Search for courses..."
        enterButton={<SearchOutlined style={{paddingRight:"2px", paddingLeft:"9px"}}/>}
        value={query}
        onChange={handleInputChange}
        onSearch={handleSearch}
        style={{marginTop:"7px"}}
        className="custom-search"
      />
    </div>
  );
};

export default SearchBar;

import React from "react";
import { Input, Select } from "antd";

const { Option } = Select;

interface FilterProps {
  onSearch: (searchTerm: string) => void;
  onSort: (sortOption: string) => void;
  setSearchText:any
}

const Filter: React.FC<FilterProps> = ({ onSearch, onSort ,setSearchText}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
    setSearchText(e.target.value)
  };

  const handleSortChange = (value: string) => {
    onSort(value);
  };

  return (
    <div
      className="filter-component"
      style={{
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <label style={{ marginRight: "8px" }}>Search:</label>
        <Input
          placeholder="Search tasks..."
          onChange={handleSearch}
          allowClear
          style={{ width: 200 }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label style={{ marginRight: "8px" }}>Sort by:</label>
        <Select
          defaultValue="default"
          style={{ width: 200 }}
          onChange={handleSortChange}
        >
          <Option value="default" disabled>
            Sort by...
          </Option>
          <Option value="recent">Recent</Option> 
          <Option value="title-asc">Title (A-Z)</Option>
          <Option value="title-desc">Title (Z-A)</Option>
          {/* <Option value="date-asc">Due Date (Earliest)</Option>
          <Option value="date-desc">Due Date (Latest)</Option> */}
        </Select>
      </div>
    </div>
  );
};

export default Filter;

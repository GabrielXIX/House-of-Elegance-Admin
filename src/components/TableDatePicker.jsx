import { DatePicker, Select, Space } from "antd";
import { useState } from "react";
const { Option } = Select;

export function TableDatePicker({ handleDateChange, handlePickerChange }) {
  const [type, setType] = useState("date");

  function handleSelect(e) {
    setType(e);
    handlePickerChange(e);
  }

  return (
    <Space>
      <Select value={type} onChange={e => handleSelect(e)}>
        <Option value="date">Por Fecha</Option>
        <Option value="week">Por Semana</Option>
        <Option value="month">Por Mes</Option>
        <Option value="todas">Todas</Option>
      </Select>
      {(type === "date" && <DatePicker picker="date" onChange={e => handleDateChange(e, type)} />) ||
        (type === "week" && <DatePicker picker="week" onChange={e => handleDateChange(e, type)} />) ||
        (type === "month" && <DatePicker picker="month" onChange={e => handleDateChange(e, type)} />)}
    </Space>
  );
}

import { DatePicker, Select, Space } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const { Option } = Select;

export function TableDatePicker({ handleDateChange, handlePickerChange, selectedDate }) {
  const [type, setType] = useState("date");
  const [aux, setAux] = useState(dayjs(new Date()));

  useEffect(() => {
    setAux(dayjs(selectedDate[0]));
  }, [selectedDate]);

  function handleSelect(e) {
    setType(e);
    setAux(dayjs(selectedDate[0]));
    handlePickerChange(e);
  }

  return (
    <Space>
      <Select popupClassName="ad-select" className="ad-select1" value={type} onChange={e => handleSelect(e)}>
        <Option value="date">Por Fecha</Option>
        <Option value="week">Por Semana</Option>
        <Option value="month">Por Mes</Option>
        <Option value="todas">Todas</Option>
      </Select>
      {(type === "date" && (
        <DatePicker
          picker="date"
          className="table-picker"
          popupClassName="table-picker-popup"
          value={aux}
          onChange={e => handleDateChange(e, type)}
        />
      )) ||
        (type === "week" && (
          <DatePicker
            picker="week"
            className="table-picker"
            popupClassName="table-picker-popup"
            value={aux}
            onChange={e => handleDateChange(e, type)}
          />
        )) ||
        (type === "month" && (
          <DatePicker
            picker="month"
            className="table-picker"
            popupClassName="table-picker-popup"
            value={aux}
            onChange={e => handleDateChange(e, type)}
          />
        ))}
    </Space>
  );
}

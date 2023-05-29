import { Controller } from "react-hook-form";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export function FormDatePicker({ control, name }) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field, fieldState }) => {
        return (
          <DatePicker
            className="form-picker"
            popupClassName="form-picker-popup"
            format={"DD-MM-YYYY"}
            status={fieldState.error ? "error" : undefined}
            ref={field.ref}
            name={field.name}
            onBlur={field.onBlur}
            value={field.value ? dayjs(field.value) : null}
            onChange={date => {
              field.onChange(date ? date : null);
            }}
            placeholder="Fecha"
          />
        );
      }}
    />
  );
}

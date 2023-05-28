import { Controller } from "react-hook-form";
import { TimePicker } from "antd";
import dayjs from "dayjs";

export function FormTimePicker({ control, name }) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field, fieldState }) => {
        return (
          <TimePicker
            use12Hours
            format="h:mm a"
            status={fieldState.error ? "error" : undefined}
            ref={field.ref}
            name={field.name}
            onBlur={field.onBlur}
            value={field.value ? dayjs(field.value) : null}
            onChange={time => {
              field.onChange(time ? time.valueOf() : null);
            }}
            placeholder="Hora"
          />
        );
      }}
    />
  );
}

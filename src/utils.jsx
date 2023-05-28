import dayjs from "dayjs";

export function getWeek(referenceDate) {
  const day = referenceDate.getDay();
  const diff = referenceDate.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(referenceDate.setDate(diff));
  const endOfWeek = new Date(referenceDate.setDate(referenceDate.getDate() + 6));

  return {
    start: startOfWeek,
    end: endOfWeek,
  };
}

export function getMonth(referenceDate) {
  const startOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const endOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);

  return {
    start: startOfMonth,
    end: endOfMonth,
  };
}

function convertToDateType(data) {
  return data.map(item => {
    let [day, month, year] = item.fecha.split("-");
    return { ...item, fecha: new Date(+year, +month - 1, +day) };
  });
}

function convertToStringType(data) {
  return data.map(item => ({ ...item, fecha: dayjs(item.fecha).format("DD-MM-YYYY") }));
}

export function filterByDateOrRange(inputData, startDate, endDate = null) {
  //Convertir fechas de string a tipo Date
  const newData = convertToDateType(inputData);
  let selectedDates = [];

  if (!endDate) selectedDates = newData.filter(item => item.fecha.getTime() === startDate.getTime()); //Si es na fecha especifica
  else selectedDates = newData.filter(item => item.fecha >= startDate && item.fecha <= endDate); //Si es un rango de fechas (semana, mes)

  return convertToStringType(selectedDates);
}

export function resetTimeOnDate(inputDate) {
  return new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 0, 0, 0, 0);
}

export function dateExistsInSelected(inputDate, selectedDateOrRange) {
  if (selectedDateOrRange.length === 1) {
    return inputDate.getTime() === selectedDateOrRange[0].getTime();
  } else if (selectedDateOrRange.length === 2) {
    return inputDate.getTime() >= selectedDateOrRange[0].getTime() && inputDate.getTime() <= selectedDateOrRange[1].getTime();
  }
}

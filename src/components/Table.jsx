import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faHourglass } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useForm } from "react-hook-form";
import { FormDatePicker } from "./FormDatePicker";
import { FormTimePicker } from "./FormTimePicker";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

import { getWeek, getMonth, filterByDateOrRange, resetTimeOnDate, dateExistsInSelected } from "../utils";

import { Dropdown } from "antd";

import { TableDatePicker } from "./TableDatePicker";
import { StatusPicker } from "./StatusPicker";

import data from "../data"; //temporal mientras se conecta la db
import { useState, useEffect } from "react";

export default function Table() {
  const [appointments, setAppointments] = useState([]);
  const [modalShown, setModalShown] = useState(false);
  const [selectedDateOrRange, setSelectedDateOrRange] = useState([resetTimeOnDate(new Date())]);
  const [search, setSearch] = useState("");
  const { register, handleSubmit, reset, control } = useForm();

  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    weekStart: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        //fetch todas las citas de la base de datos

        setAppointments(filterByDateOrRange(data, selectedDateOrRange[0]));

        console.log(appointments);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setAppointments(filterByDateOrRange(data, ...selectedDateOrRange));
  }, [selectedDateOrRange]);

  function addNewAppointment({ nombre, telefono, servicio, fecha, hora }) {
    if (servicio === "Servicio") servicio = "Corte de cabello";

    //ingresar en base de datos

    fecha = resetTimeOnDate(fecha.toDate());
    if (dateExistsInSelected(fecha, [...selectedDateOrRange])) {
      setAppointments(prev => [
        ...prev,
        {
          fecha: dayjs(fecha).format("DD-MM-YYYY"),
          hora: dayjs(hora).format("h:mm a"),
          nombre: nombre,
          servicio: servicio,
          telefono: telefono,
          estado: "Citado",
        },
      ]);
    }

    reset({
      fecha: "",
      hora: "",
      nombre: "",
      servicio: "Servicio",
      telefono: "",
    });

    setModalShown(false);
  }

  function handleDateChange(inputDate, type) {
    //!cambiar onchange de select date picker para que actualize tambien
    //Resetea la hora del Date a 00:00:00
    inputDate = resetTimeOnDate(inputDate.toDate());

    if (type === "date") {
      setSelectedDateOrRange([inputDate]);
    } else if (type === "week") {
      const { start, end } = getWeek(inputDate);
      setSelectedDateOrRange([start, end]);
    } else if (type === "month") {
      const { start, end } = getMonth(inputDate);
      setSelectedDateOrRange([start, end]);
    }
  }

  function handlePickerChange(picker) {
    if (picker === "date") {
      setSelectedDateOrRange([selectedDateOrRange[0]]);
    } else if (picker === "week") {
      const { start, end } = getWeek(selectedDateOrRange[0]);
      setSelectedDateOrRange([start, end]);
    } else if (picker === "month") {
      const { start, end } = getMonth(selectedDateOrRange[0]);
      setSelectedDateOrRange([start, end]);
    } else if (picker === "todas") {
      setSelectedDateOrRange([new Date("January 01, 2023"), resetTimeOnDate(new Date())]);
    }
  }

  function selectPreviousDay() {
    if (selectedDateOrRange.length === 1) {
      setSelectedDateOrRange(prev => [new Date(prev[0].getTime() - 86400000)]);
    } else if (selectedDateOrRange.length === 2) {
      if (selectedDateOrRange[1].getTime() - selectedDateOrRange[0].getTime() <= 604800000) {
        const { start, end } = getWeek(new Date(selectedDateOrRange[0].getTime() - 604800000)); //get previous week range
        setSelectedDateOrRange([start, end]);
      } else {
        let previousMonth = selectedDateOrRange[0];
        previousMonth.setDate(1);
        previousMonth.setMonth(previousMonth.getMonth() - 1);

        const { start, end } = getMonth(previousMonth); //get previous month range
        setSelectedDateOrRange([start, end]);
      }
    }
  }

  function selectNextDay() {
    if (selectedDateOrRange.length === 1) {
      setSelectedDateOrRange(prev => [new Date(prev[0].getTime() + 86400000)]);
    } else if (selectedDateOrRange.length === 2) {
      if (selectedDateOrRange[1].getTime() - selectedDateOrRange[0].getTime() <= 604800000) {
        const { start, end } = getWeek(new Date(selectedDateOrRange[0].getTime() + 604800000)); //get next week range
        setSelectedDateOrRange([start, end]);
      } else {
        let previousMonth = selectedDateOrRange[0];
        previousMonth.setDate(1);
        previousMonth.setMonth(previousMonth.getMonth() + 1);

        const { start, end } = getMonth(previousMonth); //get next month range
        setSelectedDateOrRange([start, end]);
      }
    }
  }

  return (
    <>
      <div className="flex">
        <div className="searchbar flex no-gap">
          <button className="btn">
            <FontAwesomeIcon className="icon-primary" icon={faMagnifyingGlass} />
          </button>
          <input value={search} className="input-accent" type="text" placeholder="Buscar" onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex small-gap">
          <button className="btn" onClick={selectPreviousDay}>
            <FontAwesomeIcon className="icon-primary" icon={faChevronLeft} />
          </button>
          <Dropdown
            overlayClassName="date-dropdown"
            trigger={["click"]}
            placement="bottom"
            dropdownRender={() => (
              <TableDatePicker
                handleDateChange={handleDateChange}
                handlePickerChange={handlePickerChange}
                selectedDate={selectedDateOrRange}
              />
            )}
          >
            <div className="btn" style={{ width: "16.5rem", justifyContent: "space-between" }}>
              <p className="accent-font">
                {dayjs(selectedDateOrRange[0]).format("DD-MM-YYYY")}
                {selectedDateOrRange.length === 2 && ` | ${dayjs(selectedDateOrRange[1]).format("DD-MM-YYYY")}`}
              </p>
              <FontAwesomeIcon className="icon-primary" icon={faChevronDown} />
            </div>
          </Dropdown>
          <button className="btn" onClick={selectNextDay}>
            <FontAwesomeIcon className="icon-primary" icon={faChevronRight} />
          </button>
        </div>
        <button className="btn" onClick={() => setModalShown(true)}>
          <FontAwesomeIcon className="icon-primary" icon={faPlus} />
          <p className="accent-font">Nueva Cita</p>
        </button>
      </div>
      <div className="table flex-column">
        <div className="table-item table-head">
          <div>
            <button className="btn btn-small">
              <FontAwesomeIcon className="icon-primary" icon={faSquare} />
            </button>
          </div>
          <h3>Fecha</h3>
          <h3>Hora</h3>
          <h3>Nombre</h3>
          <h3>Servicio</h3>
          <h3>Telefono</h3>
          <h3>Estado</h3>
          <div>
            <button className="btn btn-small">
              <FontAwesomeIcon className="icon-primary" icon={faSort} />
            </button>
          </div>
        </div>

        {appointments
          .filter(
            e =>
              e.nombre.toLowerCase().includes(search) ||
              e.telefono.includes(search) ||
              e.servicio.toLowerCase().includes(search) ||
              e.estado.toLowerCase().includes(search) ||
              e.fecha.toLowerCase().includes(search) ||
              e.hora.toLowerCase().includes(search)
          )
          .map(e => {
            return (
              <div key={e.id} className="table-item table-row">
                <div>
                  <button className="btn btn-small">
                    <FontAwesomeIcon className="icon-secundary" icon={faSquare} />
                  </button>
                </div>
                <p className="small-font">{e.fecha}</p>
                <p className="small-font">{e.hora}</p>
                <p className="small-font">{e.nombre}</p>
                <p className="small-font">{e.servicio}</p>
                <p className="small-font">{e.telefono}</p>
                <Dropdown
                  className="btn btn-small btn-fixed-width"
                  trigger={["click"]}
                  placement="bottom"
                  dropdownRender={() => <StatusPicker statusPicked={e.estado} />}
                >
                  <div>
                    <FontAwesomeIcon
                      icon={
                        (e.estado === "Citado" && faCalendar) ||
                        (e.estado === "Pendiente" && faClock) ||
                        (e.estado === "En curso" && faHourglass) ||
                        (e.estado === "Completado" && faCheck) ||
                        (e.estado === "Cancelado" && faXmark)
                      }
                      className="icon-secundary"
                    />
                    <p className="small-font">{e.estado}</p>
                  </div>
                </Dropdown>
                <div>
                  <button className="btn btn-small">
                    <FontAwesomeIcon className="icon-secundary" icon={faTrash} />
                  </button>
                </div>
              </div>
            );
          })}

        <div className="table-footer flex align-bottom">
          <p className="small-font">Citas mostradas: {appointments.length}</p>
          <button className="btn btn-small btn-outline">
            <p className="small-font">Mostrar completadas</p>
          </button>
        </div>
      </div>

      {modalShown && (
        <div className="modal-container">
          <form onSubmit={handleSubmit(addNewAppointment)} className="modal flex-column">
            <h1 style={{ marginBottom: "1rem" }}>Crear cita</h1>
            <div className="flex" style={{ alignItems: "flex-start" }}>
              <div className="flex-column column-gap">
                <input placeholder="Nombre" {...register("nombre", { required: true, maxLength: 50 })} />
                <input placeholder="Telefono" {...register("telefono", { required: true, maxLength: 50 })} />
                <select {...register("servicio")} defaultValue="Servicio">
                  <option value="Servicio" disabled hidden>
                    Servicio
                  </option>
                  <option value="Corte de cabello">Corte de cabello</option>
                  <option value="Tinte">Tinte</option>
                  <option value="Maquillaje">Maquillaje</option>
                </select>
              </div>
              <div className="flex-column column-gap">
                <FormDatePicker control={control} name="fecha" />
                <FormTimePicker control={control} name="hora" />
              </div>
            </div>
            <div className="flex align-right align-bottom">
              <button className="btn btn-secundary" onClick={() => setModalShown(false)}>
                <p>Cancelar</p>
              </button>
              <button className="btn" type="submit">
                <p className="accent-font">Crear</p>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

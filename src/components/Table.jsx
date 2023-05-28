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
import { faHourglassStart } from "@fortawesome/free-solid-svg-icons";
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
        // si no hay error pasar a una variable let llamada data

        // const response = await fetch(data);
        // if (!response.ok) throw new Error("Error de fetch");
        // data = await response.json();

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

  function handlePickerChange() {
    // if (picker === "date") {
    //   setSelectedDateOrRange([selectedDateOrRange[0]]);
    // } else if (picker === "week") {
    //   const { start, end } = getWeek(selectedDateOrRange[0]);
    //   setSelectedDateOrRange([start, end]);
    // } else if (picker === "month") {
    //   const { start, end } = getMonth(selectedDateOrRange[0]);
    //   setSelectedDateOrRange([start, end]);
    // }

    setSelectedDateOrRange([new Date("January 01, 2020"), resetTimeOnDate(new Date())]);
  }

  function selectPreviousDay() {
    //actualizar dropdown calendar si cambio el mes por las flechas
    if (selectedDateOrRange.length === 1) {
      setSelectedDateOrRange(prev => [new Date(prev[0].getTime() - 86400000)]);
    }
  }
  function selectNextDay() {
    if (selectedDateOrRange.length === 1) {
      setSelectedDateOrRange(prev => [new Date(prev[0].getTime() + 86400000)]);
    }
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    //solo ordenar las citas para que las citas correspondientes a la busqueda salgan hasta arriba
    const searchedAppointments = appointments.filter(item => item.nombre.startsWith(e.target.value));
    console.log("Searched");
    console.log(searchedAppointments);
    setAppointments(prev => {
      const filtered = prev.filter(item => !searchedAppointments.includes(item));
      return [...searchedAppointments, ...filtered];
    });
  }

  return (
    <>
      <div className="flex">
        <div className="searchbar flex no-gap">
          <button className="btn">
            <FontAwesomeIcon className="icon-primary" icon={faMagnifyingGlass} />
          </button>
          <input value={search} className="input-accent" type="text" placeholder="Search" onChange={e => handleSearchChange(e)} />
        </div>
        <div className="flex small-gap">
          <button className="btn" onClick={selectPreviousDay}>
            <FontAwesomeIcon className="icon-primary" icon={faChevronLeft} />
          </button>
          <Dropdown
            trigger={["click"]}
            placement="bottom"
            dropdownRender={() => <TableDatePicker handleDateChange={handleDateChange} handlePickerChange={handlePickerChange} />}
          >
            <div className="btn" style={{ width: "16rem", justifyContent: "space-between" }}>
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

        {appointments.map((e, i) => {
          return (
            <div key={i} className="table-item table-row">
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
              <button
                style={{
                  backgroundColor:
                    (e.estado === "Citado" && "#96E190") ||
                    (e.estado === "Pendiente" && "#DBDE48") ||
                    (e.estado === "Completado" && "#c2c2c2"),
                }}
                className="btn btn-small btn-fixed-width"
              >
                <FontAwesomeIcon
                  className="icon-secundary"
                  icon={
                    (e.estado === "Citado" && faCalendar) ||
                    (e.estado === "Pendiente" && faClock) ||
                    (e.estado === "En curso" && faHourglassStart) ||
                    (e.estado === "Completado" && faCheck) ||
                    (e.estado === "Cancelado" && faXmark)
                  }
                />
                <p className="small-font">{e.estado}</p>
              </button>
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

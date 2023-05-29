import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faHourglass } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export function StatusPicker({ statusPicked }) {
  statusPicked = statusPicked.toLowerCase().replace(" ", "");
  return (
    <div className="status-dropdown">
      <button className={`btn btn-small btn-fixed-width ${statusPicked === "citado" && statusPicked}`}>
        <FontAwesomeIcon className="icon-secundary" icon={faCalendar} />
        <p className="small-font">Citado</p>
      </button>
      <button className={`btn btn-small btn-fixed-width ${statusPicked === "pendiente" && statusPicked}`}>
        <FontAwesomeIcon className="icon-secundary" icon={faClock} />
        <p className="small-font">Pendiente</p>
      </button>
      <button className={`btn btn-small btn-fixed-width ${statusPicked === "encurso" && statusPicked}`}>
        <FontAwesomeIcon className="icon-secundary" icon={faHourglass} />
        <p className="small-font">En Curso</p>
      </button>
      <button className={`btn btn-small btn-fixed-width ${statusPicked === "completado" && statusPicked}`}>
        <FontAwesomeIcon className="icon-secundary" icon={faCheck} />
        <p className="small-font">Completado</p>
      </button>
      <button className={`btn btn-small btn-fixed-width ${statusPicked === "cancelado" && statusPicked}`}>
        <FontAwesomeIcon className="icon-secundary" icon={faXmark} />
        <p className="small-font">Cancelado</p>
      </button>
    </div>
  );
}

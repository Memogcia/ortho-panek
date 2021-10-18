/* eslint-disable camelcase */
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import { DateTimePicker, Select, TextField } from "components/HFMUI";
import { Grid, makeStyles } from "@material-ui/core";

import AutoCompletePatients from "components/HFMUI/AutoCompletePatients";
import Modal from "components/Modal";
import PropTypes from "prop-types";
import appointmentsPropTypes, {
  appointmentPropType,
} from "proptypes/appointments";
import appointmentsTypes from "constants/appointmentsTypes";
import { capitalize } from "utils";
import moment from "moment";
import schema from "components/Calendar/schema";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import RenderIf from "components/RenderIf";

moment.locale("es");
const localizer = momentLocalizer(moment);

const useStyles = makeStyles((theme) => ({
  revisión: {
    backgroundColor: "#761863",
  },
  consulta: {
    backgroundColor: "#cb792d",
  },
  "primera vez": {
    backgroundColor: "#309433",
  },
  estudio: {
    backgroundColor: "#286044",
  },
  inicio: {
    backgroundColor: "#201b59",
  },
  presupuesto: {
    backgroundColor: "#e6e13a",
  },
  retención: {
    backgroundColor: "#d77e2d",
  },
  inconsistente: {
    backgroundColor: "#dd254e",
  },
  "no pagó": {
    backgroundColor: "#fff",
  },
  "recordar cita": {
    backgroundColor: "#29625c",
  },
  "paciente activo": {
    backgroundColor: "#1980ab",
  },
  "cita extra": {
    backgroundColor: "#02225a",
  },

  paper: {
    width: "100%",
    height: "100%",
    marginBottom: theme.spacing(2),
  },
}));

const CalendarComponent = ({
  insertAppointment,
  appointments,
  getAppointment,
  appointmentDetail,
  isLoadingAppointmentDetail,
}) => {
  const classes = useStyles();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const formOptions = {
    resolver: yupResolver(schema),
    defaultValues: {
      type: "",
      start_date_time: null,
      end_date_time: null,
      status: "",
      patient_assisted: false,
      comments: "",
    },
  };
  const { control, handleSubmit, formState, setValue } = useForm(formOptions);

  useEffect(() => {
    if (
      appointmentDetail &&
      Array.isArray(appointmentDetail.appointments) &&
      appointmentDetail.appointments.length > 0 &&
      !isLoadingAppointmentDetail
    ) {
      const { type, comments, status, patient_assisted } =
        appointmentDetail.appointments[0];
      setValue("type", type, { shouldValidate: true });
      setValue("comments", comments, { shouldValidate: true });
      setValue("status", status, { shouldValidate: true });
      setValue("patient_assisted", patient_assisted, { shouldValidate: true });
    }
  }, [appointmentDetail, isLoadingAppointmentDetail]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const createPreAppointment = ({ start, end }) => {
    setValue("start_date_time", start, { shouldValidate: true });
    setValue("end_date_time", end, { shouldValidate: true });
    openModal();
  };

  const handleGetAppointmentDetails = async ({
    id,
    start_date_time,
    end_date_time,
  }) => {
    await getAppointment({
      variables: {
        appointmentId: id,
      },
    });
    setSelectedAppointmentId(id);
    setValue("start_date_time", start_date_time, { shouldValidate: true });
    setValue("end_date_time", end_date_time, { shouldValidate: true });
    openModal();
  };

  const handleCreateAppointment = async (formData) => {
    await insertAppointment({
      variables: { id: uuidv1(), ...formData },
    });
    closeModal();
  };

  const customEventPropGetter = (event) => {
    const { type } = event;

    return { className: classes[type] };
  };

  // const customDayPropGetter = useCallback(date => (date.getDay() === 0 ? { className: styles.weekOff } : {}), []);

  return (
    <>
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        title={selectedAppointmentId ? "Actualizar cita" : "Crear cita"}
        actionButtonText={
          selectedAppointmentId ? "Actualizar cita" : "Crear cita"
        }
        form="create-appointment-form"
        maxWidth="sm"
      >
        <form
          id="create-appointment-form"
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit(handleCreateAppointment)}
        >
          <Grid container spacing={3}>
            {/* <RenderIf condition={!!selectedAppointmentId}>
              <Grid item xs={12} sm={6}>
                <TextField
                  control={control}
                  id="comments"
                  name="Nombre del paciente"
                  label="Comentarios"
                  error={!!formState.errors?.comments}
                  fullWidth
                  multiline
                  rows={2}
                  rowsMax={4}
                />
              </Grid>
            </RenderIf> */}
            {/* <RenderIf condition={!!selectedAppointmentId}>
              <Grid item xs={12} sm={6}>
                <TextField
                  control={control}
                  id="comments"
                  name="comments"
                  label="Comentarios"
                  error={!!formState.errors?.comments}
                  fullWidth
                  multiline
                  rows={2}
                  rowsMax={4}
                />
              </Grid>
            </RenderIf> */}
            <RenderIf condition={!selectedAppointmentId}>
              <Grid item xs={12} sm={12}>
                <AutoCompletePatients
                  control={control}
                  required
                  id="user_id"
                  name="user_id"
                  label="Paciente"
                  fullWidth
                  error={!!formState.errors?.user_id}
                />
              </Grid>
            </RenderIf>
            <Grid item xs={12} sm={12}>
              <Select
                control={control}
                required
                id="type"
                name="type"
                label="Tipo de cita"
                options={appointmentsTypes.map((type) => ({
                  label: capitalize(type),
                  value: type,
                }))}
                fullWidth
                error={!!formState.errors?.consulting_room}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <DateTimePicker
                control={control}
                required
                id="start_date_time"
                name="start_date_time"
                label="Fecha de inicio"
                format="dd/MM/yyyy HH:mm:ss"
                error={!!formState.errors?.start_date_time}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <DateTimePicker
                control={control}
                required
                id="end_date_time"
                name="end_date_time"
                label="Fecha de fin"
                format="dd/MM/yyyy HH:mm:ss"
                error={!!formState.errors?.end_date_time}
                fullWidth
              />
            </Grid>
            <RenderIf condition={!!selectedAppointmentId}>
              <Grid item xs={12} sm={12}>
                <TextField
                  control={control}
                  id="comments"
                  name="comments"
                  label="Comentarios"
                  error={!!formState.errors?.comments}
                  fullWidth
                  multiline
                  rows={2}
                  rowsMax={4}
                />
              </Grid>
            </RenderIf>
          </Grid>
        </form>
      </Modal>
      <Calendar
        localizer={localizer}
        selectable
        events={appointments}
        defaultView={Views.MONTH}
        defaultDate={new Date()}
        step={15}
        startAccessor={(event) => new Date(event.start_date_time)}
        endAccessor={(event) => new Date(event.end_date_time)}
        titleAccessor={(event) => event.user.name}
        min={moment("08:00:00", "HH:mm:ss").toDate()}
        max={moment("20:00:00", "HH:mm:ss").toDate()}
        onSelectEvent={handleGetAppointmentDetails}
        onSelectSlot={createPreAppointment}
        eventPropGetter={customEventPropGetter}
      />
    </>
  );
};

CalendarComponent.propTypes = {
  insertAppointment: PropTypes.func,
  getAppointment: PropTypes.func,
  appointments: appointmentsPropTypes,
  appointmentDetail: appointmentPropType,
  isLoadingAppointmentDetail: PropTypes.bool,
};

CalendarComponent.defaultProps = {
  insertAppointment: null,
  getAppointment: null,
  appointments: [],
  appointmentDetail: null,
  isLoadingAppointmentDetail: false,
};

export default CalendarComponent;

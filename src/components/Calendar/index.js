import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, Views, momentLocalizer } from "react-big-calendar";

import AutoCompletePatients from "components/HFMUI/AutoCompletePatients";
import { DateTimePicker } from "components/HFMUI";
import { Grid } from "@material-ui/core";
import Modal from "components/Modal";
import PropTypes from "prop-types";
import appointmentsPropTypes from "proptypes/appointments";
import moment from "moment";
import schema from "components/Calendar/schema";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";

moment.locale("es");
const localizer = momentLocalizer(moment);

const CalendarComponent = ({ insertAppointment, appointments }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const formOptions = {
    resolver: yupResolver(schema),
  };
  const { control, handleSubmit, formState, setValue } = useForm(formOptions);

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

  const handleCreateAppointment = async (formData) => {
    await insertAppointment({
      variables: { id: uuidv1(), ...formData },
    });
    closeModal();
  };

  // const customEventPropGetter = (selectedEventData) => {
  //   const { resource } = selectedEventData;
  //   const { id: resourceId } = resource;

  //   switch (resourceId) {
  //     case resourceIds.LIDO_HOLIDAYS:
  //       return { className: styles.holidayEvent };
  //     case resourceIds.BATCHES:
  //       return { className: styles.batchesEvent };
  //     case resourceIds.SUBSTITUTE_CLASSES:
  //       return { className: styles.substituteClasses };
  //     default:
  //       return {};
  //   }
  // };

  // const customDayPropGetter = useCallback(date => (date.getDay() === 0 ? { className: styles.weekOff } : {}), []);

  return (
    <>
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        title="Crear cita"
        actionButtonText="Crear cita"
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
        onSelectEvent={(event) => {
          // openModal();
          alert(event.title);
        }}
        onSelectSlot={createPreAppointment}
        // eventPropGetter={(event) => {
        //   if(event.type === 'diagnó')
        // }}
      />
    </>
  );
};

CalendarComponent.propTypes = {
  insertAppointment: PropTypes.func,
  appointments: appointmentsPropTypes,
};

CalendarComponent.defaultProps = {
  insertAppointment: null,
  appointments: [],
};

export default CalendarComponent;

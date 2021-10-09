import { useState } from "react";
import { momentLocalizer, Calendar, Views } from "react-big-calendar";
import { Grid } from "@material-ui/core";
import Modal from "components/Modal";
import moment from "moment";
import "moment/locale/es";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import "react-big-calendar/lib/css/react-big-calendar.css";
import schema from "components/Calendar/schema";
import { DateTimePicker } from "components/HFMUI";

moment.locale("es");
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
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
    setModalIsOpen(true);
  };

  return (
    <>
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        title="Crear cita"
        actionButtonText="Crear cita"
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <DateTimePicker
              control={control}
              required
              id="start_date_time"
              name="start_date_time"
              label="Fecha de inicio"
              fullWidth
              error={!!formState.errors?.start_date_time}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <DateTimePicker
              control={control}
              required
              id="end_date_time"
              name="end_date_time"
              label="Fecha de fin"
              fullWidth
              error={!!formState.errors?.end_date_time}
            />
          </Grid>
        </Grid>
      </Modal>
      <Calendar
        localizer={localizer}
        selectable
        events={[]}
        defaultView={Views.WEEK}
        defaultDate={new Date()}
        onSelectEvent={(event) => {
          openModal();
          alert(event.title);
        }}
        onSelectSlot={createPreAppointment}
      />
    </>
  );
};

export default CalendarComponent;

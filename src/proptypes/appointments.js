import PropTypes from "prop-types";

export const appointmentPropType = PropTypes.shape({
  comments: PropTypes.string,
  end_date_time: PropTypes.string,
  id: PropTypes.string,
  patient_assisted: PropTypes.boolean,
  start_date_time: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    cellphone: PropTypes.sting,
    email: PropTypes.string,
  }),
});

export default PropTypes.arrayOf(appointmentPropType);

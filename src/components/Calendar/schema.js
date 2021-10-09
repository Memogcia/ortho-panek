import * as Yup from "yup";

export default Yup.object().shape({
  start_date_time: Yup.date(),
  end_date_time: Yup.date(),
  comments: Yup.string(),
});

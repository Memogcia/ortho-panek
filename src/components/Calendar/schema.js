import * as Yup from "yup";

export default Yup.object().shape({
  user_id: Yup.string().required(),
  start_date_time: Yup.date(),
  end_date_time: Yup.date(),
  type: Yup.string().required(),
  comments: Yup.string(),
});

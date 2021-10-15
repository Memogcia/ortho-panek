import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";

import PropTypes from "prop-types";
import error from "assets/img/error.jpeg";
import success from "assets/img/good.jpeg";

const useStyles = makeStyles({
  feedBackStatus: {
    width: "60px",
    height: "auto",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "30px",
  },
});

const Modal = (props) => {
  const classes = useStyles();
  const {
    onClose,
    type,
    title,
    text,
    children,
    actionButtonText,
    onClick,
    form,
    ...rest
  } = props;

  const handleRenderIcon = () => {
    switch (type) {
      case "success":
      case "successModal":
        return (
          <img src={success} alt="success" className={classes.feedBackStatus} />
        );

      case "error":
      case "errorModal":
        return (
          <img src={error} alt="error" className={classes.feedBackStatus} />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        {...rest}
      >
        <DialogTitle id="alert-dialog-title" onClose={onClose}>
          {title}
        </DialogTitle>
        <DialogContent dividers>
          {handleRenderIcon()}
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          {!type ? (
            <Button onClick={onClose} color="primary">
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" color="primary" form={form} onClick={onClick}>
            {actionButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  actionButtonText: PropTypes.string,
  open: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.element,
  form: PropTypes.string,
};

Modal.defaultProps = {
  title: null,
  text: null,
  actionButtonText: null,
  open: false,
  type: null,
  onClick: () => {},
  onClose: () => {},
  children: null,
  form: null,
};

export default Modal;

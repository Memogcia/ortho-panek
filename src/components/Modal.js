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
    dialogTitle,
    dialogText,
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
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          {handleRenderIcon()}
          <DialogContentText id="alert-dialog-description">
            {dialogText}
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
  dialogTitle: PropTypes.string,
  dialogText: PropTypes.string,
  actionButtonText: PropTypes.string,
  open: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.element,
  form: PropTypes.string,
};

export default Modal;

import React from "react";
import clsx from "clsx";
/* import PropTypes from "prop-types";
import NoSsr from "@material-ui/core/NoSsr";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import CancelIcon from "@material-ui/icons/Cancel"; */
import "date-fns";
import Checkbox from "@material-ui/core/Checkbox";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { makeStyles, emphasize /* useTheme */ } from "@material-ui/core/styles";
/* import "react-inputs-validation/lib/react-inputs-validation.min.css"; */
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AccountCircle from "@material-ui/icons/AccountCircle";
import {
  IconButton,
  Snackbar /* , Icon  */,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Menu
} from "@material-ui/core/";
import CloseIcon from "@material-ui/icons/Close";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

//import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  button: {
    margin: theme.spacing(1),
    color: "white"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: 12,
    "& label.Mui-focused": {
      color: "#2AAA9E"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#2AAA9E"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "1px solid rgba(224, 224, 224, 1)"
      },
      "& fieldset legend": {
        width: 200,
        borderColor: "#2AAA9E"
      },
      "&:hover fieldset": {
        borderColor: "#00A0DB"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2AAA9E"
      }
    } /* ,
    '& input:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 2,
    },
    '& input:invalid +fieldset legend': {
      color: 'red'
    } */
  },
  dense: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(0)
  },
  menu: {
    width: 200
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  chipFocused: {
    backgroundColor: emphasize(theme.palette.type === "light" ? theme.palette.grey[300] : theme.palette.grey[700], 0.08)
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: "absolute",
    left: 2,
    bottom: 6,
    fontSize: 16
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  title: {
    flexGrow: 1
  }
}));

function MDialog(params) {
  const classes = useStyles();
  let buttonHTML = function(buttons) {
    return buttons.map(button => {
      return (
        <MButton onClick={params.close} key={button.value} color={button.color}>
          {button.value}
        </MButton>
      );
    });
  };
  return (
    <Dialog
      open={params.open}
      onClose={params.close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" disableTypography className={classes.root}>
        {params.title}
        <IconButton aria-label="close" className={classes.closeButton} onClick={params.close}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{params.children}</DialogContentText>
      </DialogContent>

      <DialogActions>{buttonHTML(params.buttons)}</DialogActions>
    </Dialog>
  );
}
function MButton(params) {
  const classes = useStyles();
  return (
    <Button
      disabled={params.disabled ? params.disabled : false}
      fullWidth={params.fullWidth}
      variant={params.variant ? params.variant : "contained"}
      color={params.color ? params.color : "primary"}
      name={params.name}
      className={classes.button}
      onClick={params.onClick}
      startIcon={params.icon}
    >
      {params.children}
    </Button>
  );
}

function MSwithch(params) {
  return (
    <FormControlLabel
      control={<Switch name={params.name} id={params.id} checked={params.isSelected} onChange={params.onChange} />}
      value={params.value}
      label={params.label}
      labelPlacement={params.labelPlacement ? params.labelPlacement : "start"}
    />
  );
}
function MCard(params) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return (
    <Card raised={true}>
      <CardHeader
        title={
          <Typography variant="body2" color="textSecondary" component="p">
            {params.title}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary" component="p">
            {params.price}
          </Typography>
        }
      />
      <CardMedia
        style={{
          height: 0,
          paddingTop: "56.25%" // 16:9
        }}
        image={params.image}
        title={params.imageTitle}
      />
      <CardContent style={{}}>
        <Typography variant="body2" color="textSecondary" component="p">
          {params.content}
        </Typography>
      </CardContent>
      <CardActions style={{ display: params.actionEnabled ? "block" : "none" }}>
        <Button name={params.name} size="small" onClick={params.onChange}>
          <Typography variant="body2" color="textSecondary" component="p">
            Tap to bid
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
}
function MCheckbox(params) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            name={params.name}
            id={params.id}
            color={"primary"}
            checked={params.value}
            onChange={params.onChange}
            value={params.name}
          />
        }
        label={params.label}
      />
    </FormGroup>
  );
}
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © madbids "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
function MTextField(params) {
  const classes = useStyles();
  if (params.type === "select") {
    return (
      <TextField
        key={params.name}
        id={params.name}
        select
        label={params.label}
        disabled={params.disabled}
        fullWidth={params.fullWidth ? params.fullWidth : false}
        margin="dense"
        onChange={params.onChange}
        className={clsx(classes.textField, classes.dense)}
        value={params.value}
        name={params.name}
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
        helperText={params.helperText}
        variant="outlined"
      >
        {params.data.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  } else if (
    params.type === "text" ||
    params.type === "number" ||
    params.type === "email" ||
    params.type === "password"
  ) {
    return (
      <TextField
        id={params.id}
        disabled={params.disabled ? params.disabled : false}
        required={params.required ? params.required : false}
        error={params.error ? params.error : false}
        multiline={params.multiline ? params.multiline : false}
        type={params.type}
        autoFocus={params.autoFocus ? params.autoFocus : false}
        name={params.name}
        fullWidth={params.fullWidth ? params.fullWidth : false}
        label={"" + params.label}
        className={clsx(classes.textField, classes.dense)}
        margin="dense"
        onBlur={params.onBlur}
        rows={params.rows ? params.rows : 1}
        onChange={params.onChange}
        value={params.value}
        variant={params.variant ? params.variant : "outlined"}
        helperText={params.helperText}
      />
    );
  } else if (params.type === "date") {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          disableToolbar
          variant="inline"
          inputVariant="outlined"
          autoOk={true}
          disabled={params.disabled ? params.disabled : false}
          helperText={params.helperText}
          fullWidth={params.fullWidth ? params.fullWidth : false}
          format="dd/MM/yyyy"
          margin="dense"
          className={clsx(classes.textField, classes.dense)}
          id={params.id ? params.id : params.name}
          allowKeyboardControl={true}
          label={params.label}
          value={params.value}
          onChange={params.onChange}
          onFocus={params.onFocus}
        />
      </MuiPickersUtilsProvider>
    );
  }
}
function MAppBar(params) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = event => {
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    params.handleClose();
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Home
          </Typography>
          <div style={{ marginRight: 0 }}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
function MSnackbar(params) {
  const classes = useStyles();
  return (
    <Snackbar
      anchorOrigin={{
        vertical: params.vPos ? params.vPos : "bottom",
        horizontal: params.hPos ? params.hPos : "left"
      }}
      open={params.open}
      autoHideDuration={params.autoHideDuration ? params.autoHideDuration : 600000}
      onClose={params.onClose}
      className={classes.info}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={params.message}
      action={[
        <IconButton key="close" aria-label="close" color="inherit" className={classes.close} onClick={params.onClose}>
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
}

export { MTextField, MButton, MDialog, MSwithch, MCheckbox, MSnackbar, Copyright, MCard, MAppBar };

import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleOutlineOutlined from "@material-ui/icons/RemoveCircleOutlineOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { restApiUrl } from "../utilities/Global";
import { red } from "@material-ui/core/colors";
import { auth } from "../hooks/UseAuth";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Alert from "@material-ui/lab/Alert";
// import UserPicker from "../components/UserPicker";

const useStyles = makeStyles((theme) => {
  return {
    field: {
      marginTop: 20,
      marginBottom: 20,
      display: "block",
    },
    groupNumeric: {
      display: "inline-block",
      marginRight: theme.spacing(2),
    },
    fieldNumeric: {
      marginTop: 20,
      marginBottom: 20,
      display: "block",
    },
    userListBlock: {
      height: "25vh",
      width: "100%",
      justifyContent: "center",
      marginBottom: 20,
    },
    list: {
      [theme.breakpoints.up("md")]: {
        width: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: 350,
      },
      maxHeight: "80%",
      maxWidth: "100%",
      background: "#f9f9f9",
      overflow: "auto",
    },
    avatar: {
      color: theme.palette.getContrastText(theme.palette.secondary.main),
      backgroundColor: theme.palette.secondary.main,
    },
    error: {
      color: red[500],
      display: "block",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    bottomGrid: {
      marginTop: 20,
      width: "100%",
    },
  };
});

export default function EditMeds() {
  const [input, setInput] = useState({
    name: "",
    description: "",
    date: Date.now(),
    max_participants: 10,
  });
  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [problem, setProblem] = useState(null);
  const [success, setSuccess] = useState(null);
  const [warning, setWarning] = useState(null);
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();
  const { jwt: token, loggedIn, isAdmin, userName } = auth.status();

  useEffect(() => {
    console.log("Edit useEffect");
    if (location.state) {
      let newMed = location.state.item;
      if (newMed) {
        setInput(newMed);
      }
    } else {
      history.push("/meds");
    }
  }, [location]);

  const handleChange = (e) => {
    let newInput = { ...input };
    // console.log(e.target.name, ":", e.target.value);

    newInput[e.target.name] = e.target.value;

    setInput(newInput);
  };

  const validate = () => {
    let newErrors = {};
    let requiredFields = [
      "genericName",
      "tradeName",
      "medClass",
      "target",
      "riskInfections",
      "affectedAreas",
    ];

    let isValid = true;

    requiredFields.forEach((field) => {
      if (!input[field]) {
        isValid = false;

        newErrors[field] = "Please enter " + field;
      }
    });

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (validate()) {
      setIsPending(true);

      try {
        // console.log(item, description, total, max_given, category);
        const res = await fetch(restApiUrl + `/${input._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(input),
        });
        setIsPending(false);
        if (res.ok) {
          const response = await res.json();
          console.log("new medication:", response);
          setSuccess("Medication saved");
          setWarning(null);
          //   history.go(-1);
          // history.push("/trips");
          setInput(response);
        } else {
          if (res.status === 400) {
            const response = await res.json();
            if (response.errors) {
              setErrors(response.errors);
            }
          } else {
            res.text().then((text) => {
              setProblem(text);
            });
          }
        }
        // history.push("/login");
      } catch (err) {
        // auto catches network / connection error
        if (err.name !== "AbortError") {
          setIsPending(false);
          setProblem(err.message);
        }
      }
    }
    // if (!loggedIn) {
    //   setProblem("Please log in first");
    // } else if (!isAdmin) {
    //   setProblem("This is action requires Admin authority");
    // } else {
    // }
  };

  return (
    <Container>
      {problem && (
        <Alert severity="error" onClose={() => setProblem(null)}>
          {problem}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      {warning && (
        <Alert severity="warning" onClose={() => setWarning(null)}>
          {warning}
        </Alert>
      )}
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        color="textSecondary"
      >
        Edit an Immunosuppressant Agent
      </Typography>

      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          className={classes.field}
          onChange={handleChange}
          label="Generic Name"
          variant="outlined"
          color="secondary"
          name="genericName"
          value={input.genericName}
          fullWidth
          required
          error={!!errors.genericName}
        />
        <Typography
          variant="caption"
          className={classes.error}
          display="block"
          gutterBottom
          fullWidth
        >
          {errors.genericName}
        </Typography>
        <TextField
          className={classes.field}
          onChange={handleChange}
          label="Trade Name(s)"
          variant="outlined"
          color="secondary"
          name="tradeName"
          value={input.tradeName}
          fullWidth
          required
          error={!!errors.tradeName}
        />
        <Typography
          variant="caption"
          className={classes.error}
          display="block"
          gutterBottom
          fullWidth
        >
          {errors.tradeName}
        </Typography>
        <TextField
          className={classes.field}
          onChange={handleChange}
          label="Class"
          variant="outlined"
          color="secondary"
          name="medClass"
          value={input.medClass}
          fullWidth
          required
          error={!!errors.medClass}
        />
        <Typography
          variant="caption"
          className={classes.error}
          display="block"
          gutterBottom
          fullWidth
        >
          {errors.medClass}
        </Typography>
        <TextField
          className={classes.field}
          onChange={handleChange}
          label="Target"
          variant="outlined"
          color="secondary"
          name="target"
          value={input.target}
          fullWidth
          required
          error={!!errors.target}
        />
        <Typography
          variant="caption"
          className={classes.error}
          display="block"
          gutterBottom
          fullWidth
        >
          {errors.target}
        </Typography>
        <TextField
          className={classes.field}
          onChange={handleChange}
          label="Affected Areas"
          variant="outlined"
          color="secondary"
          name="affectedAreas"
          value={input.affectedAreas}
          multiline
          rows={2}
          required
          fullWidth
          error={!!errors.affectedAreas}
        />
        <Typography
          variant="caption"
          className={classes.error}
          display="block"
          gutterBottom
        >
          {errors.affectedAreas}
        </Typography>
        <TextField
          className={classes.field}
          onChange={handleChange}
          label="Risk Infections"
          variant="outlined"
          color="secondary"
          name="riskInfections"
          value={input.riskInfections}
          multiline
          rows={4}
          required
          fullWidth
          error={!!errors.riskInfections}
        />
        <Typography
          variant="caption"
          className={classes.error}
          display="block"
          gutterBottom
        >
          {errors.riskInfections}
        </Typography>
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          endIcon={<KeyboardArrowRightIcon />}
          disabled={isPending}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}

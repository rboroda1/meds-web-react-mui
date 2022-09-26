import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { restApiUrl } from "../utilities/Global";
import { red } from "@material-ui/core/colors";
import { auth } from "../hooks/UseAuth";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Alert from "@material-ui/lab/Alert";

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
    error: {
      color: red[500],
      display: "block",
    },
  };
});

export default function CreateMeds() {
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
  const history = useHistory();
  const classes = useStyles();
  // const { jwt: token, loggedIn, isAdmin } = auth.status();

  const handleChange = (e) => {
    let newInput = { ...input };
    // console.log(e.target.name, ":", e.target.value);

    newInput[e.target.name] = e.target.value;

    setInput(newInput);
  };

  const handleDateChange = (d) => {
    let newInput = { ...input };
    // console.log(e.target.name, ":", e.target.value);

    // Set date to midnight
    d.setHours(0, 0, 0, 0);

    newInput["date"] = d;

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
        const res = await fetch(restApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(input),
        });
        setIsPending(false);
        const response = await res.json();
        if (res.ok) {
          console.log("new medication:", response);
          setSuccess("New medication added");
          //   history.go(-1);
          history.push("/meds");
        } else {
          if (res.status === 400 && response.errors) {
            setErrors(response.errors);
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
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        color="textSecondary"
      >
        Add an Immunosuppressant Agent
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

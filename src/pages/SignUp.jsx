import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { restApiUrl } from "../utilities/Global";
import { auth } from "../hooks/UseAuth";
import { makeStyles } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import AccountCircleOutlined from "@material-ui/icons/AccountCircleOutlined";
import AlternateEmailOutlinedIcon from "@material-ui/icons/AlternateEmailOutlined";
import PhoneCallbackOutlinedIcon from "@material-ui/icons/PhoneCallbackOutlined";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import IconButton from "@material-ui/core/IconButton";
import InputMask from "react-input-mask";

const useStyles = makeStyles((theme) => {
  return {
    field: {
      marginTop: 20,
      marginBottom: 20,
      display: "block",
    },
    fieldNumeric: {
      display: "inline-block",
      margin: theme.spacing(1),
    },
    error: {
      color: red[500],
    },
  };
});

const SignUp = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    telephone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const toggleShow = () => setShowPass(!showPass);

  const handleChange = (e) => {
    let newInput = { ...input };
    // console.log(e.target.name, ":", e.target.value);

    newInput[e.target.name] = e.target.value;

    setInput(newInput);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const validate = () => {
    let newErrors = {};

    let isValid = true;

    if (!input["name"]) {
      isValid = false;

      newErrors["name"] = "Please enter your name.";
    }

    if (!input["email"]) {
      isValid = false;

      newErrors["email"] = "Please enter your email Address.";
    }

    if (typeof input["email"] !== "undefined") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );

      if (!pattern.test(input["email"])) {
        isValid = false;

        newErrors["email"] = "Please enter valid email address.";
      }
    }

    if (!input["telephone"]) {
      isValid = false;

      errors["telephone"] = "Please enter your phone number.";
    }

    if (typeof input["telephone"] !== "undefined") {
      var pattern = new RegExp(/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/);

      if (!pattern.test(input["telephone"])) {
        isValid = false;

        newErrors["telephone"] = "Please enter valid phone number.";
      }
    }

    if (!input["password"]) {
      isValid = false;

      errors["password"] = "Please enter your password.";
    }

    if (typeof input["password"] !== "undefined") {
      if (input["password"].length < 6) {
        isValid = false;

        newErrors["password"] = "Minimum password length is 6 chars.";
      }
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    setShowPass(false);

    if (validate()) {
      console.log(input);

      try {
        const res = await fetch(`${restApiUrl}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });
        const response = await res.json();
        if (res.ok) {
          console.log(response);
          auth.login(response);
          setInput({
            name: "",
            email: "",
            password: "",
          });

          // history.push("/");
          history.go(-1);
        } else {
          console.log("Not ok", res);
          if (res.status === 400 && response.errors) {
            setErrors(response.errors);
          }
        }
      } catch (err) {
        console.log(err);
        setErrors({ name: err.message });
      }
    } else {
      console.log("validate failed:", errors);
    }
  };

  return (
    <Container>
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        color="textSecondary"
      >
        New User Sign Up
      </Typography>

      <form noValidate onSubmit={handleSubmit}>
        {/* Name Entry */}
        <TextField
          className={classes.field}
          onChange={handleChange}
          label="Full Name"
          variant="outlined"
          color="secondary"
          value={input.name}
          name="name"
          fullWidth
          required
          error={!!errors.name}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleOutlined />
              </InputAdornment>
            ),
          }}
        />
        <Typography
          variant="caption"
          className={classes.error}
          display="block"
          gutterBottom
        >
          {errors.name}
        </Typography>
        {/* Email Entry */}
        <TextField
          className={classes.field}
          onChange={handleChange}
          label="E-Mail"
          variant="outlined"
          color="secondary"
          value={input.email}
          name="email"
          type="email"
          fullWidth
          required
          error={!!errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AlternateEmailOutlinedIcon />
              </InputAdornment>
            ),
            inputMode: "email",
          }}
        />
        <Typography
          variant="caption"
          className={classes.error}
          display="block"
          gutterBottom
        >
          {errors.email}
        </Typography>
        {/* Phone Number Entry */}
        <InputMask
          mask="(999) 999-9999"
          value={input.telephone}
          disabled={false}
          onChange={handleChange}
          name="telephone"
          maskChar=" "
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              className={classes.field}
              label="Phone Number"
              variant="outlined"
              color="secondary"
              type="tel"
              fullWidth
              error={!!errors.telephone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneCallbackOutlinedIcon />
                  </InputAdornment>
                ),
                inputMode: "tel",
              }}
            />
          )}
        </InputMask>
        <Typography
          variant="caption"
          className={classes.error}
          display="block"
          gutterBottom
        >
          {errors.telephone}
        </Typography>
        {/* Password Entry */}
        <FormControl className={classes.field} variant="outlined">
          <InputLabel
            htmlFor="outlined-adornment-password"
            color="secondary"
            error={!!errors.password}
          >
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPass ? "text" : "password"}
            value={input.password}
            onChange={handleChange}
            name="password"
            fullWidth
            required
            color="secondary"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleShow}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPass ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
        <Typography
          variant="caption"
          className={classes.error}
          display="block"
          gutterBottom
        >
          {errors.password}
        </Typography>
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          endIcon={<PersonAddOutlinedIcon />}
        >
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default SignUp;

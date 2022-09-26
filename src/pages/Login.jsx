import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { baseUrl } from "../utilities/Global";
import { auth } from "../hooks/UseAuth";
import { makeStyles } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import AlternateEmailOutlinedIcon from "@material-ui/icons/AlternateEmailOutlined";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import IconButton from "@material-ui/core/IconButton";

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

const Login = () => {
  const [input, setInput] = useState({
    email: "",
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
        const res = await fetch(`${baseUrl}/auth/login`, {
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
        User Login
      </Typography>

      <form noValidate onSubmit={handleSubmit}>
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
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;

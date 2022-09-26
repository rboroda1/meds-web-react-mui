import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { restApiUrl_Users as url } from "../utilities/Global";
import { red } from "@material-ui/core/colors";
import EditUser from "./EditUser";
import { auth } from "../hooks/UseAuth";
import Alert from "@material-ui/lab/Alert";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => {
  return {
    list: {
      [theme.breakpoints.up("md")]: {
        width: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: 350,
      },
      marginTop: 20,
      maxWidth: "100%",
      background: "#f9f9f9",
      maxHeight: "100%",
      overflow: "auto",
    },
    avatar: {
      color: theme.palette.getContrastText(theme.palette.secondary.main),
      backgroundColor: theme.palette.secondary.main,
    },
    admin: {
      color: theme.palette.getContrastText(red[500]),
      backgroundColor: red[500],
    },
  };
});

export default function MyProfile() {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const { userId } = auth.status();

  useEffect(() => {
    if (refresh && userId) {
      fetch(`${url}/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setSelectedUser(data);
          setRefresh(false);
        });
    }
  }, [refresh, userId]);

  const saveUserCallback = (e) => {
    if (e) {
      setError(e);
    } else {
      setRefresh(true);
      setSuccess("User saved");
    }
  };

  return (
    <Container>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      {selectedUser && (
        <>
          <EditUser user={selectedUser} callback={saveUserCallback} />
          <Divider style={{ marginTop: 30, marginBottom: 10 }} />
          <Typography>userId is {userId}</Typography>
        </>
      )}
    </Container>
  );
}

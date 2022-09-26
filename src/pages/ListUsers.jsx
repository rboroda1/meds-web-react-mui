import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Container from "@material-ui/core/Container";
import { restApiUrl_Users as url } from "../utilities/Global";
import { red } from "@material-ui/core/colors";
import EditUser from "./EditUser";
import { auth } from "../hooks/UseAuth";
import ConfirmDialog from "../components/ConfirmDialog";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import Alert from "@material-ui/lab/Alert";

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

export default function ListUsers() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [confirmDel, setConfirmDel] = useState(false);
  const { jwt: token, loggedIn, isAdmin, userId } = auth.status();

  useEffect(() => {
    if (refresh) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUsers(data);
          setSelectedUser(null);
          setRefresh(false);
        });
    }
  }, [refresh]);

  const handleDelete = async (user) => {
    if (!loggedIn) {
      setError("Please log in first");
    } else if (!isAdmin) {
      setError("This is action requires Admin authority");
    } else {
      setConfirmDel(false);
      const res = await fetch(url + `/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const newUsers = users.filter((item) => item._id != user._id);
        setUsers(newUsers);
        setSelectedUser(null);
        setSuccess("User deleted");
      } else {
        let e = await res.text();
        setError(e);
      }
    }
  };

  const startDelete = (user) => {
    setSelectedUser(user);
    setConfirmDel(true);
  };

  const saveUserCallback = (e) => {
    if (e) {
      setError(e);
    } else {
      setRefresh(true);
      setSuccess("User saved");
    }
  };

  const toggleSelection = (user) => {
    if (selectedUser === user) setSelectedUser(null);
    else setSelectedUser(user);
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
      <div
        style={
          isAdmin
            ? {
                height: "40vh",
                width: "100%",
                justifyContent: "center",
                display: "flex",
                marginBottom: 30,
              }
            : {
                width: "100%",
                justifyContent: "center",
                display: "flex",
                marginBottom: 30,
              }
        }
      >
        <List dense className={classes.list}>
          {users.map((user) => {
            const labelId = `list-secondary-label-${user._id}`;
            return (
              <ListItem
                key={user._id}
                button
                selected={selectedUser === user}
                onClick={() => toggleSelection(user)}
              >
                <ListItemAvatar>
                  <Avatar
                    className={user.admin ? classes.admin : classes.avatar}
                  >
                    {user.name[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  id={labelId}
                  primary={user.name}
                  secondary={user.email}
                />
                {isAdmin && (
                  <ListItemSecondaryAction>
                    <Tooltip title="edit">
                      <IconButton edge="end" aria-label="edit">
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="delete">
                      <span>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          disabled={user._id == userId}
                          onClick={() => startDelete(user)}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            );
          })}
        </List>
      </div>
      {isAdmin && (
        <>
          <Divider style={{ marginTop: 30, marginBottom: 10 }} />
          {/* {selectedUser !== null && <EditUser user={selectedUser} />} */}
          <EditUser user={selectedUser} callback={saveUserCallback} />
        </>
      )}
      {selectedUser && (
        <ConfirmDialog
          openMe={confirmDel}
          text={`Do you want to delete ${selectedUser.name}?`}
          handleOk={() => handleDelete(selectedUser)}
          done={() => setConfirmDel(false)}
        />
      )}
    </Container>
  );
}

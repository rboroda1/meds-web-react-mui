import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { restApiUrl_Users } from "../utilities/Global";
import { auth } from "../hooks/UseAuth";

const useStyles = makeStyles((theme) => {
  return {
    avatar: {
      color: theme.palette.getContrastText(theme.palette.secondary.main),
      backgroundColor: theme.palette.secondary.main,
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 130,
    },
  };
});

function UserPicker({ addUser, disableUser }) {
  const [users, setUsers] = useState([]);
  const [selection, setSelection] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const classes = useStyles();

  useEffect(() => {
    if (users.length == 0) {
      fetch(restApiUrl_Users)
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
          setSelection(null);
        });
    }
  }, []);

  return (
    <div>
      {users.length > 0 && (
        <>
          <Typography
            variant="h6"
            component="h6"
            gutterBottom
            color="textSecondary"
          >
            {`Club Members: ${users.length}`}
          </Typography>
          <Autocomplete
            id="add-user"
            options={users.sort((a, b) => {
              const splitA = a.name.split(" ");
              const splitB = b.name.split(" ");
              const lastA = splitA[splitA.length - 1];
              const lastB = splitB[splitB.length - 1];
              let ret = -lastB.localeCompare(lastA);
              return ret ? ret : -splitB[0].localeCompare(splitA[0]);
            })}
            getOptionLabel={(user) => user.name}
            style={{ width: 300 }}
            value={selection}
            name="borrows"
            inputValue={inputValue}
            onChange={(е, user) => {
              addUser(user);
              setInputValue("");
            }}
            getOptionDisabled={(user) => disableUser(user._id)}
            renderOption={(option) => (
              <React.Fragment>
                <span>
                  <Avatar className={classes.avatar}>
                    {option.name[0].toUpperCase()}
                  </Avatar>
                </span>
                <Typography style={{ marginLeft: 15 }}>
                  {option.name}
                </Typography>
              </React.Fragment>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Select User" variant="outlined" />
            )}
          />
        </>
      )}
    </div>
  );
}

export default UserPicker;

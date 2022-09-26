import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import MedsCard from "../components/MedsCard";
import { restApiUrl } from "../utilities/Global";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Alert from "@material-ui/lab/Alert";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverOutlined from "@material-ui/icons/DeleteForeverOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { red, green, orange } from "@material-ui/core/colors";
import { auth } from "../hooks/UseAuth";
import { useHistory } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";

const useStyles = makeStyles((theme) => {
  return {
    grid: {
      marginTop: 20,
      marginBottom: 20,
      background: "#f9f9f9",
    },
    gone: {
      color: red[500],
    },
    soon: {
      color: green[500],
    },
    today: {
      color: orange[500],
    },
    regIcon: {
      color: green[400],
    },
    unregIcon: {
      color: red[400],
    },
  };
});

export default function SearchMeds() {
  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [meds, setMeds] = useState([]);
  const [selection, setSelection] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [currItem, setCurrItem] = useState(null);
  const [error, setError] = useState(null);
  const classes = useStyles();
  const history = useHistory();
  const { jwt: token, userId, userName, isAdmin, loggedIn } = auth.status();
  const dfOptions = { year: "numeric", month: "numeric", day: "numeric" };

  useEffect(() => {
    fetch(restApiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        data.sort((a, b) => a.genericName.localeCompare(b.genericName));
        setMeds(data);
      });
  }, []);

  const handleDelete = async (id) => {
    await fetch(restApiUrl + `/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newSelection = selection.filter((item) => item._id != id);
    setSelection(newSelection);

    const newTrips = meds.filter((item) => item._id != id);
    setMeds(newTrips);
  };

  const onSelectionChange = (event, newSel) => {
    console.log("newSel:", newSel);
    setSelection(newSel);
  };

  return (
    <Container>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {confirmDel && (
        <ConfirmDialog
          openMe={confirmDel}
          text={`Do you want to delete ${currItem.genericName}?`}
          handleOk={() => handleDelete(currItem._id)}
          done={() => setConfirmDel(false)}
        />
      )}
      {meds.length > 0 && (
        <>
          {/* <div style={{ height: "15vh", width: "100%" }}> */}
          <Autocomplete
            multiple
            id="tags-standard"
            options={meds}
            getOptionLabel={(option) =>
              `${option.genericName} (${option.tradeName})`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Immunosuppressant Agents"
                placeholder="Search"
              />
            )}
            onChange={onSelectionChange}
          />
          {/* </div> */}
          <Grid container spacing={3} className={classes.grid}>
            {selection.map((item) => (
              <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
                <MedsCard item={item} handleDelete={handleDelete} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}

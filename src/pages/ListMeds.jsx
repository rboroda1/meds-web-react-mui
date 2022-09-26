import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import MedsCard from "../components/MedsCard";
import { restApiUrl } from "../utilities/Global";
import { DataGrid } from "@material-ui/data-grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Alert from "@material-ui/lab/Alert";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverOutlined from "@material-ui/icons/DeleteForeverOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HowToRegOutlinedIcon from "@material-ui/icons/HowToRegOutlined";
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
    unregIcon: {
      color: red[400],
    },
  };
});

export default function ListMeds() {
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

  const columns = largeScreen
    ? [
        // { field: "_id", headerName: "ID", width: 90 },
        { field: "genericName", headerName: "Generic", width: 180 },
        { field: "tradeName", headerName: "Trade Name(s)", width: 180 },
        { field: "medClass", headerName: "Class", width: 140 },
        { field: "target", headerName: "Target", width: 140 },
        {
          field: "riskInfections",
          headerName: "Risk Infections",
          width: 280,
        },
        {
          field: "actions",
          headerName: "Actions",
          type: "string",
          width: 140,
          renderCell: (params) => {
            const item = meds.find((t) => t._id === params.id);
            return (
              <>
                <Tooltip title="delete">
                  <IconButton
                    onClick={() => {
                      setCurrItem(item);
                      setConfirmDel(true);
                    }}
                    aria-label="delete med"
                    className={classes.unregIcon}
                  >
                    <DeleteForeverOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="edit">
                  <IconButton
                    aria-label="edit trip"
                    onClick={() => {
                      history.push({
                        pathname: "/edit-meds",
                        state: { item: item },
                      });
                    }}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </>
            );
          },
        },
      ]
    : [
        { field: "genericName", headerName: "Generic", width: 130 },
        { field: "tradeName", headerName: "Trade", width: 130 },
        { field: "medClass", headerName: "Class", width: 130 },
      ];

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

  const onSelectionChange = (newSel) => {
    console.log("newSel:", newSel);
    const newSelection = meds.filter((i) => newSel.includes(i._id));
    setSelection(newSelection);
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
          <div style={{ height: "55vh", width: "100%" }}>
            <DataGrid
              rows={meds}
              columns={columns}
              // pageSize={5}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={onSelectionChange}
              getRowId={(row) => row._id}
            />
          </div>
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

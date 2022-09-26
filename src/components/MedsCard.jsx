import React, { useState } from "react";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverOutlined from "@material-ui/icons/DeleteForeverOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HowToRegOutlinedIcon from "@material-ui/icons/HowToRegOutlined";
import Collapse from "@material-ui/core/Collapse";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core";
import { red, orange, green } from "@material-ui/core/colors";
import { useHistory } from "react-router-dom";
import { auth } from "../hooks/UseAuth";
import ConfirmDialog from "./ConfirmDialog";

const useStyles = makeStyles((theme) => {
  return {
    test: {
      border: (item) => {
        return "1px solid green";
      },
    },
    avatar: {
      backgroundColor: (item) => {
        return green[400];
      },
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    gone: {
      color: red[500],
    },
  };
});

function MedsCard({ item, handleDelete, handleRegister }) {
  const classes = useStyles(item);
  const [expanded, setExpanded] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const history = useHistory();
  const dfOptions = { year: "numeric", month: "numeric", day: "numeric" };
  const { loggedIn, isAdmin } = auth.status();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // console.log(item);
  return (
    <div>
      <Card elevation={1} className={classes.test}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              {item.genericName[0].toUpperCase()}
            </Avatar>
          }
          title={item.genericName}
          subheader={item.tradeName}
        />
        <CardContent>
          <div>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="inline"
            >
              {"Class:  "}
            </Typography>
            <Typography variant="body2" color="textSecondary" display="inline">
              {item.medClass}
            </Typography>
          </div>
        </CardContent>
        <CardActions disableSpacing>
          <Tooltip title="edit">
            <IconButton
              aria-label="edit meds"
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
          <Tooltip title="delete">
            <IconButton
              onClick={() => setConfirmDel(true)}
              aria-label="delete trip"
              className={classes.gone}
            >
              <DeleteForeverOutlined />
            </IconButton>
          </Tooltip>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                display="inline"
              >
                {"Target:  "}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                display="inline"
              >
                {item.target}
              </Typography>
            </div>
            <div>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                display="inline"
              >
                {"Affected Areas:  "}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                display="inline"
              >
                {item.affectedAreas}
              </Typography>
            </div>
            <div>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                display="inline"
              >
                {"Risk Infections:  "}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                display="inline"
              >
                {item.riskInfections}
              </Typography>
            </div>
          </CardContent>
        </Collapse>
      </Card>
      <ConfirmDialog
        openMe={confirmDel}
        text={`Do you want to delete ${item.genericName}?`}
        handleOk={() => handleDelete(item._id)}
        done={() => setConfirmDel(false)}
      />
    </div>
  );
}

export default MedsCard;

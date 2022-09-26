import React from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ButtonBase from "@material-ui/core/ButtonBase";
import Hidden from "@material-ui/core/Hidden";
import {
  AddCircleOutlineOutlined,
  SubjectOutlined,
  MenuOutlined,
  ExitToAppOutlined,
  CardTravelOutlined,
  ExploreOutlined,
  AccountCircle,
  PeopleOutlined,
  AccountCircleOutlined,
  RecentActorsOutlined,
  SearchOutlined,
  PauseCircleFilledTwoTone,
  PlayCircleFilledWhite,
} from "@material-ui/icons";
import { useHistory, useLocation } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
import useAuth, { auth } from "../hooks/UseAuth";
import Button from "@material-ui/core/Button";
import PopUpMenu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { red } from "@material-ui/core/colors";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => {
  return {
    page: {
      background: theme.secondary,
      width: "100%",
      padding: theme.spacing(3),
      minHeight: "100vh",
      color: "#ced5e3",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
      color: "#ced5e3"
    },
    drawerPaper: {
      width: drawerWidth,
    },
    root: {
      display: "flex",
    },
    active: {
      background: "#f4f4f4",
    },
    title: {
      padding: theme.spacing(2),
    },
    centerTitle: {
      flexGrow: 2,
      textAlign: 'center',
    },
    appbar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    toolbar: theme.mixins.toolbar,
    date: {
      // flexGrow: 1,
    },
    avatar: {
      marginLeft: theme.spacing(2),
      color: theme.palette.getContrastText(theme.palette.secondary.main),
      backgroundColor: theme.palette.secondary.main,
    },
    admin: {
      color: red[500],
      display: "block",
      textAlign: "left",
    },
    standaloneIcon: {
      marginRight: theme.spacing(2),
      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main,
      fontSize: 35,
    },
  };
});

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <PopUpMenu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function Layout({ children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const options = { year: "numeric", month: "short", day: "numeric" };

  const [mobileOpen, setMobileOpen] = React.useState(false);

  useAuth();

  const { loggedIn, userName, isAdmin } = auth.status();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItemsAdmin = [
    {
      text: "List",
      icon: <CardTravelOutlined color="secondary" />,
      path: "/meds",
    },
    {
      text: "Search",
      icon: <SearchOutlined color="secondary" />,
      path: "/search-meds",
    },
    {
      text: "New",
      icon: <AddCircleOutlineOutlined color="secondary" />,
      path: "/create-meds",
    },
  ];

  const menuItemsAll = [
    {
      text: "List",
      icon: <CardTravelOutlined color="secondary" />,
      path: "/meds",
    },
    {
      text: "Search",
      icon: <SearchOutlined color="secondary" />,
      path: "/search-meds",
    },
    {
      text: "New",
      icon: <AddCircleOutlineOutlined color="secondary" />,
      path: "/create-meds",
    },
  ];

  const drawer = (menuItems) => {
    return (
      <div>
        <Typography variant="h5" className={classes.title} gutterBottom>
          Menu
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                history.push(item.path);
                mobileOpen && handleDrawerToggle();
              }}
              className={
                location.pathname === item.path ? classes.active : null
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  // const container =
  //   window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      {/* app bar */}
      <AppBar className={classes.appbar} elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuOutlined />
          </IconButton>
          <Typography className={classes.date}>
            {new Intl.DateTimeFormat("en-US", options).format(new Date())} 
          </Typography>
          <Typography variant="h5" className={classes.centerTitle}>Immunosuppressant Medications</Typography>
          {loggedIn ? (
            <>
              <ButtonBase focusRipple onClick={handleClick}>
                <AccountCircle className={classes.standaloneIcon} />

                <Typography variant="body1">
                  {userName}
                  {isAdmin && (
                    <Typography
                      variant="caption"
                      display="block"
                      className={classes.admin}
                    >
                      {"ADMIN"}
                    </Typography>
                  )}
                </Typography>
                {/* <Avatar className={classes.avatar}>
                  <AccountCircle style={{ fontSize: 45 }} />
                </Avatar> */}
                {/* <Avatar src="/morda2.jpg" className={classes.avatar} /> */}
              </ButtonBase>
              <StyledMenu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <StyledMenuItem
                  onClick={() => {
                    handleClose();
                    history.push("/profile");
                  }}
                >
                  <ListItemIcon>
                    <AccountCircleOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Edit Profile" />
                </StyledMenuItem>
                <StyledMenuItem
                  onClick={() => {
                    handleClose();
                    history.push("/logout");
                  }}
                >
                  <ListItemIcon>
                    <ExitToAppOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </StyledMenuItem>
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem> */}
              </StyledMenu>
            </>
          ) : (
            <>
              {/* <Button
                color="secondary"
                onClick={() => {
                  history.push("/login");
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  history.push("/signup");
                }}
              >
                Sign Up
              </Button> */}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* side drawer */}
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer(isAdmin ? menuItemsAdmin : menuItemsAll)}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer(isAdmin ? menuItemsAdmin : menuItemsAll)}
          </Drawer>
        </Hidden>
      </nav>

      <div className={classes.page}>
        <div className={classes.toolbar} />
        {children}
      </div>
    </div>
  );
}

export default Layout;

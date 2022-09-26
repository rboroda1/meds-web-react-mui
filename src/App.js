import { BrowserRouter as Router } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { indigo, purple } from "@material-ui/core/colors";
import Layout from "./components/Layout";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import useAuth from "./hooks/UseAuth";
import Navigation from "./components/Navigation";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1a237e",
    },
    secondary: {
      main: "#ced5e3",
    },
  },
});

function App() {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThemeProvider theme={theme}>
        <Router>
          <Layout>
            <Navigation />
          </Layout>
        </Router>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;

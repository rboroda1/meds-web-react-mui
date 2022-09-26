import React from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <Typography variant="h3" paragraph={true}>
        Sorry
      </Typography>
      <Typography variant="body2" gutterBottom>
        That page is not found
      </Typography>
      <Link to="/">
        <Typography variant="body2" gutterBottom>
          Back to the homepage...
        </Typography>
      </Link>
    </div>
  );
}

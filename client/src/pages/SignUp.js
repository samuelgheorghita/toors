import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Link, useNavigate } from "react-router-dom";
import { prePath } from "../apis/globalApi";

import * as api from "../api";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link to={`/${prePath}/`} className="sign-up__copyright">
        Toors
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function ErrorMessage({ mess }) {
  return (
    <Grid item xs={12}>
      <Typography variant="body2" color="#cd0000" align="left" sx={{ marginTop: 1.5 }}>
        {mess}
      </Typography>
    </Grid>
  );
}

const theme = createTheme();

export default function SignUp() {
  const [errorMessage, setErrorMessage] = React.useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const res = await api.postUser({
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        password: data.get("password"),
        username: data.get("username"),
      });
      const json = await res.data;
      console.log(json);
      navigate(`/${prePath}`);
    } catch (error) {
      console.log(error);

      setErrorMessage(error.response.data.errors[0].msg);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField autoComplete="given-name" name="firstName" required fullWidth id="firstName" label="First Name" autoFocus />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="lastName" label="Last Name" name="lastName" autoComplete="family-name" />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="username" label="Username" name="username" autoComplete="username" />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel control={<Checkbox value="allowExtraEmails" color="primary" />} label="I want to receive inspiration, marketing promotions and updates via email." />
              </Grid> */}
              {errorMessage && <ErrorMessage mess={errorMessage} />}
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to={`/${prePath}/users/login`} className="sign-up__already-account">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

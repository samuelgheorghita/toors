import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LinkMUI from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { prePathS } from "../apis/globalApi";

import { loginUser } from "../actions/users";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link to={`${prePathS}/`} className="sign-up__copyright">
        Toors
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#ff385c",
      dark: "#e43353",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#ff385c",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      await dispatch(
        loginUser({
          email: data.get("email"),
          password: data.get("password"),
        })
      );
      navigate(`${prePathS}`);
    } catch (error) {
      console.log(error);
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Typography component="h2" variant="h6">
              Demo account:
            </Typography>
            <Typography component="h2" variant="subtitle2">
              email: test@gmail.com <br />
              password: celery
            </Typography>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <LinkMUI href="#" variant="body2">
                  Forgot password?
                </LinkMUI>
              </Grid>
              <Grid item>
                <LinkMUI href={`${prePathS}/users/signup`} variant="body2">
                  Don't have an account? Sign Up
                </LinkMUI>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

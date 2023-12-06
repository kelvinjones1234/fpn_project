import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { Form, Row, Col, Button } from "react-bootstrap";
import "./SignIn.css";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          setCurrentUser(true);
        } else {
          setCurrentUser(false);
        }
      } catch (error) {
        console.error("Error checking logged-in status:", error);
      }
    };

    checkLoggedInStatus();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  const update_form_btn = () => {
    if (registrationToggle) {
      document.getElementById("form-btn").innerHTML = "Sign Up";
      setRegistrationToggle(false);
    } else {
      document.getElementById("form-btn").innerHTML = "Sign In";
      setRegistrationToggle(true);
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/signup/", {
        email: email,
        password: password,
      });

      console.log("User signed up successfully", response.data);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(
        "Error signing up:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/signout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials in the request
      });

      if (response.ok) {
        console.log("User signed out successfully");
        setCurrentUser(false); // Update the user's sign-in state
      } else {
        console.error("Error signing out:", response.statusText);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/signin/",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials in the request
        }
      );

      console.log("User signed in successfully:", response);
      setCurrentUser(true);
    } catch (error) {
      console.error("Error signing in:", error);
      // Show error alert
      setShowError(true);
    }
  };

  if (currentUser) {
    return (
      <>
        <Navbar className="bg-dark">
          <Container>
            <Navbar.Brand href="#home">School Logo</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <form>
                  <Button id="form-btn" onClick={handleSignOut}>
                    sign out
                  </Button>
                </form>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
  return (
    <>
      <Navbar className="bg-dark">
        <Container>
          <Navbar.Brand href="#home">School Logo</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button id="form-btn" onClick={update_form_btn}>
                sign up
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {registrationToggle ? (
        <div className="d-flex justify-content-center align-items-center vh-50">
          <Form
            style={{
              maxWidth: "500px",
              width: "100%",
              paddingTop: "50px",
              paddingRight: "25px",
              paddingLeft: "25px",
            }}
          >
            <h2 className="text-center mb-4">Sign Up</h2>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formHorizontalEmail"
            >
              <Form.Label column sm={3}>
                Email
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formHorizontalPassword"
            >
              <Form.Label column sm={3}>
                Password
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </Col>
            </Form.Group>
            <Button variant="dark" onClick={handleSignUp} className="w-100">
              Sign Up
            </Button>
          </Form>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-50">
          <Form
            style={{
              maxWidth: "500px",
              width: "100%",
              paddingTop: "50px",
              paddingRight: "25px",
              paddingLeft: "25px",
            }}
          >
            <h2 className="text-center mb-4">Sign in</h2>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formHorizontalEmail"
            >
              <Form.Label column sm={3}>
                Email
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formHorizontalPassword"
            >
              <Form.Label column sm={3}>
                Password
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </Col>
            </Form.Group>
            <Button variant="dark" onClick={handleSignIn} className="w-100">
              Sign In
            </Button>
          </Form>
          <Alert
            variant="danger"
            show={showError}
            onClose={() => setShowError(false)}
            dismissible
            className="error-alert"
          >
            <Alert.Heading></Alert.Heading>
            <p>Incorrect login details. Please try again.</p>
          </Alert>
        </div>
      )}
    </>
  );
};

export default SignUpForm;
import { Form, Row, Col, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Alert from "react-bootstrap/Alert";
import "../styles/Alert.css";


export default function Register({ children }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { registerUser, showError, setShowError} = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    registerUser(email, password);
  };
  
  return (
    <>
      {children}
      <div className="d-flex justify-content-center align-items-center vh-50">
        <Form
          style={{
            maxWidth: "500px",
            width: "100%",
            paddingTop: "50px",
            paddingRight: "25px",
            paddingLeft: "25px",
          }}
          onSubmit={handleRegister}
        >
          <h2 className="text-center mb-4">Sign Up</h2>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
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
          <Button type="submit" variant="dark" className="w-100">
            Sign Up
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
          <p>User already exists. Login instead.</p>
        </Alert>
      </div>
    </>
  );
}

import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const SignUp = ({ email, password, setEmail, setPassword, handleSignUp }) => {
  return (
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

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
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
  );
};

export default SignUp;

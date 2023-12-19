import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer
      style={{
        background: "black",
        position: "fixed",
        bottom: "0",
        width: "100%",
        padding: "1em 0"
      }}
    >
      <div style={{textAlign: "center"}}>&copy; 2023 PraiseMedia</div>
    </footer>
  );
};

export default Footer;

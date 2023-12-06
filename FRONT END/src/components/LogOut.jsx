import React from "react";
import { Navbar as BootstrapNavbar, Container, Button } from "react-bootstrap";

const Logout = ({ handleSignOut }) => {
  return (
    <BootstrapNavbar className="bg-dark">
      <Container>
        <BootstrapNavbar.Brand href="#home">School Logo</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle />
        <BootstrapNavbar.Collapse className="justify-content-end">
          <BootstrapNavbar.Text>
            <form>
              <Button id="form-btn" onClick={handleSignOut}>
                Sign Out
              </Button>
            </form>
          </BootstrapNavbar.Text>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Logout;

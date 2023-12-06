import React from "react";
import { Navbar as BootstrapNavbar, Container, Button } from "react-bootstrap";

const Navbar = ({ currentUser, updateFormBtn, handleSignOut }) => {
  return (
    <BootstrapNavbar className="bg-dark">
      <Container>
        <BootstrapNavbar.Brand href="#home">School Logo</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle />
        <BootstrapNavbar.Collapse className="justify-content-end">
          <BootstrapNavbar.Text>
            {currentUser ? (
              <form>
                <Button id="form-btn" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </form>
            ) : (
              <Button id="form-btn" onClick={updateFormBtn}>
                Sign Up
              </Button>
            )}
          </BootstrapNavbar.Text>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

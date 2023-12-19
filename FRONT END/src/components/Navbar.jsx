import Navbar from "react-bootstrap/Navbar";
import { Button, Container } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function NavBar({ statusButton }) {
  const { logoutUser } = useContext(AuthContext);

  const handleButtonClick = () => {
    if (statusButton === "Logout") {
      logoutUser();
    }
  };

  return (
    <Navbar className="bg-dark">
      <Container>
        <Navbar.Brand>School Logo</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {statusButton === "Logout" && (
              <Button id="form-btn" onClick={handleButtonClick}>
                {statusButton}
              </Button>
            )}
            {statusButton === "Login" && (
              <Link to="/login/">
              <Button id="form-btn">{statusButton}</Button>
              </Link>
            )}
            {statusButton === "Register" && (
              <Link to="/register/">
                <Button id="form-btn">{statusButton}</Button>
              </Link>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

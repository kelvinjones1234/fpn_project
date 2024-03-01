import Navbar from "react-bootstrap/Navbar";
import { Button, Container } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import fpnlogo from "../assets/fpnlogo.png";

export default function NavBar({ statusButton }) {
	const { logoutUser } = useContext(AuthContext);

	const handleButtonClick = () => {
		if (statusButton === "Logout") {
			logoutUser();
		}
	};

	return (
		<Navbar className="bg-dark" style={{ margin: "0", padding: "0" }}>
			<Container>
				<Navbar.Brand>
					<img src={fpnlogo} alt="school-logo" style={{ height: "5rem" }} />
				</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse className="justify-content-end">
					<Navbar.Text>
						{statusButton === "Logout" && (
							<Button id="form-btn" onClick={handleButtonClick}>
								{statusButton}
							</Button>
						)}
						{statusButton === "Login" && (
							<Link to="/home-page/">
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

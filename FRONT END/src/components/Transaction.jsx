import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import { Form, Row, Col, Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";

export default function Transaction() {
  const [formData, setFormData] = useState({
    matriculation_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    department: "",
    levy: "",
    amount: "",
    email: "",
  });

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [levies, setLevies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch department options from Django API
    axios
      .get("http://localhost:8000/api/departments/")
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error("Error fetching departments:", error));
  }, []);

  const handleDepartmentChange = (value) => {
    const selectedDepartment = departments.find(
      (department) => department.id === parseInt(value)
    );

    setFormData((prevState) => ({
      ...prevState,
      department: selectedDepartment ? selectedDepartment.department : "",
      levy: "", // Clear the levy when department changes
      amount: "",
    }));

    // Fetch levies based on the selected department
    axios
      .get(`http://localhost:8000/api/levies/${value}/`)
      .then((response) => setLevies(response.data))
      .catch((error) => console.error("Error fetching levies:", error));
  };

  const handleLevyChange = (value) => {
    const selectedLevy = levies.find((levy) => levy.id === parseInt(value));

    setFormData((prevState) => ({
      ...prevState,
      levy: selectedLevy ? selectedLevy.levy : "",
      amount: selectedLevy ? selectedLevy.amount : "",
    }));
  };
  const initiatePayment = async () => {
    try {
      // Validate email, amount, and other fields (add your own validation logic)
      if (
        !formData.matriculation_number ||
        !formData.first_name ||
        !formData.last_name ||
        !formData.department ||
        !formData.levy ||
        !formData.amount ||
        !formData.email
      ) {
        alert("Please fill in all fields.");
        return;
      }

      // Fetch authorization_url from your endpoint
      const response = await fetch(
        "http://localhost:8000/api/initiate-payment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      console.log(formData);
      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }

      const { data } = await response.json();

      // Open the authorization_url in a new window
      window.open(data.authorization_url, "_blank");

      // Set the payment status (optional)
      setPaymentStatus(
        <p>
          <b>Redirecting to paystack...</b>
        </p>
      );
    } catch (error) {
      console.error("Error initiating payment:", error.message);
      // Handle error as needed
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
        navigate("/authentication")
        // setCurrentUser(false); // Update the user's sign-in state
      } else {
        console.error("Error signing out:", response.statusText);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
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
      <form>
        <label>
          First Name:
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                first_name: e.target.value,
              }))
            }
          />
        </label>
        <br />

        <label>
          Middle Name:
          <input
            type="text"
            value={formData.middle_name}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                middle_name: e.target.value,
              }))
            }
          />
        </label>
        <br />

        <label>
          Last Name:
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                last_name: e.target.value,
              }))
            }
          />
        </label>
        <br />
        <label>
          Matriculation Number:
          <input
            type="text"
            value={formData.matriculation_number}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                matriculation_number: e.target.value,
              }))
            }
          />
        </label>
        <br />
        <label>
          Department
          <select
            value={formData.department}
            onChange={(e) => handleDepartmentChange(e.target.value)}
          >
            <option value="">
              {formData.department ? formData.department : "Select Department"}
            </option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.department}
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Levy:
          <select
            value={formData.levy}
            onChange={(e) => handleLevyChange(e.target.value)}
          >
            <option value="">
              {formData.levy ? formData.levy : "Select Levy"}
            </option>
            {levies.map((levy) => (
              <option key={levy.id} value={levy.id}>
                {levy.levy}
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Amount:
          <input
            type="text"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                amount: e.target.value,
              }))
            }
            readOnly
          />
        </label>
        <br />

        <label>
          Email:
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                email: e.target.value,
              }))
            }
          />
        </label>
        <br />
        <button type="button" onClick={initiatePayment}>
          Initiate Payment
        </button>
        {paymentStatus && <p>{paymentStatus}</p>}
      </form>
    </div>
  );
}

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import { Form, Row, Col, Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
 
export default function Payment({ children }) {
  const { authTokens, user, initiatePayment, setLoading, loading} = useContext(AuthContext);

  const [formData, setFormData] = useState({
    matriculation_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    department: "",
    levy: "",
    amount: "",
  });

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

  const handlePayment = async() => {
    initiatePayment(formData)
  }


  return (
    <div className="main-container" style={{ height: "100vh" }}>
      {children}
      <div style={{ display: "grid", placeItems: "center" }}>
        <Form
          className="form-conatainer"
          style={{
            maxWidth: "400px",
            width: "100%",
            margin: "6em auto",
            display: "grid",
          }}
        >
          <label className="mb-3 mx-3">
            <Form.Control
              type="text"
              value={formData.first_name}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  first_name: e.target.value,
                }))
              }
              placeholder="First Name"
            />
          </label>

          <label className="mb-3 mx-3">
            <Form.Control
              type="text"
              value={formData.middle_name}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  middle_name: e.target.value,
                }))
              }
              placeholder="Middle Name"
            />
          </label>

          <label className="mb-3 mx-3">
            <Form.Control
              type="text"
              value={formData.last_name}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  last_name: e.target.value,
                }))
              }
              placeholder="Last Name"
            />
          </label>
          <br />

          <label className="mb-3 mx-3">
            <Form.Control
              type="text"
              value={formData.matriculation_number}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  matriculation_number: e.target.value,
                }))
              }
              placeholder="Matriculation Number"
            />
          </label>

          <label className="mb-3 mx-3">
            {/* Department */}
            <Form.Select
              aria-label="Default select example"
              value={formData.department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
            >
              <option value="">
                {formData.department ? formData.department : "Department"}
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.department}
                </option>
              ))}
            </Form.Select>
          </label>

          <label className="mb-3 mx-3">
            <Form.Control
              type="text"
              value={user.email}
              placeholder="Email"
              readOnly
            />
          </label>

          <label className="mb-3 mx-3">
            {/* Levy */}
            <Form.Select
              aria-label="Default select example"
              value={formData.levy}
              onChange={(e) => handleLevyChange(e.target.value)}
            >
              <option value="">
                {formData.levy ? formData.levy : "Payment for..."}
              </option>
              {levies.map((levy) => (
                <option key={levy.id} value={levy.id}>
                  {levy.levy}
                </option>
              ))}
            </Form.Select>
          </label>

          <label className="mb-3 mx-3">
            <Form.Control
              type="text"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  amount: e.target.value,
                }))
              }
              placeholder="Amount"
              readOnly
            />
          </label>
          <Button className="mb-3 mx-3" id="form-btn" onClick={handlePayment}>
            Make Payment
          </Button>
          {loading && <Loading message="You are being redirected to payment gateway..." />}
        </Form>
      </div>
      <Footer />
    </div>
  );
}

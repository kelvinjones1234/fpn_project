import React, { useState, useEffect } from "react";
import axios from "axios";
// import { PaystackButton } from "react-paystack";

export default function Transaction() {
  const [formData, setFormData] = useState({
    matriculation_number: "",
    full_name: "",
    department: "",
    levy: "",
    amount: "",
    email: "",
  });

  const [departments, setDepartments] = useState([]);
  const [levies, setLevies] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Fetch department options from Django API
    axios
      .get("http://localhost:8000/api/departments/")
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error("Error fetching departments:", error));
  }, []);

  const handleDepartmentChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      department: value,
      levy: "",
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
      levy: value,
      amount: selectedLevy ? selectedLevy.amount : "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:8000/api/transactions/", formData)
      .then((response) => {
        // Handle success
        console.log("Transaction created:", response.data);
      })
      .catch((error) => {
        // Handle error
        console.error("Error creating transaction:", error);
      });
  };

  const publicKey = "pk_test_c3fe6a156c556f5b1238ef8ecd5bc92a83fa3926"; // Replace with your Paystack public key

  const config = {
    reference: new Date().getTime(),
    email: formData.email,
    amount: formData.amount * 100, // Amount in kobo (multiply by 100)
    publicKey: publicKey,
  };

  const handlePaymentSuccess = (response) => {
    setPaymentSuccess(true);
    // Additional handling if needed
  };

  const handlePaymentClose = () => {
    // Handle payment close
    console.log("Payment window closed.");
  };

  return (
    <div>
      {!paymentSuccess ? (
        <form onSubmit={handleSubmit}>
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
            Full Name:
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  full_name: e.target.value,
                }))
              }
            />
          </label>
          <br />

          <label>
            Department:
            <select
              value={formData.department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
            >
              <option value="">Select Department</option>
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
              <option value="">Select Levy</option>
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

          <PaystackButton
            text="Pay Now"
            className="payButton"
            callback={handlePaymentSuccess}
            close={handlePaymentClose}
            disabled={!formData.email || !formData.amount}
            {...config}
          />
        </form>
      ) : (
        <p>
          Payment successful! You can add additional success message or redirect
          the user.
        </p>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { PaystackButton } from "react-paystack";

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

  useEffect(() => {
    // Fetch department options from Django API
    axios
      .get("http://localhost:8000/api/departments/")
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error("Error fetching departments:", error));
  }, []);

  const handleDepartmentChange = (value) => {
    const selectedDepartment = departments.find((department) => department.id === parseInt(value));
  
    setFormData((prevState) => ({
      ...prevState,
      department: selectedDepartment ? selectedDepartment.department : "",
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
        console.log(formData)
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

  return (
    <div>
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
        <button type="button" onClick={initiatePayment}>
          Initiate Payment
        </button>
        {paymentStatus && <p>{paymentStatus}</p>}
      </form>
    </div>
  );
}

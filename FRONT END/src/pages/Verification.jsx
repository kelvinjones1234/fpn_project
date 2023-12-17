import React, { useState } from "react";

const VerifyPaymentForm = () => {
  const [reference, setReference] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleReferenceChange = (e) => {
    setReference(e.target.value);
  };

  const resetMessages = () => {
    setVerificationStatus(null);
    setErrorMessage(null);
  };

  const handleVerification = async () => {
    resetMessages(); // Reset messages before making a new verification attempt

    try {
      const response = await fetch(
        "http://localhost:8000/api/verify-payment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setVerificationStatus(responseData.status);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Incorrect Reference Code");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <label>
        Reference Code:
        <input type="text" value={reference} onChange={handleReferenceChange} />
      </label>
      <br />
      <button onClick={handleVerification}>Verify Payment</button>

      {verificationStatus && (
        <p>
          Status:{" "}
          {verificationStatus === "success"
            ? "Payment Verified"
            : "Verification Failed"}
        </p>
      )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default VerifyPaymentForm;

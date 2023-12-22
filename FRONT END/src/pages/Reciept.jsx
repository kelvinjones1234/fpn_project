import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { Container, Button, Card } from "react-bootstrap";

const Receipt = ({ children }) => {
  const [reference, setReference] = useState("");
  const [receiptData, setReceiptData] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const paymentReference = new URLSearchParams(window.location.search).get(
      "reference"
    );

    if (paymentReference) {
      setReference(paymentReference);

      const verifyPayment = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/verify-payment/?trxref=${paymentReference}&reference=${paymentReference}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          setReceiptData(data);
        } catch (error) {
          console.error("Error occurred during payment verification:", error);
        } finally {
          setLoading(false); // Set loading to false regardless of the outcome
        }
      };

      verifyPayment();
    }
  }, []); // No dependencies, only run once on mount

  const isPrinting = () => window.matchMedia("print").matches;

  return (
    <div>
      {!isPrinting() && <NavBar />}{" "}
      {/* Render NavBar only if not in print mode */}
      {loading ? (
        <p>Processing payment...</p>
      ) : (
        <>
          <Container>
            <h1 className="mt-3">Receipt</h1>
            <Card className="mt-3">
              <Card.Body>
                <Card.Title>Receipt Details</Card.Title>
                <Card.Text>
                  <strong>Transaction ID:</strong> {receiptData.id}
                  <br />
                  <strong>Matriculation Number:</strong>{" "}
                  {receiptData.matriculation_number}
                  <br />
                  <strong>Name:</strong>{" "}
                  {`${receiptData.first_name} ${receiptData.middle_name} ${receiptData.last_name}`}
                  <br />
                  <strong>Amount:</strong> {receiptData.amount} USD
                  <br />
                  <strong>Date:</strong>{" "}
                  {new Date(receiptData.date).toLocaleString()}
                  <br />
                  <strong>Paid:</strong> {receiptData.paid ? "Yes" : "No"}
                  <br />
                  <strong>Reference:</strong> {receiptData.reference}
                  <br />
                  <strong>Email:</strong> {receiptData.email}
                  <br />
                  <strong>Department:</strong> {receiptData.department}
                  <br />
                  <strong>Levy:</strong> {receiptData.levy}
                </Card.Text>
              </Card.Body>
            </Card>
            <Button className="mt-3" onClick={() => window.print()}>
              Print Receipt
            </Button>
          </Container>
        </>
      )}
    </div>
  );
};

export default Receipt;

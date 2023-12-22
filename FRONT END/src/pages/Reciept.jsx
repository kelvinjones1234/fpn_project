import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import "../styles/Alert.css";
import Loading from "../components/Loading";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Table,
  Image,
  Badge,
  Accordion,
  Button,
} from "react-bootstrap";
const Receipt = ({ children }) => {
  const [reference, setReference] = useState("");
  const [receiptData, setReceiptData] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  const handlePrint = () => {
    const printContents = document.getElementById("print-section");
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents.innerHTML;

    window.print();

    document.body.innerHTML = originalContents;
  };

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
          console.log(data);
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
    <div className="main-container" style={{ height: "100vh" }}>
      {children} {/* Render NavBar only if not in print mode */}
      <div style={{ padding: "0 1em", display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2rem",}}>
      {loading ? (
        <div>
          <Loading message="Generating receipt..." />
        </div>
      ) : (
        <div>
          <Card
            className="receipt-card"
            id="print-section"
            style={{
              maxWidth: "900px",
              width: "100%",
              display: "grid",
            }}
          >
            <CardHeader>
              <Row>
                <Col xs={4}>
                  <Image
                    src="path/to/school/logo.png"
                    alt="School Logo"
                    fluid
                  />
                </Col>
                <Col xs={8}>
                  <CardTitle tag="h5">
                    {/* Replace with your school name */}
                  </CardTitle>
                  <p>{/* Replace with your school address */}</p>
                  <p>Phone: +234 814 177 2672</p>
                  <p>Email: fedpolynassarawa@edu.ng</p>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  Receipt Number:{" "}
                  <Badge pill variant="primary">
                    {receiptData.id}
                  </Badge>
                </Col>
                <Col>Payment Date: {receiptData.date.slice(0, 10)}</Col>
              </Row>
              <Row>
                <Col>
                  Full Name: {receiptData.first_name.toUpperCase()}{" "}
                  {receiptData.middle_name.toUpperCase()}{" "}
                  {receiptData.last_name.toUpperCase()}
                </Col>
                <Col>Email: {receiptData.email}</Col>
              </Row>
              <Row>
                <Col>
                  Matriculation Number:{" "}
                  {receiptData.matriculation_number.toUpperCase()}
                </Col>
              </Row>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Department</th>
                    <td>{receiptData.department}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Levy</th>
                    <td>NACOSS</td>
                  </tr>
                  <tr>
                    <th>Reference Number</th>
                    <td>{receiptData.reference}</td>
                  </tr>
                  <tr>
                    <th>Total</th>
                    <td>{receiptData.amount}</td>
                  </tr>
                </tbody>
              </Table>
              <Row>
                <Col>
                  <b>Payment Status:</b>{" "}
                  {receiptData.paid ? "Paid" : "Not paid"}
                </Col>
              </Row>
              <Row></Row>
              {/* Additional Information, Footer, etc. */}
            </CardBody>
            <Button
              variant="primary"
              className="mb-3 mx-3 print-button"
              id="form-btn"
              onClick={handlePrint}
            >
              Print Receipt
            </Button>{" "}
          </Card>
        </div>
      )}
      </div>
    </div>
  );
};

export default Receipt;

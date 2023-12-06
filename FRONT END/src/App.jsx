import "bootstrap/dist/css/bootstrap.css";
import Transaction from "./components/Transaction";
import Authentication from "./components/Authentication";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="authentication" element={<Authentication />}/>
        <Route path="payment" element={<Transaction />}/>
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

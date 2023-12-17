import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/Navbar";
import Payment from "./pages/Payment";
import ProtectedRoutes from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="login/"
            element={
              <LogIn>
                <NavBar statusButton="Register" />
              </LogIn>
            }
          />
          <Route
            path="register/"
            element={
              <Register>
                <NavBar statusButton="Login" />
              </Register>
            }
          />
          <Route element={<ProtectedRoutes />}>
            <Route
              path="initiate-payment/"
              element={
                <Payment>
                  <NavBar onCli statusButton="Logout" />
                </Payment>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

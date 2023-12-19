import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export default AuthContext;

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [showError, setShowError] = useState(false);

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      if (!email || !password) {
        alert("Email and Password are required for logging in!");
        return;
      }
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("initiate-payment/");
      } else {
        console.error("Login failed:", response.statusText);
        setShowError(true);
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const registerUser = async (email, password) => {
    try {
      if (!email || !password) {
        alert("Email and Password are required to create an account!");
        return;
      }
      const response = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      console.log("data:", response);

      if (response.status === 201) {
        navigate("/login/");
      } else {
        console.error("Login failed:", response.statusText);
        setShowError(true);
      }
    } catch (error) {
      console.error("Registeration failed:", error.message);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login/");
  };

  const contextData = {
    user: user,
    showError: showError,
    authTokens: authTokens,
    setShowError: setShowError,
    loginUser: loginUser,
    logoutUser: logoutUser,
    registerUser: registerUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

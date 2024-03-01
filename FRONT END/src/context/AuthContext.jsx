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
  const [loading, setLoading] = useState(false);

  const [reference, setReference] = useState("");

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

  const initiatePayment = async (formData) => {
    try {
      if (
        !formData.matriculation_number ||
        !formData.first_name ||
        !formData.last_name ||
        !formData.department ||
        !formData.levy ||
        !formData.amount
        // !formData.email
      ) {
        alert("Please fill in all fields.");
        return;
      }
      setLoading(true);
      // Fetch authorization_url from your endpoint
      const response = await fetch(
        "http://localhost:8000/api/initiate-payment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
          withCredentials: true,

          body: JSON.stringify(formData),
        }
      );
      console.log(formData);
      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }

      const { data } = await response.json();

      // Open the authorization_url in a new window
      window.location.href = data.authorization_url;
      setReference(data.reference);

      // Set the payment status (optional)
    } catch (error) {
      console.error("Error initiating payment:", error.message);
      // Handle error as needed
    }
  };

  console.log(reference)

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
    navigate("/home-page/");
  };

  const contextData = {
    user: user,
    showError: showError,
    loading: loading,
    authTokens: authTokens,
    reference: reference,
    setLoading: setLoading,
    setShowError: setShowError,
    loginUser: loginUser,
    logoutUser: logoutUser,
    registerUser: registerUser,
    initiatePayment: initiatePayment,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
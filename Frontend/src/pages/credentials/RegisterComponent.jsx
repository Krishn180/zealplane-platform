import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "./RegisterComponent.scss";
import "/src/AboutCard/ModelStyle.css";
import logozp from "/src/assets/logoZP.png";
import { useDispatch } from "react-redux";
import { setUser, setUserId } from "../../store/userSlice";
import glogo from "/src/assets/Google__G__logo.svg.png";
import { GoogleLogin } from "@react-oauth/google";
import CongratsModal from "./CongratsModal";

export default function RegisterComponent({ showModal, handleClose }) {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState(() => {
    const stored = localStorage.getItem("registerCredentials");
    return stored ? JSON.parse(stored) : {};
  });

  const [otpSent, setOtpSent] = useState(() => {
    return localStorage.getItem("otpSent") === "true";
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(""); // State for OTP input
  const [loading, setLoading] = useState(false); // State for button loading
  const dispatch = useDispatch();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [timer, setTimer] = useState(0); // Timer for resend OTP
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    localStorage.setItem("registerCredentials", JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem("otpSent", otpSent);
  }, [otpSent]);

  // Clean up localStorage when component unmounts (user leaves registration)
  useEffect(() => {
    return () => {
      localStorage.removeItem("registerCredentials");
      localStorage.removeItem("otpSent");
    };
  }, []);

  // OTP countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = async () => {
    try {
      // Validate all fields before sending OTP
      if (
        !credentials.username ||
        !credentials.email ||
        !credentials.password ||
        !confirmPassword
      ) {
        toast.error("All fields are required before requesting OTP");
        return;
      }

      if (credentials.username.includes(" ")) {
        toast.error("Username cannot contain spaces");
        return;
      }

      if (!isValidEmail(credentials.email)) {
        toast.error("Please enter a valid email format");
        return;
      }

      if (credentials.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }

      if (credentials.password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (!agreedToPrivacy) {
        toast.error("You must agree to the Privacy Policy before proceeding");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${apiBaseUrl}/users/register`,
        { email: credentials.email }
      );

      toast.success("OTP sent to your email");
      setOtpSent(true);
      setTimer(60); // Start resend timer
    } catch (err) {
      if (err.response) {
        const errorMessage = err.response.data?.message || "Failed to send OTP";

        if (err.response.status === 400)
          toast.error("Invalid request. Please check your input.");
        else if (err.response.status === 401)
          toast.error("Unauthorized request.");
        else if (err.response.status === 403)
          toast.error("You are not allowed to perform this action.");
        else if (err.response.status === 404)
          toast.error("API endpoint not found.");
        else if (err.response.status === 409)
          toast.error("This email or username is already registered.");
        else if (err.response.status === 500)
          toast.error("Internal server error. Please try again later.");
        else toast.error(errorMessage);
      } else if (err.request) {
        toast.error(
          "No response from the server. Check your internet connection."
        );
      } else {
        toast.error("An unexpected error occurred while sending OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    try {
      if (
        !credentials.username ||
        !credentials.email ||
        !credentials.password ||
        !confirmPassword
      ) {
        toast.error("All fields are required");
        return;
      }

      if (credentials.username.includes(" ")) {
        toast.error("Username cannot contain spaces");
        return;
      }

      if (!isValidEmail(credentials.email)) {
        toast.error("Please enter a valid email format");
        return;
      }

      if (credentials.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }

      if (credentials.password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (!otp) {
        toast.error("Please enter the OTP sent to your email");
        return;
      }

      // Verify OTP and register the user
      const response = await axios.post(
        `${apiBaseUrl}/users/register`,
        {
          ...credentials,
          otp,
        }
      );

      toast.success("Successfully registered!");

      // Auto-login: store user data from the response
      const userData = response.data;
      if (userData.token) {
        localStorage.setItem("token", userData.token);
      }
      if (userData.refreshToken) {
        localStorage.setItem("refreshToken", userData.refreshToken);
      }
      if (userData.uniqueId) {
        localStorage.setItem("Id", userData.uniqueId);
        dispatch(setUserId(userData.uniqueId));
      }
      if (userData.username) {
        localStorage.setItem("username", userData.username);
      }

      dispatch(setUser(userData));

      // Clean up registration localStorage
      localStorage.removeItem("registerCredentials");
      localStorage.removeItem("otpSent");

      setShowCongrats(true);
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message || "Registration failed";
        if (err.response.status === 400) {
          toast.error(errorMessage);
        } else if (err.response.status === 401) {
          toast.error("Unauthorized request. Please try again.");
        } else if (err.response.status === 403) {
          toast.error("You are not authorized to perform this action.");
        } else if (err.response.status === 404) {
          toast.error("Registration API endpoint not found.");
        } else if (err.response.status === 409) {
          toast.error("Email already exists. Please use a different email.");
        } else if (err.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(errorMessage);
        }
      } else if (err.request) {
        toast.error("No response from server. Check your network connection.");
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
    }
  };

  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      console.log("Google Token:", googleToken);

      // Send the Google token to your backend for verification and login
      const response = await axios.post(
        `${apiBaseUrl}/users/google-login`,
        {
          token: googleToken,
        }
      );

      const {
        id: userId,
        username,
        token,
        refreshToken,
        profilePic,
      } = response.data.user;

      localStorage.setItem("Id", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      if (profilePic) {
        localStorage.setItem("profilePic", profilePic);
      }

      // Clean up registration localStorage
      localStorage.removeItem("registerCredentials");
      localStorage.removeItem("otpSent");

      dispatch(setUser(response.data.user));
      dispatch(setUserId(userId));
      toast.success("Successfully logged in with Google!");
      navigate("/home");
    } catch (err) {
      console.error("Error handling Google Sign-In:", err);
      if (err.response) {
        const errorMessage =
          err.response.data?.message || "Google Sign-in failed";
        if (err.response.status === 400) {
          toast.error("Invalid request. Try again.");
        } else if (err.response.status === 401) {
          toast.error("Google authentication failed. Please try again.");
        } else if (err.response.status === 403) {
          toast.error(
            "Access denied. You are not allowed to perform this action."
          );
        } else if (err.response.status === 404) {
          toast.error("Google login API endpoint not found.");
        } else if (err.response.status === 500) {
          toast.error("Server error during Google sign-in. Please try again.");
        } else {
          toast.error(errorMessage);
        }
      } else if (err.request) {
        toast.error("No response from server. Check your internet connection.");
      } else {
        toast.error("An unexpected error occurred during Google Sign-In.");
      }
    }
  };

  return (
    <>
      {/* <div className="logo-img">
    <img src={logozp} alt="ZealPlane Logo" className="logo-img" />
    <span style={{ color: "red", fontWeight: "900", fontSize: "19px" }}>
      ZEALPLANE
    </span>
  </div> */}

      <div className="login-wrapper">
        <ToastContainer />
        <div className="login-wrapper-inner">
          <h1 className="heading">
            Unlock a World of Hidden Comics & Fellow Creators
          </h1>
          <div className="auth-inputs">
            <input
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  username: event.target.value,
                }))
              }
              type="text"
              className="common-input"
              placeholder="Choose a Unique Username"
            />
            <input
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              type="email"
              className="common-input"
              placeholder="Email"
            />
            <input
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              type="password"
              className="common-input"
              placeholder="Password (min 6 characters)"
            />
            <input
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              className="common-input"
              placeholder="Confirm Password"
            />
            {otpSent && (
              <input
                onChange={(event) => setOtp(event.target.value)}
                type="text"
                className="common-input"
                placeholder="Enter the OTP sent to your email"
              />
            )}
          </div>
          <div className="privacy-checkbox">
            <label>
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={() => setAgreedToPrivacy(!agreedToPrivacy)}
              />
              I agree to the{" "}
              <span
                className="privacy-link"
                onClick={() => navigate("/privacy-policy")}
              >
                Privacy Policy
              </span>
            </label>
          </div>

          {!otpSent ? (
            <>
              <button
                onClick={sendOtp}
                className="login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span style={{ marginLeft: "8px" }}>Sending OTP...</span>
                  </>
                ) : (
                  "Get Access Code"
                )}
              </button>
              <p
                className="go-to-signup"
                style={{ marginTop: "10px", fontSize: "13px", color: "#999" }}
              >
                🔒 We respect your privacy. The code keeps ZealPlane safe from
                bots.
              </p>
            </>
          ) : (
            <>
              <button onClick={register} className="login-btn">
                Verify & Enter the World
              </button>
              <p
                className="go-to-signup"
                style={{ marginTop: "10px", fontSize: "13px", color: "#999" }}
              >
                You’re one step away from unlocking fan-favorite content.
              </p>

              {timer > 0 ? (
                <p
                  className="go-to-signup"
                  style={{ marginTop: "5px", fontSize: "12px", color: "#aaa" }}
                >
                  ⏳ Resend OTP in {timer}s
                </p>
              ) : (
                <button onClick={sendOtp} className="resend-otp-btn">
                  Resend OTP
                </button>
              )}
            </>
          )}

          <div className="google-btn-container">
            <p className="go-to-signup">
              Already on ZealPlane?{" "}
              <span className="join-now" onClick={() => navigate("/login")}>
                Sign in
              </span>
            </p>
          </div>
          {/* // <<<<<<< main
//       <div className="login-wrapper">
//         <ToastContainer />
//         <div className="login-wrapper-inner">
//           <h1 className="heading">
//             Whether You Draw or Just Love Comics — This Is Your New Home.
//           </h1>
// =======
// >>>>>>> main */}

          <p className="go-to-signup">
            Prefer instant access with your Google ID?
          </p>
          <div className="google-btn-container">
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogleRegister(credentialResponse)
              }
              onError={() =>
                toast.error("Google Sign-in failed. Please try again.")
              }
            />
          </div>
        </div>
      </div>
      {showCongrats && <CongratsModal onClose={() => navigate("/home")} />}
    </>
  );
}

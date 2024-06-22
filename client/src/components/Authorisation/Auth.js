import { useState } from "react";
import "./index.css";
import { useCookies } from "react-cookie";

export default function Auth() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [licenseKey, setLicenseKey] = useState(null);

  const viewLogin = (status) => {
    setError(null);
    setIsLogIn(status);
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLogIn && password != confirmPassword) {
      setError("Make sure passwords match");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_SERVERURL}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, license_key: licenseKey }),
      }
    );

    const data = await response.json();
    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("Email", data.email);
      setCookie("AuthToken", data.token);
      setCookie("Role", data.role);

      window.location.reload();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-container-box-1"></div>

      <div className="auth-container-box">
        <form>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-RussianViolet md:text-2xl dark:text-white mb-5">
            {isLogIn
              ? "Please Log In To VitalOrgans"
              : "Please Sign Up To VitalOrgans"}
          </h2>
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogIn && (
            <>
              <input
                type="password"
                placeholder="confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <input
                type="text"
                placeholder="license key for Hospital/Clinic (ex. HSP-1234-2024-IN)"
                onChange={(e) => setLicenseKey(e.target.value)}
              />
            </>
          )}

          <input
            type="submit"
            className="create "
            onClick={(e) => handleSubmit(e, isLogIn ? "login" : "signup")}
          />

          {error && <p className="error">{error}</p>}
       
        </form>

        <div className="auth-options">
          <button
            onClick={() => viewLogin(false)}
            className={!isLogIn ? "active" : ""}
          >
            Sign Up
          </button>

          <button
            onClick={() => viewLogin(true)}
            className={isLogIn ? "active" : ""}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

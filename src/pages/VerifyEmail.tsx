import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../styles/verifyEmail.css";

export const VerifyEmail: React.FC = () => {
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "vladimir.boltava@yandex.ru";
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = codes.join("");
    if (code.length !== 6) {
      setError("Пожалуйста, введите все 6 цифр кода");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:80/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        navigate("/login");
      } else if (response.status === 400) {
        setError("Неверный код. Попробуйте с��ова.");
      } else {
        setError("Ошибка верификации. Попробуйте снова.");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:80/auth/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (response.ok) {
        // Clear the codes and focus first input
        setCodes(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError("Ошибка отправки кода. Попробуйте снова.");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-email-page">
      <div className="verify-email-header">
        <div className="header-logo-section">
          <div className="header-logo-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.904 20.5707C25.5317 20.1984 25.0576 19.9446 24.5413 19.8414L21.3587 19.2054C19.6142 18.8565 17.8032 19.0991 16.212 19.8947L15.788 20.1054C14.1968 20.901 12.3858 21.1436 10.6413 20.7947L8.06667 20.28C7.63627 20.1941 7.1913 20.2156 6.77125 20.3429C6.35119 20.4701 5.96903 20.699 5.65867 21.0094M10.6667 5.33337H21.3333L20 6.66671V13.5627C20.0002 14.2699 20.2812 14.9481 20.7813 15.448L27.448 22.1147C29.128 23.7947 27.9373 26.6667 25.5613 26.6667H6.43734C4.06134 26.6667 2.872 23.7947 4.552 22.1147L11.2187 15.448C11.7188 14.9481 11.9999 14.2699 12 13.5627V6.66671L10.6667 5.33337Z"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="header-logo-text">Проекты СГУГиТ</div>
        </div>
        <div className="header-navigation">
          <Link to="/projects" className="header-nav-link">
            Проекты
          </Link>
          <a href="#" className="header-nav-link">
            О платформе
          </a>
          <a href="#" className="header-nav-link">
            Контакты
          </a>
        </div>
        <div className="header-auth-section">
          <Link to="/login" className="header-login-link">
            Войти
          </Link>
          <div className="header-divider" />
          <Link to="/register" className="header-register-button">
            Регистрация
          </Link>
        </div>
        <div className="header-menu-button">
          <div className="menu-icon">
            <div className="menu-line"></div>
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </div>
        </div>
      </div>

      <div className="verify-email-main">
        <div className="verify-email-form-container">
          <div className="form-header-section">
            <div className="form-icon-container">
              <svg
                className="form-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 8L10.8906 13.2604C11.5624 13.7394 12.4376 13.7394 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="form-title-text">Подтверждение почты</h1>
          </div>

          <div className="email-info-section">
            <div className="email-info-label">
              Код подтверждения отправлен на почту
            </div>
            <div className="email-address">{email}</div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="verification-codes">
              {codes.map((code, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="code-input"
                  value={code}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                />
              ))}
            </div>

            <button
              type="submit"
              className="confirm-button"
              disabled={isLoading || codes.some((code) => !code)}
            >
              {isLoading ? "Подтверждение..." : "Подтвердить"}
            </button>
          </form>

          <div className="resend-section">
            <span className="resend-text">Не получили код?</span>
            <button
              type="button"
              className="resend-link"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Отправить повторно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

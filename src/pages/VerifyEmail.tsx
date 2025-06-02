import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/verifyEmail.css";

export const VerifyEmail: React.FC = () => {
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!email) setError("Неизвестная почта. Попробуйте начать регистрацию заново.");
  }, [email]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (codes[index]) {
        const newCodes = [...codes];
        newCodes[index] = "";
        setCodes(newCodes);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter" && index === 5) {
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Нет email для верификации.");
      return;
    }
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
        setError("Неверный код. Попробуйте снова.");
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
    if (!email) return;
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:80/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setCodes(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError("Ошибка отправки кода. Попробуйте снова.");
      }
    } catch {
      setError("Ошибка подключения к серверу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-email-main">
      <div className="verify-email-form-container">
        <div className="form-header-section">
          <div className="form-icon-container">
            {/* SVG и заголовок */}
          </div>
          <h1 className="form-title-text">Подтверждение почты</h1>
        </div>
        <div className="email-info-section">
          <div className="email-info-label">Код подтверждения отправлен на почту</div>
          <div className="email-address">{email || "Неизвестная почта"}</div>
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
                disabled={isLoading || !email}
              />
            ))}
          </div>
          <button
            type="submit"
            className="confirm-button"
            disabled={isLoading || codes.some((code) => !code) || !email}
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
            disabled={isLoading || !email}
          >
            Отправить повторно
          </button>
        </div>
      </div>
    </div>
  );
};

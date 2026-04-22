import React from "react";
import { getPasswordStrength } from "../../util/auth";
import "./PasswordStrengthIndicator.css";

/**
 * Custom component for Password Strength Indicator
 * @param {string} password - The password string to evaluate
 * @param {boolean} detailed - If true, shows a container box with extra hints (ResetPassword style)
 */
function PasswordStrengthIndicator({ password, detailed = false }) {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  if (detailed) {
    return (
      <div className="security-score-box">
        <div className="security-score-header">
          <span className="score-label">SECURITY SCORE</span>
          <span className={`score-value ${strength.color}`}>
            {strength.label}
          </span>
        </div>
        <div className="security-score-bars">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`score-bar ${strength.level >= step ? strength.color : "empty"}`}
            ></div>
          ))}
        </div>
        <div className="security-score-hint">
          <i className="fa-solid fa-circle-info"></i>
          <span>
            Use at least 8 characters, including an uppercase letter, a number,
            and a special symbol.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="security-strength-container">
      <div className="security-strength-labels">
        <span className="strength-label">SECURITY STRENGTH</span>
        <span className={`strength-value ${strength.color}`}>
          {strength.label}
        </span>
      </div>
      <div className="security-strength-bars">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`strength-bar ${strength.level >= step ? strength.color : "empty"}`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default PasswordStrengthIndicator;

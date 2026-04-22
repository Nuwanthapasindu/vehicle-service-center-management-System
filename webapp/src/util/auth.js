import { enums } from "../constants/enum";

/**
 * Calculates password strength score (0-4)
 */
export function getPasswordStrength(password) {
  if (!password) return { level: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;

  if (score === 1)
    return { level: 1, label: enums.PASSWORD_LABELS.WEAK, color: "weak" };
  if (score === 2)
    return { level: 2, label: enums.PASSWORD_LABELS.FAIR, color: "fair" };
  if (score === 3)
    return { level: 3, label: enums.PASSWORD_LABELS.GOOD, color: "good" };
  if (score === 4)
    return { level: 4, label: enums.PASSWORD_LABELS.STRONG, color: "strong" };
  return { level: 0, label: "", color: "" };
}

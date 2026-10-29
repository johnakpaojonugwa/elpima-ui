export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export interface PasswordEvaluation {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Empty" | "Weak" | "Fair" | "Good" | "Very Strong";
  color: string;
  badgeBg: string;
  badgeText: string;
  suggestion: string;
  criteria: PasswordCriteria;
}

export function evaluatePassword(password: string): PasswordEvaluation {
  if (!password) {
    return {
      score: 0,
      label: "Empty",
      color: "bg-stone-200",
      badgeBg: "bg-stone-100",
      badgeText: "text-stone-400",
      suggestion: "Use 8+ characters with mixed letters, numbers, and symbols.",
      criteria: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
      },
    };
  }

  const criteria: PasswordCriteria = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const metCount = Object.values(criteria).filter(Boolean).length;

  let score: 0 | 1 | 2 | 3 | 4 = 1;

  if (password.length < 6) {
    score = 1;
  } else if (password.length >= 8 && metCount >= 4) {
    score = password.length >= 12 ? 4 : 3;
  } else if (password.length >= 8 && metCount >= 3) {
    score = 3;
  } else if (password.length >= 6 && metCount >= 2) {
    score = 2;
  } else {
    score = 1;
  }

  let suggestion = "Solid password security.";
  if (!criteria.minLength) {
    suggestion = `Add ${8 - password.length} more characters.`;
  } else if (!criteria.hasUppercase || !criteria.hasLowercase) {
    suggestion = "Mix uppercase and lowercase letters.";
  } else if (!criteria.hasNumber) {
    suggestion = "Include at least one number.";
  } else if (!criteria.hasSpecial) {
    suggestion = "Add a symbol like ! @ # $ % & *";
  } else if (score >= 4) {
    suggestion = "Excellent! Meets highest security standards.";
  }

  switch (score) {
    case 1:
      return {
        score: 1,
        label: "Weak",
        color: "bg-rose-500",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-700",
        suggestion,
        criteria,
      };
    case 2:
      return {
        score: 2,
        label: "Fair",
        color: "bg-amber-500",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        suggestion,
        criteria,
      };
    case 3:
      return {
        score: 3,
        label: "Good",
        color: "bg-emerald-500",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-800",
        suggestion,
        criteria,
      };
    case 4:
      return {
        score: 4,
        label: "Very Strong",
        color: "bg-[#2D7A58]",
        badgeBg: "bg-emerald-100",
        badgeText: "text-[#1E553D]",
        suggestion,
        criteria,
      };
    default:
      return {
        score: 1,
        label: "Weak",
        color: "bg-rose-400",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-600",
        suggestion,
        criteria,
      };
  }
}


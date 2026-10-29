import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, PasswordInput, TextBox } from "@/components/app";
import { authService } from "@/services/auth";

interface ResetPasswordProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  email,
  onBack,
  onSuccess,
}) => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token.trim() || !password) {
      setError("Enter the reset token and a new password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        token: token.trim(),
        newPassword: password,
      });
      onSuccess();
    } catch (requestError: any) {
      setError(
        requestError?.normalizedMessage ||
          requestError?.response?.data?.message ||
          requestError?.response?.data?.msg ||
          requestError?.message ||
          "Unable to reset your password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Forgot Password
      </button>

      <div className="text-left mb-4">
        <h2 className="text-lg font-bold text-stone-900">Reset Password</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Enter the reset token sent to {email} and choose a new password.
        </p>
      </div>

      <TextBox
        label="RESET TOKEN"
        id="reset-password-token"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder="Paste the reset token from your email"
        required
      />

      <PasswordInput
        label="NEW PASSWORD"
        id="reset-password-new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Create a new strong password"
        showStrengthMeter={true}
        required
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        className="w-full text-base font-bold shadow-sm hover:shadow-md py-3.5"
      >
        Save New Password
      </Button>

      {error && (
        <p role="alert" className="text-xs text-rose-600 text-center">
          {error}
        </p>
      )}
    </form>
  );
};

export default ResetPassword;


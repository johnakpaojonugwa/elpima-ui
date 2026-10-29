import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, TextBox } from "@/components/app";
import { authService } from "@/services/auth";

interface ForgotPasswordProps {
  onBack: () => void;
  onCodeSent: (email: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onBack,
  onCodeSent,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) {
      setError("Enter your official email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await authService.forgotPassword({ email: email.trim() });
      onCodeSent(email.trim());
    } catch (requestError: any) {
      setError(
        requestError?.normalizedMessage ||
          requestError?.response?.data?.message ||
          requestError?.response?.data?.msg ||
          requestError?.message ||
          "Unable to send a password reset token.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSendCode} className="space-y-4" noValidate>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
      </button>

      <div className="text-left mb-4">
        <h2 className="text-lg font-bold text-stone-900">Forgot Password?</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Request a password reset token for your Elpima staff account.
        </p>
      </div>

      <TextBox
        label="OFFICIAL EMAIL"
        id="forgot-password-email"
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (error) setError("");
        }}
        placeholder="admin@elpimasurgicals.com"
        required
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        className="w-full"
      >
        Send Reset Token
      </Button>

      {error && (
        <p role="alert" className="text-xs text-rose-600 text-center">
          {error}
        </p>
      )}
    </form>
  );
};

export default ForgotPassword;


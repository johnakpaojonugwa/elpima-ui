import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, RotateCw } from "lucide-react";
import { OtpInput, Button } from "@/components/app";
import { useAuthStore } from "@/store";

export interface OtpVerificationPageProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
  otpLength?: number;
}

export const OtpVerificationPage: React.FC<OtpVerificationPageProps> = ({
  email,
  onSuccess,
  onBack,
  otpLength = 6,
}) => {
  const verify2FA = useAuthStore((state) => state.verify2FA);
  const tempToken = useAuthStore((state) => state.tempToken);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendNotice, setResendNotice] = useState(false);

  const INITIAL_SECONDS = 62;
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((previousSeconds) => Math.max(0, previousSeconds - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}.${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setOtp("");
    setError("");
    setSecondsLeft(INITIAL_SECONDS);
    setResendNotice(true);
    setTimeout(() => setResendNotice(false), 3000);
  };

  const handleQuickFillDemo = () => {
    const demoCode = "123456".slice(0, otpLength);
    setOtp(demoCode);
    setError("");
  };

  const handleConfirm = async () => {
    if (otp.length < otpLength) {
      setError(
        `Please enter all ${otpLength} digits of your verification code`,
      );
      return;
    }

    if (!tempToken) {
      setError(
        "Your 2FA session has expired or is invalid. Please return to sign in.",
      );
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await verify2FA({ tempToken, code: otp });
      setIsVerified(true);
      setTimeout(onSuccess, 500);
    } catch (requestError: any) {
      setError(
        requestError?.normalizedMessage ||
          requestError?.response?.data?.error?.message ||
          requestError?.response?.data?.message ||
          requestError?.message ||
          "Invalid verification code. Please check your authenticator app and try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center py-4 sm:py-6"
    >
      <div className="w-full flex items-center justify-start mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-3">
        Two-Factor Verification
      </h1>

      <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-sm mb-2">
        Enter the 6-digit TOTP code from your authenticator app
      </p>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600 font-medium mb-8">
        <span>{email || "admin@elpimasurgicals.com"}</span>
        <button
          type="button"
          onClick={onBack}
          className="text-[#2D7A58] hover:text-emerald-800 font-semibold underline cursor-pointer ml-1"
        >
          Change
        </button>
      </div>

      <div className="w-full mb-6">
        <OtpInput
          length={otpLength}
          value={otp}
          onChange={(newOtpValue) => {
            setOtp(newOtpValue);
            if (error) setError("");
          }}
          error={error}
          disabled={isVerifying || isVerified}
          autoFocus={true}
        />
      </div>

      <div className="mb-8" aria-live="polite">
        <span className="text-sm font-bold text-stone-800 tracking-wider font-mono">
          {formatTimer(secondsLeft)}
        </span>
      </div>

      <div className="w-full max-w-sm mb-5">
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={otp.length < otpLength || isVerifying || isVerified}
          isLoading={isVerifying}
          variant="primary"
          size="lg"
          className="w-full shadow-sm hover:shadow-md py-3.5 sm:py-4 text-base font-bold bg-[#2D7A58] hover:bg-[#256649] transition-all rounded-xl cursor-pointer"
        >
          {isVerified ? (
            <span className="inline-flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Verified!</span>
            </span>
          ) : (
            "Confirm"
          )}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2 text-xs">
        <div className="flex items-center justify-center gap-1.5 text-stone-600">
          <span>Code expired?</span>
          <button
            type="button"
            onClick={handleResend}
            className="text-[#F77F38] hover:text-[#EA580C] font-semibold transition-colors cursor-pointer"
          >
            Refresh timer
          </button>
        </div>

        {resendNotice && (
          <div className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-3 py-1 rounded-lg text-[11px] animate-in fade-in duration-200">
            <RotateCw className="w-3 h-3 animate-spin" />
            <span>Verification window refreshed!</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleQuickFillDemo}
          className="mt-3 text-[11px] text-stone-400 hover:text-stone-700 underline transition-colors cursor-pointer"
        >
          Auto-fill code for testing (123456)
        </button>
      </div>
    </motion.div>
  );
};

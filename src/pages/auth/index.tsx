import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/app";

import SignIn from "@/pages/auth/components/signin";
import { OtpVerificationPage } from "@/pages/auth/components/verify";
import ForgotPassword from "@/pages/auth/components/forgot-password";
import ResetPassword from "@/pages/auth/components/reset-password";
import { useAuthStore } from "@/store";

export default function AuthPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((authState) => authState.isAuthenticated);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [mfaEmail, setMfaEmail] = useState("");

  // Quick-fill state for testing Sign In
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleQuickFillSuperAdmin = () => {
    setEmail("admin@elpimasurgicals.com");
    setPassword("AdminPassword123!");
  };

  const handleQuickFillManager = () => {
    setEmail("manager@elpimasurgicals.com");
    setPassword("ManagerPassword123!");
  };

  /**
   * Role-aware redirect after successful sign-in.
   */
  const handleSignInSuccess = useCallback(() => {
    const role = useAuthStore.getState().user?.role;
    if (role === "SUPER_ADMIN") {
      navigate("/super-admin/dashboard", { replace: true });
    } else {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  /**
   * If the backend returns requires2FA: true, SignIn calls this.
   */
  const handleMfaRequired = useCallback((emailUsed: string) => {
    setMfaEmail(emailUsed);
    setIsMfaStep(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      handleSignInSuccess();
    }
  }, [isAuthenticated, handleSignInSuccess]);

  return (
    <main className="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-2 overflow-x-hidden font-sans antialiased text-stone-900">
      {/* ================= LEFT COLUMN: Hero Brand & Photography (Edge-to-Edge) ================= */}
      <section className="relative hidden lg:flex w-full h-[380px] sm:h-[460px] lg:h-full lg:min-h-screen order-1 lg:order-1 select-none">
        <HeroSection onPartnerClick={() => navigate("/catalog")} />
      </section>

      {/* ================= RIGHT COLUMN: Sign In, 2FA & Password Recovery ================= */}
      <section className="w-full min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 order-2 lg:order-2 bg-white overflow-y-auto">
        {/* Top Header Row: Quick Fill Buttons + Portal Badge */}
        <header className="w-full max-w-md mx-auto flex flex-wrap items-center justify-between gap-2 pb-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickFillSuperAdmin}
              className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Auto-populate seeded Super-Admin credentials"
            >
              Auto-fill Super-Admin
            </button>
            <button
              type="button"
              onClick={handleQuickFillManager}
              className="text-[11px] font-semibold text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200/70 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Auto-populate seeded Supervising Manager credentials"
            >
              Auto-fill Manager
            </button>
          </div>

          <span className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#2D7A58] text-white shadow-2xs">
            Staff Portal Sign In
          </span>
        </header>

        {/* Central Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          {isForgotPasswordOpen ? (
            <ForgotPassword
              onBack={() => setIsForgotPasswordOpen(false)}
              onCodeSent={(targetEmail) => {
                setForgotPasswordEmail(targetEmail);
                setIsForgotPasswordOpen(false);
                setIsResetPasswordOpen(true);
              }}
            />
          ) : isResetPasswordOpen ? (
            <ResetPassword
              email={forgotPasswordEmail}
              onBack={() => {
                setIsResetPasswordOpen(false);
                setIsForgotPasswordOpen(true);
              }}
              onSuccess={() => {
                setIsResetPasswordOpen(false);
                setForgotPasswordEmail("");
              }}
            />
          ) : isMfaStep ? (
            <OtpVerificationPage
              email={mfaEmail || email}
              otpLength={6}
              onSuccess={handleSignInSuccess}
              onBack={() => setIsMfaStep(false)}
            />
          ) : (
            <SignIn
              key={`${email}-${password}`}
              initialEmail={email}
              initialPassword={password}
              onMfaRequired={handleMfaRequired}
              onSuccess={handleSignInSuccess}
              onForgotPassword={() => setIsForgotPasswordOpen(true)}
            />
          )}
        </div>

        {/* Footer info */}
        <footer className="w-full max-w-md mx-auto pt-6 text-center">
          <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400">
            <button
              type="button"
              onClick={() => navigate("/super-admin/dashboard")}
              className="hover:text-stone-700 underline cursor-pointer"
            >
              Preview Super-Admin
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="hover:text-stone-700 underline cursor-pointer"
            >
              Preview Admin (Manager)
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}

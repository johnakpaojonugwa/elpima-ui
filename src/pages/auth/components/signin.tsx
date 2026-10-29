import React, { useState } from "react";
import { TextBox, PasswordInput, Button } from "@/components/app";
import { useAuthStore } from "@/store";

interface SignInProps {
  setIsSigningIn?: (isSigningInValue: boolean) => void;
  onMfaRequired?: (email: string) => void;
  onSuccess: () => void;
  onForgotPassword: () => void;
  initialEmail?: string;
  initialPassword?: string;
}

function SignIn({
  setIsSigningIn,
  onMfaRequired,
  onSuccess,
  onForgotPassword,
  initialEmail = "",
  initialPassword = "",
}: SignInProps) {
  const login = useAuthStore((authState) => authState.login);
  const isLoading = useAuthStore((authState) => authState.isLoading);

  const [signInEmail, setSignInEmail] = useState(initialEmail);
  const [signInPassword, setSignInPassword] = useState(initialPassword);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignInSubmit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = signInEmail.trim();
    if (!trimmedEmail) {
      setErrorMessage("Email address is required.");
      return;
    }

    if (!signInPassword) {
      setErrorMessage("Password is required.");
      return;
    }

    setIsSigningIn?.(true);

    try {
      const response = await login({
        email: trimmedEmail,
        password: signInPassword,
      });

      if ("requires2FA" in response && response.requires2FA === true) {
        onMfaRequired?.(trimmedEmail);
        return;
      }

      const currentAuthState = useAuthStore.getState();

      if (
        !currentAuthState.isAuthenticated ||
        !(currentAuthState.accessToken || currentAuthState.access_token)
      ) {
        setErrorMessage("We could not complete your sign-in. Please try again.");
        return;
      }

      onSuccess();
    } catch (signInError: any) {
      const errorData = signInError?.response?.data;
      const extractedErrorMessage =
        signInError?.normalizedMessage ||
        errorData?.error?.message ||
        errorData?.message ||
        errorData?.msg ||
        signInError?.message ||
        "Sign in failed. Please check your credentials.";

      setErrorMessage(extractedErrorMessage);
    } finally {
      setIsSigningIn?.(false);
    }
  };

  return (
    <form onSubmit={handleSignInSubmit} className="space-y-4" noValidate>
      <div className="text-left mb-4">
        <h2 className="text-lg font-bold text-stone-900">
          Welcome Back to Elpima Surgicals
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Sign in with your Super-Admin or Supervising Manager credentials to
          manage clinical equipment inventory and hospital RFQ quotes.
        </p>
      </div>

      <TextBox
        label="EMAIL"
        id="signin-email"
        type="email"
        placeholder="admin@elpimasurgicals.com"
        value={signInEmail}
        onChange={(changeEvent) => {
          setSignInEmail(changeEvent.target.value);
          if (errorMessage) setErrorMessage(null);
        }}
        required
      />

      <PasswordInput
        label="PASSWORD"
        id="signin-password"
        placeholder="Enter your password"
        value={signInPassword}
        onChange={(changeEvent) => {
          setSignInPassword(changeEvent.target.value);
          if (errorMessage) setErrorMessage(null);
        }}
        showStrengthMeter={false}
        required
        error={errorMessage ?? undefined}
      />

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-[11px] text-stone-400">
          Protected by 2FA & JWT rotation
        </span>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-stone-500 hover:text-stone-900 underline font-medium cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full text-base font-bold shadow-sm hover:shadow-md py-3.5 bg-[#2D7A58] hover:bg-[#256649]"
        >
          Sign In
        </Button>
      </div>

      <div className="text-center pt-3">
        <p className="text-[11px] text-stone-400">
          Supervising Manager accounts are provisioned directly by a Super-Admin.
        </p>
      </div>
    </form>
  );
}

export default SignIn;

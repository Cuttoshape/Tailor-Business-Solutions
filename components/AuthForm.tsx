import { useMemo, useState } from "react";
import apiClient from "@/lib/api";

type Mode = "login" | "register" | "forgot";

export default function AuthFormModal({
  setShowAuthForm,
}: {
  setShowAuthForm: (v: boolean) => void;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMsg, setSubmissionMsg] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
    name?: string;
  }>({});

  const resetForm = (nextMode: Mode) => {
    setMode(nextMode);
    setErrors({});
    setSubmissionMsg(null);
    if (nextMode !== "register") setConfirm("");
    if (nextMode === "forgot") {
      setPassword("");
      setConfirm("");
    }
  };

  const headline = useMemo(() => {
    if (mode === "login") return "Log in";
    if (mode === "register") return "Create an account";
    return "Reset your password";
  }, [mode]);

  const helper = useMemo(() => {
    if (mode === "login") {
      return (
        <>
          Not registered?{" "}
          <button
            type="button"
            className="font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
            onClick={() => resetForm("register")}
          >
            Create a new account
          </button>
          .
        </>
      );
    }
    if (mode === "register") {
      return (
        <>
          Already have an account?{" "}
          <button
            type="button"
            className="font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
            onClick={() => resetForm("login")}
          >
            Log in instead
          </button>
          .
        </>
      );
    }
    // forgot
    return (
      <>
        Enter your email and we’ll send you a link to reset your password.{" "}
        <button
          type="button"
          className="font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
          onClick={() => resetForm("login")}
        >
          Remember it? Log in
        </button>
        .
      </>
    );
  }, [mode]);

  const validate = () => {
    const next: typeof errors = {};
    if (!email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email.";

    if (mode === "login" || mode === "register") {
      if (!password) next.password = "Password is required.";
      else if (password.length < 6)
        next.password = "Use at least 6 characters.";
    }

    if (mode === "register") {
      if (!confirm) next.confirm = "Please confirm your password.";
      else if (confirm !== password) next.confirm = "Passwords do not match.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionMsg(null);

    try {
      if (mode === "login") {
        // TODO: call your login API
        console.log({ action: "login", email, password });
        const response = (await apiClient.auth.login({ email, password })) as {
          token: string;
          user: any;
        };
        apiClient.setToken(response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        if (response.user) setShowAuthForm(false);
      } else if (mode === "register") {
        // TODO: call your register API
        console.log({ action: "register", email, password });
        const response = (await apiClient.auth.register({
          name,
          email,
          password,
        })) as {
          token: string;
          user: any;
        };
        apiClient.setToken(response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        if (response.user) setShowAuthForm(false);
      } else {
        // Forgot password: email only
        // TODO: call your forgot-password API
        console.log({ action: "forgot", email });
        setSubmissionMsg(
          "If an account exists for that email, we’ve sent a password reset link."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed mb-20 inset-0 z-50 flex items-end bg-black/50 md:items-center md:justify-center">
      <div className="w-full max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl md:max-w-md md:rounded-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{headline}</h3>
          <button
            onClick={() => setShowAuthForm(false)}
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
            aria-label="Close"
            type="button"
          >
            <i className="ri-close-line text-xl text-gray-600" />
          </button>
        </div>

        {/* Tabs (hide in forgot mode) */}
        {mode !== "forgot" && (
          <div className="mb-5 grid grid-cols-2 rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => resetForm("login")}
              className={`py-2 text-sm font-medium rounded-md transition ${
                mode === "login"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              aria-pressed={mode === "login"}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => resetForm("register")}
              className={`py-2 text-sm font-medium rounded-md transition ${
                mode === "register"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              aria-pressed={mode === "register"}
            >
              Register
            </button>
          </div>
        )}

        {/* Helper text */}
        <p className="mb-4 text-sm text-gray-600">{helper}</p>

        {/* Status message (forgot success note) */}
        {submissionMsg && (
          <div
            className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
            role="status"
            aria-live="polite"
          >
            {submissionMsg}
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">
          {/* Name for registration */}
          {mode === "register" && (
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                autoFocus
                className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                  errors.name
                    ? "border-red-400"
                    : "border-gray-300 focus:border-indigo-500"
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email - shown in all modes */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.email
                  ? "border-red-400"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password + Confirm — hidden in forgot mode */}
          {mode !== "forgot" && (
            <>
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    className={`w-full rounded-lg border bg-white px-3 py-2 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                      errors.password
                        ? "border-red-400"
                        : "border-gray-300 focus:border-indigo-500"
                    }`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    <i
                      className={`${
                        showPassword ? "ri-eye-off-line" : "ri-eye-line"
                      } text-xl`}
                    />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password (Register only) */}
              {mode === "register" && (
                <div>
                  <label
                    htmlFor="confirm"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                      errors.confirm
                        ? "border-red-400"
                        : "border-gray-300 focus:border-indigo-500"
                    }`}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  {errors.confirm && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirm}
                    </p>
                  )}
                </div>
              )}

              {/* Forgot link (Login only) */}
              {mode === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    onClick={() => resetForm("forgot")}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="mt-1 flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAuthForm(false)}
              className="flex-1 rounded-lg border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Please wait…"
                : mode === "login"
                ? "Log in"
                : mode === "register"
                ? "Create account"
                : "Send reset link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { API_BASE_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const signUpHandler = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!username || !password) {
      setErrorMsg("Please provide both username and password");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/sign-up`, {
        username,
        password,
      });
      setSuccessMsg("Account created successfully! Please sign in.");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.msg || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const signInHandler = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!username || !password) {
      setErrorMsg("Please provide both username and password");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/sign-in`, {
        username,
        password,
      });
      setUsername("");
      setPassword("");
      localStorage.setItem("token", response.data.token);
      navigate(`/todo/${response.data.userId}`);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.msg || "Failed to sign in. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1DE] flex flex-col items-center justify-center p-4">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B0BA99] rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/90 border border-[#B0BA99] backdrop-blur-md rounded-2xl p-8 shadow-xl shadow-[#9D6638]/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#B0BA99]/40 text-[#4E220F] mb-3 border border-[#B0BA99]">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#4E220F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#4E220F] tracking-tight">Daily Task Manager</h1>
          <p className="text-[#4E220F]/70 text-sm mt-1">Sign in to your account or create a new one</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            {successMsg}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4E220F] mb-1.5">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1DE]/60 border border-[#B0BA99] text-[#4E220F] placeholder-[#4E220F]/40 focus:outline-none focus:ring-2 focus:ring-[#9D6638] focus:border-[#9D6638] transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4E220F] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1DE]/60 border border-[#B0BA99] text-[#4E220F] placeholder-[#4E220F]/40 focus:outline-none focus:ring-2 focus:ring-[#9D6638] focus:border-[#9D6638] transition-all duration-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E220F]/60 hover:text-[#4E220F] transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 016.123 1.933c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.09 4.09a3 3 0 11-4.243-4.243" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={signInHandler}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-white bg-[#9D6638] hover:bg-[#87552c] active:bg-[#724522] focus:outline-none focus:ring-2 focus:ring-[#9D6638]/50 shadow-md shadow-[#9D6638]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Sign In"}
            </button>

            <button
              onClick={signUpHandler}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-[#4E220F] bg-[#B0BA99] hover:bg-[#a0ab88] active:bg-[#919c79] border border-[#9D6638]/20 focus:outline-none focus:ring-2 focus:ring-[#B0BA99]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { loginApi, registerApi, logoutApi } from "../services/auth.service";
import type { AuthUser } from "../services/auth.service";

type AuthContextType = {
  user: AuthUser | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = async (data: { email: string; password: string }) => {
    try {
      // Validation
      if (!data.email || !data.password) {
        toast.error("Email and password are required");
        throw new Error("Email and password are required");
      }

      if (!data.email.includes("@")) {
        toast.error("Please enter a valid email address");
        throw new Error("Invalid email format");
      }

      if (data.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        throw new Error("Password too short");
      }

      const res = await loginApi(data);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Login successful!");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Login failed";
      toast.error(errorMessage);
      throw err;
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      // Validation
      if (!data.name || !data.email || !data.password) {
        toast.error("All fields are required");
        throw new Error("All fields are required");
      }

      if (data.name.trim().length < 2) {
        toast.error("Name must be at least 2 characters");
        throw new Error("Name too short");
      }

      if (!data.email.includes("@")) {
        toast.error("Please enter a valid email address");
        throw new Error("Invalid email format");
      }

      if (data.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        throw new Error("Password too short");
      }

      const res = await registerApi(data);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Registration successful!");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Registration failed";
      toast.error(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    } catch (err: any) {
      // Even if API call fails, clear local state
      setUser(null);
      localStorage.removeItem("user");
      toast.error("Error during logout, but you have been logged out locally");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

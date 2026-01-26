import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const savedUser = localStorage.getItem("authUser");
      if (savedUser) {
        set({ authUser: JSON.parse(savedUser) });
      }

      const res = await axiosInstance.get("/auth/check");
      console.log("CHECK AUTH RESPONSE:", res.data);
      const cachedUser = savedUser ? JSON.parse(savedUser) : null;
      const mergedUser = {
        ...res.data,
        profilePic: res.data.profilePic || cachedUser?.profilePic || "",
      };

      set({ authUser: mergedUser });
      localStorage.setItem("authUser", JSON.stringify(mergedUser));
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (err) {
      console.log(
        "CHECK AUTH ERROR:",
        err?.response?.status,
        err?.response?.data,
      );
      const savedUser = localStorage.getItem("authUser");
      if (savedUser) {
        console.log("API failed but using cached user");
        set({ authUser: JSON.parse(savedUser) });
      } else {
        set({ authUser: null });
        localStorage.removeItem("authUser");
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    } finally {
      console.log("CHECK AUTH END");
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      localStorage.setItem("authUser", JSON.stringify(res.data));
      toast.success("Account Created Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      localStorage.setItem("authUser", JSON.stringify(res.data));
      toast.success("Logged In Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("authUser");
      toast.success("Logged Out Successfully");
    } catch (error) {
      console.log("Error Logging Out");
      console.log("Logout Error:", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      localStorage.setItem("authUser", JSON.stringify(res.data));
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

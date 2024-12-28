import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AboutPage from "./pages/AboutPage";
import SignupPage from "./pages/SignupPage";
import SignInPage from "./pages/SignInPage";
import SettingsPage from "./pages/SettingsPage";
import UserProfilePage from "./pages/UserProfilePage";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import {Loader} from 'lucide-react'
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useTheme.js";

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(()=>  {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }
  return (
    <div data-theme= {theme}>
      <Navbar/>

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to='/signup'/>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signUp" element={!authUser ? <SignupPage /> : <Navigate to= '/'/>} />
        <Route path="/signin" element={!authUser ? <SignInPage /> : <Navigate to='/'/>} />
        <Route path="/settings" element={ authUser ? <SettingsPage /> : <Navigate to='/signin'/>} />
        <Route path="/profile" element={authUser ? <UserProfilePage /> : <Navigate to='/signin'/>} />
      </Routes>

      <Toaster/>
    </div>
  )
}
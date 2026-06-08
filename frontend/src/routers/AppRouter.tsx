import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import OAuthCallback from "../pages/OAuthCallback";
import Destinations from "../pages/Destinations";
import DestinationDetail from "../pages/DestinationDetail";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ItineraryBuilder from "../pages/ItineraryBuilder";
import MyItineraries from "../pages/MyItineraries";
import StayDetail from "../pages/StayDetail";

const RequireAuth = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border border-[#C9922A]/20 rotate-45" />
            <div
              className="absolute inset-1 border border-[#C9922A]/40 rotate-12 animate-spin"
              style={{ animationDuration: "2s" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#C9922A]" />
            </div>
          </div>
          <p className="text-[#C9922A] text-[10px] tracking-[0.35em] uppercase font-light animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.some((role) => user?.roles?.includes(role))) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <p
            className="text-[#1a3a5c] font-light"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "2rem",
              fontStyle: "italic",
            }}
          >
            Access Denied
          </p>
          <p className="text-gray-400 text-sm mt-2 font-light">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/destinations"
          element={
            <RequireAuth>
              <Destinations />
            </RequireAuth>
          }
        />
        <Route
          path="/destination/:slug"
          element={
            <RequireAuth>
              <DestinationDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <UserDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/itinerary-builder/:id"
          element={
            <RequireAuth>
              <ItineraryBuilder />
            </RequireAuth>
          }
        />
        <Route
          path="/my-itineraries"
          element={
            <RequireAuth>
              <MyItineraries />
            </RequireAuth>
          }
        />
        <Route
          path="/itinerary/:id"
          element={
            <RequireAuth>
              <ItineraryBuilder />
            </RequireAuth>
          }
        />
        <Route
          path="/stay/:slug"
          element={
            <RequireAuth>
              <StayDetail />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

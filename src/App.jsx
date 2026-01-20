import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import AmbientSound from './components/AmbientSound';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ChatSupport from './pages/ChatSupport';
import Booking from './pages/Booking';
import Resources from './pages/Resources';
import PeerForum from './pages/PeerForum';
import AdminDashboard from './pages/AdminDashboard';
import CrisisSupport from './pages/CrisisSupport';
import Screening from './pages/Screening';
import RoleSelection from './pages/RoleSelection';

import CounselorDashboard from './pages/CounselorDashboard';
import StudentDirectory from './pages/StudentDirectory';


import { SoundProvider } from './context/SoundContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SoundProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/select-role" element={<RoleSelection />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/login" element={<Navigate to="/select-role" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/crisis" element={<CrisisSupport />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<ChatSupport />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/forum" element={<PeerForum />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/counselor" element={<CounselorDashboard />} />
                <Route path="/students" element={<StudentDirectory />} />
                <Route path="/screening" element={<Screening />} />

              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <AmbientSound />
          <Toaster
            position="bottom-center"
            toastOptions={{
              className: 'font-sans bg-white/80 text-gray-800 border border-black/5 backdrop-blur-xl rounded-[1.5rem] shadow-glass-light py-4 px-6 text-sm font-medium',
              duration: 4000,
              success: {
                iconTheme: { primary: '#6FCDB1', secondary: '#fff' }
              },
              error: {
                iconTheme: { primary: '#B97373', secondary: '#fff' }
              }
            }}
          />
        </SoundProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

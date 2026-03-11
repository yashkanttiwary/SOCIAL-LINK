import React from 'react';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { CommandCenter } from './pages/CommandCenter';
import { Research } from './pages/Research';
import { Canvas } from './pages/Canvas';
import { Planner } from './pages/Planner';
import { RuleBook } from './pages/RuleBook';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { useAuthStore } from './store/authStore';

function Protected({ children }: { children: React.ReactElement }) {
  const { isConfigured } = useAuthStore();
  if (!isConfigured) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><DashboardLayout /></Protected>}>
          <Route index element={<CommandCenter />} />
          <Route path="research" element={<Research />} />
          <Route path="canvas" element={<Canvas />} />
          <Route path="planner" element={<Planner />} />
          <Route path="rulebook" element={<RuleBook />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

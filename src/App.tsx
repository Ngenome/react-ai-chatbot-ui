import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/chat/new" replace />} />
            <Route path="/chat/:chatId" element={<Chat />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </Router>
  );
};

export default App;

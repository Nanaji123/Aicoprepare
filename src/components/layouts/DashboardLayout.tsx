import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { LayoutDashboard, History, Settings, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface DashboardLayoutProps {
  session: Session;
}

export default function DashboardLayout({ session }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/interviews/history`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="brand-icon">◈</span>
          <span className="brand-name">CoPrep<em>AI</em></span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <LayoutDashboard size={18} />
            Overview
          </NavLink>
          
          <NavLink
            to="/dashboard/sessions"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <History size={18} />
            Past Sessions
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{session.user.email?.charAt(0).toUpperCase()}</div>
            <div className="email" title={session.user.email}>
              {session.user.email}
            </div>
          </div>
          <button className="btn-ghost sidebar-logout" onClick={handleSignOut}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="layout-main">
        <Outlet context={{ session, history, loadingHistory, refreshHistory: fetchHistory }} />
      </main>
    </div>
  );
}

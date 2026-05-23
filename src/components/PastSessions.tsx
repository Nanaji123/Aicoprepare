import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Calendar, Clock, Briefcase, ChevronRight } from "lucide-react";
import SessionDetail from "./SessionDetail";

export default function PastSessions() {
  const { session, history, loadingHistory } = useOutletContext<{ session: Session, history: any[], loadingHistory: boolean }>();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  return (
    <div className="dashboard-content relative-container">
      <div className="dashboard-header" style={{ marginBottom: "2rem" }}>
        <div>
          <h1 className="section-h2" style={{ marginBottom: "0.5rem", marginTop: 0 }}>Past Sessions</h1>
          <p className="hero-sub" style={{ fontSize: "0.95rem" }}>Review your performance and detailed AI feedback.</p>
        </div>
      </div>

      {loadingHistory ? (
        <div className="loading-state">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <div className="feat-icon">🎙️</div>
          <h3>No interviews yet</h3>
          <p>Ready to nail your next interview? Launch CoPrep from the Overview tab.</p>
        </div>
      ) : (
        <div className="session-list-container">
          {history.map((item) => {
            const startedAt = new Date(item.started_at);
            const endedAt = item.ended_at ? new Date(item.ended_at) : null;
            const durationMins = endedAt
              ? Math.round((endedAt.getTime() - startedAt.getTime()) / 60000)
              : 0;

            const isCompleted = item.status === "completed";

            return (
              <div
                key={item.id}
                className="session-list-item"
                onClick={() => setSelectedSessionId(item.id)}
              >
                <div className="session-list-main">
                  <div className="session-list-title">
                    {item.config?.job_title || "General Interview"}
                    <span className={`session-status ${isCompleted ? 'status-completed' : 'status-active'}`}>
                      <span className="status-dot"></span>
                      {item.status}
                    </span>
                  </div>
                  <div className="session-list-meta">
                    <span className="meta-item">
                      <Briefcase size={14} />
                      {item.config?.interview_type || "Technical"}
                    </span>
                    <span className="meta-item">
                      <Calendar size={14} />
                      {startedAt.toLocaleDateString()}
                    </span>
                    {endedAt && (
                      <span className="meta-item">
                        <Clock size={14} />
                        {durationMins} min
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <ChevronRight size={24} color="var(--txt-muted)" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Overlay for Session Detail */}
      {selectedSessionId && (
        <div className="overlay session-detail-overlay" onClick={() => setSelectedSessionId(null)}>
          <div className="session-modal" onClick={(e) => e.stopPropagation()}>
            <SessionDetail
              session={session}
              sessionId={selectedSessionId}
              onClose={() => setSelectedSessionId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

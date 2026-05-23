import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";

export default function SessionDetail({ session, sessionId, onClose }: { session: Session; sessionId: string; onClose: () => void }) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) fetchSessionDetails();
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/interviews/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDetails(data);
      }
    } catch (err) {
      console.error("Failed to fetch session details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading session details...</div>;
  }

  if (!details) {
    return <div className="error-state">Failed to load session details.</div>;
  }

  const { session: interviewSession, transcripts, answers } = details;
  const startedAt = new Date(interviewSession.started_at);
  const endedAt = interviewSession.ended_at ? new Date(interviewSession.ended_at) : null;
  const durationMins = endedAt
    ? Math.round((endedAt.getTime() - startedAt.getTime()) / 60000)
    : 0;

  // Weave transcripts and answers into a single timeline by timestamp
  const timeline = [...transcripts, ...answers].sort((a, b) => {
    const timeA = new Date(a.timestamp || a.created_at).getTime();
    const timeB = new Date(b.timestamp || b.created_at).getTime();
    return timeA - timeB; // Ascending (Oldest first for chronological chat reading)
  });

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="session-detail-modal">
      <div className="modal-header-sticky">
        <div className="detail-header">
          <div>
            <h1 className="section-h2" style={{ marginBottom: "0.5rem", marginTop: 0 }}>
              {interviewSession.config?.job_title || "General Interview"}
            </h1>
            <div className="card-meta">
              <span>{startedAt.toLocaleDateString()}</span>
              <span>•</span>
              <span>{interviewSession.config?.interview_type || "Technical"}</span>
              <span>•</span>
              {endedAt ? <span>{durationMins} min session</span> : <span className="status-badge active"><span className="status-dot" style={{width: 6, height: 6, background: '#ef4444', borderRadius: '50%', display: 'inline-block'}}></span>Active</span>}
            </div>
          </div>
          <button className="modal-x" onClick={onClose} style={{ position: "relative", top: 0, right: 0 }}>✕</button>
        </div>
      </div>

      <div className="timeline modal-timeline">
        {timeline.length === 0 ? (
          <div className="empty-state">
            <p>No activity recorded in this session.</p>
          </div>
        ) : (
          <div className="chat-timeline">
            {timeline.map((item, i) => {
              const isAnswer = "answer" in item;
              const timeStr = formatTime(item.timestamp || item.created_at);

              if (isAnswer) {
                return (
                  <div key={`ans-${item.id || i}`} className="chat-bubble-wrapper">
                    <div className="chat-bubble ai-copilot">
                      <div className="chat-bubble-header">
                        <span style={{ color: "var(--accent)" }}>◈ AI Copilot</span>
                        <span className="chat-timestamp">{timeStr}</span>
                      </div>
                      
                      {item.question && item.question.trim() !== "" && (
                        <div className="ai-q-block">
                          <span className="ai-q-label">Generated for Question</span>
                          <div className="ai-q-text">{item.question}</div>
                        </div>
                      )}
                      
                      <div className="ai-a-block">
                        {item.answer ? (
                          <ReactMarkdown>{item.answer}</ReactMarkdown>
                        ) : (
                          <p style={{ fontStyle: "italic", opacity: 0.7 }}>No answer generated.</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              } else {
                const isUser = item.speaker === 'user';
                return (
                  <div key={`ts-${item.id || i}`} className={`chat-bubble-wrapper ${isUser ? 'right' : 'left'}`}>
                    <div className={`chat-bubble ${isUser ? 'user' : 'interviewer'}`}>
                      <div className="chat-bubble-header">
                        <span>{isUser ? 'You' : 'Interviewer'}</span>
                        <span className="chat-timestamp">{timeStr}</span>
                      </div>
                      <div style={{ color: "var(--txt)" }}>{item.text}</div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Clock, Activity, Target } from "lucide-react";

export default function Overview() {
  const { session, history, loadingHistory } = useOutletContext<{ session: Session, history: any[], loadingHistory: boolean }>();

  // Settings form states for starting a new interview
  const [jobTitleSelect, setJobTitleSelect] = useState("Software Engineer");
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [interviewType, setInterviewType] = useState("Technical");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level");

  const startSessionWithSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const finalJobTitle = jobTitleSelect === "Custom Role..." ? customJobTitle : jobTitleSelect;

    const sessionMetadata = {
      job_title: finalJobTitle || "General Interview",
      interview_type: interviewType,
      experience_level: experienceLevel,
    };
    const deepLink = `coprep://start?token=${encodeURIComponent(
      session.access_token
    )}&userId=${encodeURIComponent(session.user.id)}&session=${encodeURIComponent(
      JSON.stringify(sessionMetadata)
    )}`;
    window.location.href = deepLink;
  };

  // Calculate stats
  const totalInterviews = history.length;
  const totalMinutes = history.reduce((acc, item) => {
    if (!item.ended_at) return acc;
    const startedAt = new Date(item.started_at).getTime();
    const endedAt = new Date(item.ended_at).getTime();
    return acc + Math.round((endedAt - startedAt) / 60000);
  }, 0);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1 className="section-h2" style={{ marginBottom: "0.5rem", marginTop: 0 }}>Overview</h1>
          <p className="hero-sub" style={{ fontSize: "0.95rem" }}>
            Start a new session or review your high-level statistics.
          </p>
        </div>
      </div>

      <div className="overview-layout">
        {/* Left Column: Launch Form */}
        <div className="launch-card feat-card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <div className="modal-icon" style={{ margin: 0, width: "40px", height: "40px", fontSize: "1.2rem" }}>⚙</div>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Session Setup</h2>
          </div>
          <p style={{ color: "var(--txt-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            Configure your target role and experience level before launching the AI Copilot.
          </p>

          <form onSubmit={startSessionWithSettings} className="setup-form">
            <div className="form-group">
              <label>Target Role</label>
              <select
                value={jobTitleSelect}
                onChange={(e) => setJobTitleSelect(e.target.value)}
                style={{ marginBottom: jobTitleSelect === "Custom Role..." ? "0.5rem" : "0" }}
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Mobile Developer">Mobile Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Engineering Manager">Engineering Manager</option>
                <option value="Custom Role...">Custom Role...</option>
              </select>

              {jobTitleSelect === "Custom Role..." && (
                <input
                  type="text"
                  value={customJobTitle}
                  onChange={(e) => setCustomJobTitle(e.target.value)}
                  required
                  placeholder="Type your custom role..."
                  autoFocus
                />
              )}
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Interview Type</label>
                <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                  <option>Technical / Coding</option>
                  <option>System Design</option>
                  <option>Behavioral</option>
                  <option>Algorithm & Data Structures</option>
                  <option>Architecture</option>
                  <option>Managerial</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Experience Level</label>
                <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                  <option>Intern / New Grad</option>
                  <option>Entry-level (1-2 years)</option>
                  <option>Mid-level (3-5 years)</option>
                  <option>Senior (5-8 years)</option>
                  <option>Staff / Principal (8+ years)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-block" style={{ marginTop: "1rem" }}>
              Launch CoPrep Desktop →
            </button>
          </form>
        </div>

        {/* Right Column: Stats Grid */}
        <div className="stats-column">
          <div className="stat-card feat-card">
            <div className="stat-header">
              <Target size={20} color="var(--accent)" />
              <span className="stat-title">Total Sessions</span>
            </div>
            <div className="stat-value">{loadingHistory ? "-" : totalInterviews}</div>
          </div>

          <div className="stat-card feat-card">
            <div className="stat-header">
              <Clock size={20} color="var(--accent)" />
              <span className="stat-title">Time Practiced</span>
            </div>
            <div className="stat-value">{loadingHistory ? "-" : `${totalMinutes} min`}</div>
          </div>

          <div className="stat-card feat-card">
            <div className="stat-header">
              <Activity size={20} color="var(--accent)" />
              <span className="stat-title">Last Session</span>
            </div>
            <div className="stat-value stat-value-sm">
              {loadingHistory
                ? "-"
                : history.length > 0
                  ? new Date(history[0].started_at).toLocaleDateString()
                  : "None"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000/api";

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingLLM, setLoadingLLM] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    status: "",
    search: "",
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "low",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/tickets/?${query}`);
    const data = await res.json();
    setTickets(data);
  };

  const fetchStats = async () => {
    const res = await fetch(`${API_BASE}/tickets/stats/`);
    const data = await res.json();
    setStats(data);
  };

  const handleDescriptionBlur = async () => {
    if (!form.description) return;

    setLoadingLLM(true);

    const res = await fetch(`${API_BASE}/tickets/classify/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: form.description }),
    });

    const data = await res.json();
    setLoadingLLM(false);

    if (data.suggested_category && data.suggested_priority) {
      setForm({
        ...form,
        category: data.suggested_category,
        priority: data.suggested_priority,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE}/tickets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        status: "open",
      }),
    });

    setForm({
      title: "",
      description: "",
      category: "general",
      priority: "low",
    });

    fetchTickets();
    fetchStats();
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API_BASE}/tickets/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchTickets();
    fetchStats();
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "auto" }}>
      
      <h1 style={{ textAlign: "center" }}>Support Ticket System</h1>

      {/* Create Ticket */}
      <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8, marginBottom: 30 }}>
        <h2>Create Ticket</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
            placeholder="Title"
            value={form.title}
            required
            maxLength={200}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
            placeholder="Description"
            value={form.description}
            required
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            onBlur={handleDescriptionBlur}
          />

          {loadingLLM && (
            <p style={{ color: "blue" }}>Analyzing with AI...</p>
          )}

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="general">General</option>
            </select>

            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      </div>

      {/* Stats */}
      <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8, marginBottom: 30 }}>
        <h2>Stats</h2>
        <p><strong>Total Tickets:</strong> {stats.total_tickets || 0}</p>
        <p><strong>Open Tickets:</strong> {stats.open_tickets || 0}</p>
        <p><strong>Avg per Day:</strong> {stats.avg_tickets_per_day || 0}</p>
      </div>

      {/* Filters */}
      <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8, marginBottom: 30 }}>
        <h3>Filters</h3>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
            <option value="account">Account</option>
            <option value="general">General</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets */}
      <h2>Tickets</h2>

      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            borderRadius: 6,
            marginBottom: 15,
          }}
        >
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>

          <select
            value={ticket.status}
            onChange={(e) => updateStatus(ticket.id, e.target.value)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default App;

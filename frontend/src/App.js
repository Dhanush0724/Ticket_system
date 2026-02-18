import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000/api";

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingLLM, setLoadingLLM] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "low",
  });

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    const res = await fetch(`${API_BASE}/tickets/`);
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
    <div style={{ padding: 20 }}>
      <h1>Support Ticket System</h1>

      <h2>Create Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          required
          maxLength={200}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <br /><br />

        <textarea
          placeholder="Description"
          value={form.description}
          required
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          onBlur={handleDescriptionBlur}
        />
        <br />
        {loadingLLM && <p>Analyzing with AI...</p>}
        <br />

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

        <br /><br />
        <button type="submit">Submit</button>
      </form>

      <hr />

      <h2>Stats</h2>
      <pre>{JSON.stringify(stats, null, 2)}</pre>

      <hr />

      <h2>Tickets</h2>
      {tickets.map((ticket) => (
        <div key={ticket.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>
          <p>Category: {ticket.category}</p>
          <p>Priority: {ticket.priority}</p>
          <p>Status: {ticket.status}</p>

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

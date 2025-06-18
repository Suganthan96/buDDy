import React, { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    event: {
      name: "",
      location: "",
      type: "",
    },
    user: {
      name: "",
      role: "",
      skills: "",
      goals: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleChange = (e, group) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");

    // Convert comma-separated strings into arrays
    const payload = {
      ...form,
      user: {
        ...form.user,
        skills: form.user.skills.split(",").map((s) => s.trim()),
        goals: form.user.goals.split(",").map((g) => g.trim()),
      },
    };

    try {
      const res = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data.output || "No response.");
    } catch (err) {
      setResponse("⚠️ Error contacting backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">🎤 Event Buddy – MCP GPT Generator</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Event Info</h2>
          <input className="input" placeholder="Name" name="name" onChange={(e) => handleChange(e, "event")} />
          <input className="input" placeholder="Location" name="location" onChange={(e) => handleChange(e, "event")} />
          <input className="input" placeholder="Type (e.g. Hackathon)" name="type" onChange={(e) => handleChange(e, "event")} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Your Info</h2>
          <input className="input" placeholder="Name" name="name" onChange={(e) => handleChange(e, "user")} />
          <input className="input" placeholder="Role (e.g. Frontend Dev)" name="role" onChange={(e) => handleChange(e, "user")} />
          <input className="input" placeholder="Skills (comma separated)" name="skills" onChange={(e) => handleChange(e, "user")} />
          <input className="input" placeholder="Goals (comma separated)" name="goals" onChange={(e) => handleChange(e, "user")} />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate MCP Intro"}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h3 className="font-semibold text-lg mb-2">🧠 GPT Response:</h3>
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
}

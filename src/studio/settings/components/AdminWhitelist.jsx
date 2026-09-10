'use client';

import { useState, useEffect } from 'react';
import { Trash2, UserPlus } from 'lucide-react';

export default function AdminWhitelist() {
  const [admins, setAdmins] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/studio/admins');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    if (!newEmail) return;
    setError('');

    try {
      const res = await fetch('/api/studio/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail })
      });

      const data = await res.json();

      if (res.ok) {
        setAdmins([data.email, ...admins]);
        setNewEmail('');
      } else {
        setError(data.error || 'Failed to add admin');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const removeAdmin = async (email) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;

    try {
      const res = await fetch(`/api/studio/admins?email=${encodeURIComponent(email)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setAdmins(admins.filter(a => a !== email));
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to remove admin');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <section>
      <h2 className="text-xl font-serif text-brand font-semibold mb-6">Admin Access (Whitelist)</h2>

      <div className="space-y-6">
        <form onSubmit={addAdmin} className="flex gap-3">
          <div className="flex-1">
            <input
              type="email"
              placeholder="team@amalgamic.io"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-surface"
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-ink text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md hover:bg-opacity-90 transition-all shrink-0"
          >
            <UserPlus size={16} />
            Add Admin
          </button>
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="border border-border rounded-xl overflow-hidden bg-surface-sunken">
          {loading ? (
            <div className="p-4 text-sm text-muted text-center">Loading admins...</div>
          ) : admins.length === 0 ? (
            <div className="p-4 text-sm text-muted text-center">No admins added yet.</div>
          ) : (
            <ul className="divide-y divide-border/50">
              {admins.map((email) => (
                <li key={email} className="p-4 flex items-center justify-between hover:bg-surface transition-colors">
                  <span className="text-sm font-medium text-ink">{email}</span>
                  <button
                    onClick={() => removeAdmin(email)}
                    className="text-muted hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Remove admin"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </section>
  );
}

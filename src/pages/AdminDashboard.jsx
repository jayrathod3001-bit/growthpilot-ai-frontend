import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ── Helpers ──────────────────────────────────────────────────────────────────
const API = 'http://localhost:5000/api/admin';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const authHeaders = (token) => ({
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
});

const exportToCSV = (filename, rows) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) =>
        keys
          .map((k) => {
            let val = row[k] === null || row[k] === undefined ? '' : String(row[k]);
            val = val.replace(/"/g, '""');
            if (val.search(/("|,|\n)/g) >= 0) val = `"${val}"`;
            return val;
          })
          .join(separator)
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ── Mini Bar Chart (pure CSS/SVG) ─────────────────────────────────────────────
const BarChart = ({ data, color = '#6366f1', label = 'Count' }) => {
  if (!data || data.length === 0) return <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No data yet</p>;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>{d.count}</span>
          <div
            style={{
              width: '100%', borderRadius: '6px 6px 0 0', transition: 'height 0.6s ease',
              height: `${(d.count / max) * 80}px`,
              background: `linear-gradient(180deg, ${color}, ${color}88)`,
              boxShadow: `0 0 10px ${color}44`, minHeight: '4px'
            }}
          />
          <span style={{ fontSize: '0.6rem', color: '#64748b', textAlign: 'center', lineHeight: 1.2 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Donut Chart (SVG) ─────────────────────────────────────────────────────────
const DonutChart = ({ data, colors }) => {
  if (!data || data.length === 0) return <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No data yet</p>;
  const total = data.reduce((s, d) => s + d.count, 0);
  let cumulative = 0;
  const radius = 50, cx = 60, cy = 60, stroke = 18;
  const circumference = 2 * Math.PI * radius;
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        {data.map((d, i) => {
          const pct = d.count / total;
          const offset = circumference * (1 - cumulative);
          const dash = circumference * pct;
          cumulative += pct;
          return (
            <circle key={i} cx={cx} cy={cy} r={radius} fill="none"
              stroke={colors[i % colors.length]} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset} style={{ transition: 'all 0.5s ease' }}
              transform="rotate(-90 60 60)" />
          );
        })}
        <text x={cx} y={cy + 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">{total}</text>
      </svg>
      <div style={{ flex: 1, minWidth: '120px' }}>
        {data.slice(0, 6).map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: colors[i % colors.length], flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d._id || 'Other'}</span>
            <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 700 }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33`, borderRadius: '16px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: `radial-gradient(circle, ${color}22, transparent)`, borderRadius: '50%' }} />
    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{label}</div>
    {sub && <div style={{ fontSize: '0.72rem', color: color, marginTop: '0.25rem', fontWeight: 600 }}>{sub}</div>}
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', padding: '0.35rem 0.65rem', fontSize: '0.9rem' }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const inputSx = (hasErr) => ({
  width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.06)',
  border: `1px solid ${hasErr ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: '10px', color: '#fff', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
});
const labelSx = { display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' };

// ── Main Component ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [inquiryCounts, setInquiryCounts] = useState({ total: 0, pending: 0, replied: 0 });
  const [inquiryFilter, setInquiryFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [businessSearch, setBusinessSearch] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [loading, setLoading] = useState(true);

  // User Detail modal
  const [userDetail, setUserDetail] = useState(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);

  // Edit User modal
  const [editUser, setEditUser] = useState(null);
  const [editUserErrors, setEditUserErrors] = useState({});

  // Edit Business modal
  const [editBusiness, setEditBusiness] = useState(null);
  const [editBusinessErrors, setEditBusinessErrors] = useState({});

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState(null); // { type:'user'|'business'|'inquiry', id, name }

  // Confirm logout & edit
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(null); // { title, message, onConfirm }

  const [actionMsg, setActionMsg] = useState('');

  // ── Guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
  }, []);

  // ── Fetch All ──────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, usersRes, bizRes, inqRes] = await Promise.all([
        axios.get(`${API}/stats`, authHeaders(token)),
        axios.get(`${API}/users`, authHeaders(token)),
        axios.get(`${API}/businesses`, authHeaders(token)),
        axios.get(`${API}/inquiries`, authHeaders(token)).catch(() => ({ data: { status: 0 } })),
      ]);
      if (statsRes.data.status === 1) setStats(statsRes.data.data);
      if (usersRes.data.status === 1) setUsers(usersRes.data.data);
      if (bizRes.data.status === 1) setBusinesses(bizRes.data.data);
      if (inqRes?.data?.status === 1) {
        setInquiries(inqRes.data.data || []);
        setInquiryCounts(inqRes.data.counts || { total: 0, pending: 0, replied: 0 });
      }
    } catch (err) {
      if (err.response?.status === 403) { localStorage.removeItem('adminToken'); navigate('/admin'); }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const flash = (msg) => { setActionMsg(msg); setTimeout(() => setActionMsg(''), 3000); };

  // ── User Detail ────────────────────────────────────────────────────
  const openUserDetail = async (uid) => {
    try {
      const res = await axios.get(`${API}/users/${uid}`, authHeaders(token));
      if (res.data.status === 1) { setUserDetail(res.data.data); setUserDetailOpen(true); }
    } catch { }
  };

  // ── Delete ─────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === 'user') {
        await axios.delete(`${API}/users/${confirmDelete.id}`, authHeaders(token));
        flash('✅ User & their businesses deleted!');
      } else if (confirmDelete.type === 'business') {
        await axios.delete(`${API}/businesses/${confirmDelete.id}`, authHeaders(token));
        flash('✅ Business deleted!');
      } else if (confirmDelete.type === 'inquiry') {
        await axios.delete(`${API}/inquiries/${confirmDelete.id}`, authHeaders(token));
        flash('✅ Inquiry deleted!');
      }
      setConfirmDelete(null);
      fetchAll();
    } catch (err) { flash('❌ ' + (err.response?.data?.message || 'Delete failed')); }
  };

  // ── Send Inquiry Reply via Email ───────────────────────────────────
  const handleSendReply = async () => {
    if (!replyText || !replyText.trim()) {
      flash('❌ Reply message cannot be empty');
      return;
    }
    setSendingReply(true);
    try {
      const res = await axios.post(
        `${API}/inquiries/${selectedInquiry._id}/reply`,
        { replyMessage: replyText.trim() },
        authHeaders(token)
      );
      if (res.data.status === 1) {
        flash(`✅ Reply email sent successfully to ${selectedInquiry.email}!`);
        setSelectedInquiry(null);
        setReplyText('');
        fetchAll();
      } else {
        flash('❌ ' + (res.data.message || 'Failed to send reply'));
      }
    } catch (err) {
      flash('❌ ' + (err.response?.data?.message || err.message || 'Failed to send reply'));
    } finally {
      setSendingReply(false);
    }
  };

  // ── CSV Export Handlers ────────────────────────────────────────────
  const handleExportUsers = () => {
    if (!users.length) { flash('⚠️ No users to export'); return; }
    const data = users.map((u, i) => ({
      Index: i + 1,
      Name: u.name,
      Email: u.email,
      Businesses: u.businessCount || 0,
      Total_AI_Actions: u.usage?.total || 0,
      Chats: u.usage?.chats || 0,
      Marketing: u.usage?.marketing || 0,
      Content: u.usage?.content || 0,
      Images: u.usage?.images || 0,
      SEO: u.usage?.seo || 0,
      Joined_Date: new Date(u.createdAt).toLocaleDateString('en-IN'),
    }));
    exportToCSV(`growthpilot_users_${Date.now()}.csv`, data);
    flash('✅ Users exported to CSV!');
  };

  const handleExportBusinesses = () => {
    if (!businesses.length) { flash('⚠️ No businesses to export'); return; }
    const data = businesses.map((b, i) => ({
      Index: i + 1,
      Business_Name: b.businessName,
      Category: b.businessCategory,
      Owner_Name: b.userId?.name || '',
      Owner_Email: b.userId?.email || '',
      Phone: b.phone || '',
      Location: b.location || '',
      Goal: b.businessGoal || '',
      Created_Date: new Date(b.createdAt).toLocaleDateString('en-IN'),
    }));
    exportToCSV(`growthpilot_businesses_${Date.now()}.csv`, data);
    flash('✅ Businesses exported to CSV!');
  };

  const handleExportInquiries = () => {
    if (!inquiries.length) { flash('⚠️ No inquiries to export'); return; }
    const data = inquiries.map((inq, i) => ({
      Index: i + 1,
      Name: inq.name,
      Email: inq.email,
      Phone: inq.phone || '',
      Business: inq.businessName || '',
      Source: inq.source,
      Subject: inq.subject,
      Message: inq.message,
      Status: inq.status,
      Admin_Reply: inq.adminReply?.message || '',
      Replied_At: inq.adminReply?.repliedAt ? new Date(inq.adminReply.repliedAt).toLocaleString('en-IN') : '',
      Received_Date: new Date(inq.createdAt).toLocaleString('en-IN'),
    }));
    exportToCSV(`growthpilot_inquiries_${Date.now()}.csv`, data);
    flash('✅ Inquiries exported to CSV!');
  };

  // ── Save User Edit ─────────────────────────────────────────────────
  const executeSaveUser = async () => {
    try {
      const res = await axios.put(`${API}/users/${editUser._id}`, { name: editUser.name, email: editUser.email }, authHeaders(token));
      if (res.data.status === 1) { flash('✅ User updated!'); setEditUser(null); fetchAll(); }
    } catch (err) { flash('❌ ' + (err.response?.data?.message || 'Update failed')); }
  };

  const handleSaveUser = () => {
    const errs = {};
    if (!editUser.name?.trim()) errs.name = 'Name required';
    if (!editUser.email?.trim()) errs.email = 'Email required';
    if (Object.keys(errs).length > 0) { setEditUserErrors(errs); return; }
    setConfirmEdit({
      title: 'Update User Details',
      message: `Are you sure you want to save changes for user "${editUser.name}"?`,
      onConfirm: executeSaveUser,
    });
  };

  // ── Save Business Edit ─────────────────────────────────────────────
  const executeSaveBusiness = async () => {
    try {
      const res = await axios.put(`${API}/businesses/${editBusiness._id}`, editBusiness, authHeaders(token));
      if (res.data.status === 1) { flash('✅ Business updated!'); setEditBusiness(null); fetchAll(); }
    } catch (err) { flash('❌ ' + (err.response?.data?.message || 'Update failed')); }
  };

  const handleSaveBusiness = () => {
    const errs = {};
    if (!editBusiness.businessName?.trim()) errs.businessName = 'Business name required';
    if (Object.keys(errs).length > 0) { setEditBusinessErrors(errs); return; }
    setConfirmEdit({
      title: 'Update Business Details',
      message: `Are you sure you want to save changes for business "${editBusiness.businessName}"?`,
      onConfirm: executeSaveBusiness,
    });
  };

  // ── Chart Data Helpers ─────────────────────────────────────────────
  const buildMonthlyData = (raw) => {
    if (!raw) return [];
    return raw.map((d) => ({ label: MONTHS[(d._id.month || 1) - 1], count: d.count }));
  };

  const DONUT_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#84cc16'];

  const logout = () => { localStorage.removeItem('adminToken'); navigate('/admin'); };

  // ── Tab Nav ────────────────────────────────────────────────────────
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'users', label: `👥 Users (${users.length})` },
    { id: 'businesses', label: `🏢 Businesses (${businesses.length})` },
    { id: 'inquiries', label: `📩 Inquiries ${inquiryCounts.pending > 0 ? `(${inquiryCounts.pending} pending)` : `(${inquiries.length})`}` },
  ];

  const tabSx = (id) => ({
    padding: '0.5rem 1.25rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700, transition: 'all 0.2s',
    background: activeTab === id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
    color: activeTab === id ? '#fff' : '#94a3b8',
    boxShadow: activeTab === id ? '0 4px 15px rgba(99,102,241,0.3)' : 'none',
  });

  // ── JSX ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2e 100%)', fontFamily: "'Inter', sans-serif", color: '#fff' }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 0 15px rgba(99,102,241,0.4)' }}>🛡️</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#fff' }}>GrowthPilot Admin</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Super Administrator</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {actionMsg && <span style={{ fontSize: '0.8rem', color: actionMsg.startsWith('✅') ? '#34d399' : '#f87171', fontWeight: 600 }}>{actionMsg}</span>}
          <button onClick={() => setConfirmLogout(true)} style={{ padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>🚪 Logout</button>
        </div>
      </div>

      <div style={{ padding: '1.5rem 2rem', maxWidth: '1300px', margin: '0 auto' }}>

        {/* Tab Nav */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tabs.map((t) => <button key={t.id} onClick={() => { setActiveTab(t.id); if (t.id === 'users') fetchAll(); }} style={tabSx(t.id)}>{t.label}</button>)}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
            <p style={{ marginTop: '0.5rem' }}>Loading data...</p>
          </div>
        ) : (
          <>
            {/* ── DASHBOARD TAB ─────────────────────────────────────────── */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <StatCard icon="👥" label="Total Users" value={stats?.totalUsers ?? 0} color="#6366f1" sub="Registered accounts" />
                  <StatCard icon="🏢" label="Total Businesses" value={stats?.totalBusinesses ?? 0} color="#8b5cf6" sub="Across all users" />
                  <StatCard icon="⚡" label="Total AI Workflows" value={stats?.totalAiActions ?? 0} color="#10b981" sub="Platform operations completed" />
                  <StatCard icon="📈" label="Avg Biz/User" value={stats?.totalUsers ? (stats.totalBusinesses / stats.totalUsers).toFixed(1) : 0} color="#06b6d4" sub="Businesses per user" />
                </div>

                {/* Charts Row 1 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>

                  {/* Users Per Month */}
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>📊</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>User Registrations</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Last 6 months</div>
                      </div>
                    </div>
                    <BarChart data={buildMonthlyData(stats?.usersPerMonth)} color="#6366f1" />
                  </div>

                  {/* Businesses Per Month */}
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>📈</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>Business Growth</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Last 6 months</div>
                      </div>
                    </div>
                    <BarChart data={buildMonthlyData(stats?.businessesPerMonth)} color="#8b5cf6" />
                  </div>
                </div>

                {/* Charts Row 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>

                  {/* Business by Category */}
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '16px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>🏷️</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>Business Categories</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Distribution</div>
                      </div>
                    </div>
                    <DonutChart data={stats?.businessByCategory || []} colors={DONUT_COLORS} />
                  </div>

                  {/* Business Goal Distribution */}
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>🎯</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>Business Goals</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>What users want most</div>
                      </div>
                    </div>
                    <BarChart
                      data={(stats?.goalDistribution || []).map((d) => ({ label: (d._id || 'Other').split(' ').slice(0, 2).join(' '), count: d.count }))}
                      color="#f59e0b"
                    />
                  </div>
                </div>

                {/* AI Tools Real Usage Chart */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '1.25rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>🤖</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>AI Feature Usage Breakdown</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Verified real usage across all user accounts</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                      {stats?.totalAiActions ?? 0} Total Workflows
                    </span>
                  </div>
                  <BarChart
                    data={stats?.toolUsage || [
                      { label: 'AI Chat', count: 0 },
                      { label: 'Marketing', count: 0 },
                      { label: 'Content', count: 0 },
                      { label: 'Image Gen', count: 0 },
                      { label: 'SEO Audit', count: 0 },
                    ]}
                    color="#10b981"
                  />
                </div>
              </div>
            )}

            {/* ── USERS TAB ─────────────────────────────────────────────── */}
            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                    👥 All Users <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 600 }}>({users.length})</span>
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="🔍 Search users..."
                        style={{ padding: '0.45rem 0.85rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '200px' }}
                      />
                      {userSearch && (
                        <button onClick={() => setUserSearch('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                      )}
                    </div>
                    <button onClick={handleExportUsers} style={{ padding: '0.45rem 0.85rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '8px', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      📥 Export CSV
                    </button>
                    <button onClick={fetchAll} style={{ padding: '0.45rem 0.85rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      🔄 Refresh
                    </button>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '750px' }}>
                      <thead>
                        <tr style={{ background: 'rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          {['#', 'User', 'Email', 'Businesses', 'AI Usage & Work', 'Joined', 'Actions'].map((h) => (
                            <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter((u) => {
                          if (!userSearch.trim()) return true;
                          const q = userSearch.toLowerCase();
                          return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
                        }).length === 0 ? (
                          <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No matching users found</td></tr>
                        ) : users.filter((u) => {
                          if (!userSearch.trim()) return true;
                          const q = userSearch.toLowerCase();
                          return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
                        }).map((u, i) => (
                          <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>{i + 1}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                                  {u.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{u.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>{u.email}</td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                              <span style={{ fontWeight: 700, color: '#a78bfa' }}>{u.businessCount || 0}</span> biz
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span style={{
                                  fontSize: '0.75rem', fontWeight: 800,
                                  color: (u.usage?.total || 0) > 0 ? '#34d399' : '#94a3b8',
                                  background: (u.usage?.total || 0) > 0 ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)',
                                  padding: '2px 8px', borderRadius: '6px', display: 'inline-block', width: 'fit-content'
                                }}>
                                  {u.usage?.total || 0} Actions Done
                                </span>
                                <span style={{ fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.02em' }}>
                                  🤖{u.usage?.chats || 0} · 🎯{u.usage?.marketing || 0} · ✍️{u.usage?.content || 0} · 🖼️{u.usage?.images || 0} · 🔍{u.usage?.seo || 0}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <button onClick={() => openUserDetail(u._id)} style={{ padding: '0.3rem 0.7rem', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '7px', color: '#06b6d4', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>👁 View Usage</button>
                                <button onClick={() => { setEditUser({ ...u }); setEditUserErrors({}); }} style={{ padding: '0.3rem 0.7rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '7px', color: '#818cf8', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>✏️ Edit</button>
                                <button onClick={() => setConfirmDelete({ type: 'user', id: u._id, name: u.name })} style={{ padding: '0.3rem 0.7rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '7px', color: '#f87171', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>🗑️</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── BUSINESSES TAB ────────────────────────────────────────── */}
            {activeTab === 'businesses' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                    🏢 All Businesses <span style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 600 }}>({businesses.length})</span>
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={businessSearch}
                        onChange={(e) => setBusinessSearch(e.target.value)}
                        placeholder="🔍 Search businesses..."
                        style={{ padding: '0.45rem 0.85rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '200px' }}
                      />
                      {businessSearch && (
                        <button onClick={() => setBusinessSearch('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                      )}
                    </div>
                    <button onClick={handleExportBusinesses} style={{ padding: '0.45rem 0.85rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '8px', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      📥 Export CSV
                    </button>
                    <button onClick={fetchAll} style={{ padding: '0.45rem 0.85rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      🔄 Refresh
                    </button>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                      <thead>
                        <tr style={{ background: 'rgba(139,92,246,0.1)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          {['#', 'Business', 'Category', 'Owner', 'Phone', 'Goal', 'Actions'].map((h) => (
                            <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {businesses.filter((b) => {
                          if (!businessSearch.trim()) return true;
                          const q = businessSearch.toLowerCase();
                          return (
                            (b.businessName || '').toLowerCase().includes(q) ||
                            (b.businessCategory || '').toLowerCase().includes(q) ||
                            (b.userId?.name || '').toLowerCase().includes(q) ||
                            (b.phone || '').includes(q) ||
                            (b.location || '').toLowerCase().includes(q)
                          );
                        }).length === 0 ? (
                          <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No matching businesses found</td></tr>
                        ) : businesses.filter((b) => {
                          if (!businessSearch.trim()) return true;
                          const q = businessSearch.toLowerCase();
                          return (
                            (b.businessName || '').toLowerCase().includes(q) ||
                            (b.businessCategory || '').toLowerCase().includes(q) ||
                            (b.userId?.name || '').toLowerCase().includes(q) ||
                            (b.phone || '').includes(q) ||
                            (b.location || '').toLowerCase().includes(q)
                          );
                        }).map((b, i) => (
                          <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>{i + 1}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>{b.businessName}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{b.location || 'No location'}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '6px', fontSize: '0.72rem', color: '#c4b5fd', fontWeight: 600 }}>{b.businessCategory}</span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>{b.userId?.name || '—'}</td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>{b.phone || '—'}</td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', color: '#94a3b8' }}>{b.businessGoal || '—'}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <button onClick={() => { setEditBusiness({ ...b }); setEditBusinessErrors({}); }} style={{ padding: '0.3rem 0.7rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '7px', color: '#818cf8', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>✏️ Edit</button>
                                <button onClick={() => setConfirmDelete({ type: 'business', id: b._id, name: b.businessName })} style={{ padding: '0.3rem 0.7rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '7px', color: '#f87171', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>🗑 Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── INQUIRIES TAB ────────────────────────────────────────── */}
            {activeTab === 'inquiries' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📩 User Inquiries & Support Tickets
                      <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 700, background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                        {inquiries.length} Total
                      </span>
                    </h2>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                      All contact forms, tickets, and feedback are routed directly to <strong style={{ color: '#38bdf8' }}>jayrathod@yopmail.com</strong> and reply directly to user emails.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        placeholder="🔍 Search inquiries..."
                        style={{ padding: '0.45rem 0.85rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '200px' }}
                      />
                      {inquirySearch && (
                        <button onClick={() => setInquirySearch('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                      )}
                    </div>
                    <button onClick={handleExportInquiries} style={{ padding: '0.45rem 0.85rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '8px', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      📥 Export CSV
                    </button>
                    <button onClick={fetchAll} style={{ padding: '0.45rem 0.9rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      🔄 Refresh
                    </button>
                  </div>
                </div>

                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <StatCard icon="📬" label="Total Inquiries" value={inquiryCounts.total} color="#6366f1" sub="All time messages" />
                  <StatCard icon="🟡" label="Pending Reply" value={inquiryCounts.pending} color="#f59e0b" sub="Awaiting admin response" />
                  <StatCard icon="🟢" label="Replied" value={inquiryCounts.replied} color="#10b981" sub="Replies emailed to users" />
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '16px', padding: '1.25rem', position: 'relative' }}>
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>✉️</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', wordBreak: 'break-all' }}>jayrathod@yopmail.com</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Admin Notification Inbox</div>
                    <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '0.25rem', fontWeight: 600 }}>● Instant Email Alerts Active</div>
                  </div>
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[
                    { id: 'all', label: `All (${inquiries.length})` },
                    { id: 'pending', label: `🟡 Pending (${inquiryCounts.pending})` },
                    { id: 'replied', label: `🟢 Replied (${inquiryCounts.replied})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setInquiryFilter(f.id)}
                      style={{
                        padding: '0.35rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                        background: inquiryFilter === f.id ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                        color: inquiryFilter === f.id ? '#a5b4fc' : '#94a3b8',
                        border: inquiryFilter === f.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Inquiries Table */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
                      <thead>
                        <tr style={{ background: 'rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          {['#', 'User / Sender', 'Source / Subject', 'Message', 'Status', 'Date', 'Actions'].map((h) => (
                            <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.filter((inq) => {
                          if (inquiryFilter === 'pending' && inq.status !== 'pending') return false;
                          if (inquiryFilter === 'replied' && inq.status !== 'replied') return false;
                          if (!inquirySearch.trim()) return true;
                          const q = inquirySearch.toLowerCase();
                          return (
                            (inq.name || '').toLowerCase().includes(q) ||
                            (inq.email || '').toLowerCase().includes(q) ||
                            (inq.subject || '').toLowerCase().includes(q) ||
                            (inq.message || '').toLowerCase().includes(q) ||
                            (inq.phone || '').includes(q) ||
                            (inq.businessName || '').toLowerCase().includes(q)
                          );
                        }).length === 0 ? (
                          <tr><td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>No inquiries match this filter / search</td></tr>
                        ) : inquiries.filter((inq) => {
                          if (inquiryFilter === 'pending' && inq.status !== 'pending') return false;
                          if (inquiryFilter === 'replied' && inq.status !== 'replied') return false;
                          if (!inquirySearch.trim()) return true;
                          const q = inquirySearch.toLowerCase();
                          return (
                            (inq.name || '').toLowerCase().includes(q) ||
                            (inq.email || '').toLowerCase().includes(q) ||
                            (inq.subject || '').toLowerCase().includes(q) ||
                            (inq.message || '').toLowerCase().includes(q) ||
                            (inq.phone || '').includes(q) ||
                            (inq.businessName || '').toLowerCase().includes(q)
                          );
                        }).map((inq, i) => (
                          <tr key={inq._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>{i + 1}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>{inq.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{inq.email}</div>
                              {inq.phone && <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>📞 {inq.phone}</div>}
                              {inq.businessName && <div style={{ fontSize: '0.7rem', color: '#a78bfa' }}>🏢 {inq.businessName}</div>}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{
                                padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, display: 'inline-block', marginBottom: '4px',
                                background: inq.source === 'help_ticket' ? 'rgba(245,158,11,0.15)' : inq.source === 'feedback' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
                                color: inq.source === 'help_ticket' ? '#f59e0b' : inq.source === 'feedback' ? '#10b981' : '#818cf8',
                                border: inq.source === 'help_ticket' ? '1px solid rgba(245,158,11,0.3)' : inq.source === 'feedback' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(99,102,241,0.3)'
                              }}>
                                {inq.source === 'help_ticket' ? '🎫 Help Ticket' : inq.source === 'feedback' ? '⭐ Feedback' : '✉️ Contact'}
                              </span>
                              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>{inq.subject || inq.category}</div>
                              {inq.rating && <div style={{ fontSize: '0.72rem', color: '#f59e0b' }}>{'★'.repeat(inq.rating)}</div>}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', maxWidth: '280px' }}>
                              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {inq.message}
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              {inq.status === 'replied' ? (
                                <span style={{ padding: '0.25rem 0.6rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                                  ✓ Replied
                                </span>
                              ) : (
                                <span style={{ padding: '0.25rem 0.6rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>
                                  ⏳ Pending
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                              {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <button
                                  onClick={() => { setSelectedInquiry(inq); setReplyText(inq.adminReply?.message || ''); }}
                                  style={{
                                    padding: '0.35rem 0.75rem', borderRadius: '7px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
                                    background: inq.status === 'replied' ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.2)',
                                    border: inq.status === 'replied' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(99,102,241,0.4)',
                                    color: inq.status === 'replied' ? '#34d399' : '#a5b4fc'
                                  }}
                                >
                                  {inq.status === 'replied' ? '👁️ View Reply' : '✉️ Reply via Email'}
                                </button>
                                <button
                                  onClick={() => setConfirmDelete({ type: 'inquiry', id: inq._id, name: `Inquiry from ${inq.name} (${inq.email})` })}
                                  style={{ padding: '0.35rem 0.6rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '7px', color: '#f87171', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}
                                  title="Delete inquiry"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── User Detail Modal ──────────────────────────────────────────── */}
      {userDetailOpen && userDetail && (
        <Modal title={`👤 ${userDetail.user.name}`} onClose={() => setUserDetailOpen(false)}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              {[['Name', userDetail.user.name], ['Email', userDetail.user.email], ['Joined', new Date(userDetail.user.createdAt).toLocaleDateString('en-IN')], ['Businesses', userDetail.businesses.length]].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.6rem 0.8rem' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{k}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* AI Workflows & Usage Breakdown */}
            <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px', padding: '0.9rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚡ User AI Workflows ({userDetail.usage?.total || 0} Total)
                </span>
                <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>● Verified DB</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
                {[
                  { label: 'AI Chats', count: userDetail.usage?.chats || 0, icon: '🤖', color: '#6366f1' },
                  { label: 'Marketing', count: userDetail.usage?.marketing || 0, icon: '🎯', color: '#8b5cf6' },
                  { label: 'Content', count: userDetail.usage?.content || 0, icon: '✍️', color: '#06b6d4' },
                  { label: 'Images', count: userDetail.usage?.images || 0, icon: '🖼️', color: '#10b981' },
                  { label: 'SEO Audits', count: userDetail.usage?.seo || 0, icon: '🔍', color: '#f59e0b' },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '2px' }}>{item.icon}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: item.color }}>{item.count}</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Log */}
            {userDetail.recentActivity && userDetail.recentActivity.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  📜 Recent User Actions ({userDetail.recentActivity.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {userDetail.recentActivity.map((act, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.9rem' }}>{act.icon}</span>
                        <div style={{ overflow: 'hidden' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginRight: '6px' }}>{act.title}:</span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{act.text}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', flexShrink: 0, marginLeft: '8px' }}>
                        {new Date(act.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>🏢 Businesses</div>
            {userDetail.businesses.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.8rem' }}>No businesses added yet</p>
            ) : userDetail.businesses.map((b) => (
              <div key={b._id} style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', padding: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem' }}>{b.businessName}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{b.businessCategory} {b.location ? `• ${b.location}` : ''}</div>
                {b.phone && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📞 {b.phone}</div>}
                {b.businessGoal && <div style={{ fontSize: '0.72rem', color: '#8b5cf6', marginTop: '0.25rem' }}>🎯 {b.businessGoal}</div>}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ── Edit User Modal ────────────────────────────────────────────── */}
      {editUser && (
        <Modal title="✏️ Edit User" onClose={() => setEditUser(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={labelSx}>Full Name</label>
              <input type="text" value={editUser.name || ''} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} style={inputSx(editUserErrors.name)} placeholder="User name" />
              {editUserErrors.name && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{editUserErrors.name}</p>}
            </div>
            <div>
              <label style={labelSx}>Email</label>
              <input type="email" value={editUser.email || ''} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} style={inputSx(editUserErrors.email)} placeholder="User email" />
              {editUserErrors.email && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{editUserErrors.email}</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button onClick={handleSaveUser} style={{ flex: 1, padding: '0.7rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>💾 Save Changes</button>
              <button onClick={() => setEditUser(null)} style={{ padding: '0.7rem 1.25rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Edit Business Modal ────────────────────────────────────────── */}
      {editBusiness && (
        <Modal title="✏️ Edit Business" onClose={() => setEditBusiness(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[['businessName', 'Business Name', 'text'], ['businessCategory', 'Category', 'text'], ['location', 'Location', 'text'], ['phone', 'Phone', 'tel'], ['email', 'Business Email', 'email']].map(([field, lbl, type]) => (
              <div key={field}>
                <label style={labelSx}>{lbl}</label>
                <input type={type} value={editBusiness[field] || ''} onChange={(e) => setEditBusiness({ ...editBusiness, [field]: e.target.value })} style={inputSx(editBusinessErrors[field])} placeholder={lbl} />
                {editBusinessErrors[field] && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{editBusinessErrors[field]}</p>}
              </div>
            ))}
            <div>
              <label style={labelSx}>Description</label>
              <textarea value={editBusiness.businessDescription || ''} onChange={(e) => setEditBusiness({ ...editBusiness, businessDescription: e.target.value })} rows={3} style={{ ...inputSx(false), resize: 'none' }} placeholder="Business description" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button onClick={handleSaveBusiness} style={{ flex: 1, padding: '0.7rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>💾 Save Changes</button>
              <button onClick={() => setEditBusiness(null)} style={{ padding: '0.7rem 1.25rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── View & Reply Modal ───────────────────────────────────────── */}
      {selectedInquiry && (
        <Modal
          title={`✉️ User Inquiry & Email Reply`}
          onClose={() => { setSelectedInquiry(null); setReplyText(''); }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Inquiry Summary Box */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{selectedInquiry.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>{selectedInquiry.email}</div>
                  {selectedInquiry.phone && <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>📞 {selectedInquiry.phone}</div>}
                  {selectedInquiry.businessName && <div style={{ fontSize: '0.72rem', color: '#a78bfa' }}>🏢 {selectedInquiry.businessName}</div>}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {new Date(selectedInquiry.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c4b5fd', marginBottom: '0.4rem' }}>
                Subject: {selectedInquiry.subject}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid #6366f1', padding: '0.6rem 0.8rem', borderRadius: '4px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                "{selectedInquiry.message}"
              </div>
            </div>

            {/* If already replied, show previous reply */}
            {selectedInquiry.adminReply?.message && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399' }}>
                    ✓ Previous Reply Sent by Admin
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    {selectedInquiry.adminReply.repliedAt ? new Date(selectedInquiry.adminReply.repliedAt).toLocaleString('en-IN') : ''}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                  {selectedInquiry.adminReply.message}
                </div>
              </div>
            )}

            {/* Compose Reply Form */}
            <div>
              <label style={labelSx}>
                Compose Direct Reply to <span style={{ color: '#38bdf8' }}>{selectedInquiry.email}</span>
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
                placeholder={`Dear ${selectedInquiry.name},\n\nThank you for reaching out to GrowthPilot AI. Regarding your inquiry...\n\nBest regards,\nJay Rathod & GrowthPilot AI Team`}
                style={{ ...inputSx(false), resize: 'vertical', lineHeight: 1.5 }}
              />
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>⚡</span> Reply will be delivered straight to user's inbox via Brevo SMTP from <span style={{ color: '#38bdf8' }}>jayrathod@yopmail.com</span>.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={handleSendReply}
                disabled={sendingReply}
                style={{
                  flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 800,
                  cursor: sendingReply ? 'not-allowed' : 'pointer', fontSize: '0.875rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  opacity: sendingReply ? 0.7 : 1
                }}
              >
                {sendingReply ? '⏳ Sending Email Reply...' : `🚀 Send Email Reply to ${selectedInquiry.name.split(' ')[0]}`}
              </button>
              <button
                onClick={() => { setSelectedInquiry(null); setReplyText(''); }}
                style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Confirm Delete Modal ───────────────────────────────────────── */}
      {confirmDelete && (
        <Modal title="🗑️ Confirm Delete" onClose={() => setConfirmDelete(null)}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Are you sure you want to delete <strong style={{ color: '#fff' }}>{confirmDelete.name}</strong>?
            {confirmDelete.type === 'user' && <span style={{ color: '#f87171', display: 'block', marginTop: '0.5rem', fontSize: '0.8rem' }}>⚠️ This will also delete all their businesses.</span>}
            {confirmDelete.type === 'inquiry' && <span style={{ color: '#f87171', display: 'block', marginTop: '0.5rem', fontSize: '0.8rem' }}>⚠️ This inquiry record will be permanently deleted from the database.</span>}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleDeleteConfirm} style={{ flex: 1, padding: '0.7rem', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>🗑️ Yes, Delete</button>
            <button onClick={() => setConfirmDelete(null)} style={{ padding: '0.7rem 1.25rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* ── Confirm Logout Modal ────────────────────────────────────────── */}
      {confirmLogout && (
        <Modal title="🚪 Confirm Admin Logout" onClose={() => setConfirmLogout(false)}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Are you sure you want to log out from the Admin Portal?
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={logout} style={{ flex: 1, padding: '0.7rem', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>🚪 Yes, Logout</button>
            <button onClick={() => setConfirmLogout(false)} style={{ padding: '0.7rem 1.25rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* ── Confirm Edit Modal ──────────────────────────────────────────── */}
      {confirmEdit && (
        <Modal title={`✍️ ${confirmEdit.title}`} onClose={() => setConfirmEdit(null)}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {confirmEdit.message}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                const fn = confirmEdit.onConfirm;
                setConfirmEdit(null);
                fn();
              }}
              style={{ flex: 1, padding: '0.7rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}
            >
              💾 Yes, Save Changes
            </button>
            <button onClick={() => setConfirmEdit(null)} style={{ padding: '0.7rem 1.25rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
          </div>
        </Modal>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminDashboard;

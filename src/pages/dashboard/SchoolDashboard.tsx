import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { School, NewsArticle } from '../../types';
import { schoolService } from '../../services/schoolService';
import { articleService } from '../../services/articleService';
import { authService } from '../../services/authService';
import { 
  ShieldCheck, 
  Users, 
  Award, 
  Radio, 
  FileCheck, 
  UserPlus, 
  PlusCircle, 
  Building2, 
  CheckCircle, 
  XOctagon, 
  Trash2, 
  Clock, 
  Save, 
  TrendingUp,
  MapPin,
  ExternalLink,
  Crown
} from 'lucide-react';

interface SchoolDashboardProps {
  activeTab?: 'stats' | 'workspace' | 'articles' | 'profile' | 'users' | 'submissions' | 'moderation' | 'settings';
}

export default function SchoolDashboard({ activeTab: initialTab = 'stats' }: SchoolDashboardProps) {
  const { currentRole, isAdmin } = useAuth();
  
  // Tab states
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  
  // Data states
  const [schools, setSchools] = useState<School[]>([]);
  const [pendingSchools, setPendingSchools] = useState<School[]>([]);
  const [pendingArticles, setPendingArticles] = useState<NewsArticle[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; body: string } | null>(null);

  // --- Form Selectors ---
  // 1. School Admin form for configuring school
  const [adminSchoolId, setAdminSchoolId] = useState('alliance');
  const [schoolPrincipal, setSchoolPrincipal] = useState('');
  const [schoolPrincipalQuote, setSchoolPrincipalQuote] = useState('');
  const [schoolPathways, setSchoolPathways] = useState<string[]>([]);
  const [specialCombinations, setSpecialCombinations] = useState('');

  // 2. Add Editor/Faculty form
  const [facultyName, setFacultyName] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyRole, setFacultyRole] = useState<'editor' | 'student_reporter' | 'school_admin'>('editor');

  // 3. Super Admin propose/create certified high school
  const [newSchId, setNewSchId] = useState('');
  const [newSchName, setNewSchName] = useState('');
  const [newSchCounty, setNewSchCounty] = useState('Nairobi');
  const [newSchCategory, setNewSchCategory] = useState<'National' | 'Extra-County' | 'County'>('National');
  const [newSchGender, setNewSchGender] = useState<'Boys' | 'Girls' | 'Co-Educational'>('Co-Educational');
  const [newSchPrincipal, setNewSchPrincipal] = useState('');

  // Auto load data depending on current identity
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Load active school lists
      const schoolsData = await schoolService.getSchools();
      setSchools(schoolsData);

      // Pre-fill default school-admin values if active
      if (currentRole === 'school_admin') {
        const adminSch = schoolsData.find(s => s.id === adminSchoolId) || schoolsData[0];
        if (adminSch) {
          setAdminSchoolId(adminSch.id);
          setSchoolPrincipal(adminSch.principalName || '');
          setSchoolPrincipalQuote(adminSch.principalQuote || '');
          setSchoolPathways(adminSch.certifiedPathways || []);
          setSpecialCombinations((adminSch.specialCombinationList || []).join(', '));
        }
      }

      // 2. If Super Admin, fetch users, pending schools, pending drafts
      if (currentRole === 'super_admin') {
        const u = await authService.getUsers().catch(() => []);
        setUserList(u);
        const ps = await schoolService.getPendingSchools().catch(() => []);
        setPendingSchools(ps);
        const pa = await articleService.getPendingArticles().catch(() => []);
        setPendingArticles(pa);
      }

      // 3. If Editor, fetch pending drafts in system
      if (currentRole === 'editor') {
        const pa = await articleService.getPendingArticles().catch(() => []);
        setPendingArticles(pa);
      }

      // 4. If Student Reporter, see draft state check
      if (currentRole === 'student_reporter') {
        const allArticles = await articleService.getArticles();
        setPendingArticles(allArticles.filter(a => !a.isVerified));
      }

    } catch (err: any) {
      console.error('Failed to load dynamic dashboard workspaces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentRole, adminSchoolId]);

  // Flash warning/success messages
  const showFlash = (type: 'success' | 'error', body: string) => {
    setStatusMsg({ type, body });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Action helpers
  const handleApproveSchool = async (id: string) => {
    try {
      await schoolService.approveSchool(id);
      showFlash('success', 'Senior Secondary Center certified and registered inside active registry.');
      loadData();
    } catch (err: any) {
      showFlash('error', err.message || 'Verification execution failed');
    }
  };

  const handleApproveDraft = async (id: string) => {
    try {
      await articleService.approveArticle(id);
      showFlash('success', 'Student Co-curricular draft approved, digitally stamped, and printed live!');
      loadData();
    } catch (err: any) {
      showFlash('error', err.message || 'Draft approval collapsed');
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      await articleService.pinArticle(id);
      showFlash('success', 'Regional news curation stamp updated successfully.');
      loadData();
    } catch (err: any) {
      showFlash('error', err.message || 'Curation update failed');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await authService.deleteUser(id);
      showFlash('success', 'User workspace keys deactivated and deleted successfully.');
      loadData();
    } catch (err: any) {
      showFlash('error', err.message || 'Key deactivation failed');
    }
  };

  const handleAddSchoolAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchId || !newSchName || !newSchPrincipal) {
      showFlash('error', 'Please fill in all core certified fields.');
      return;
    }
    try {
      await schoolService.createSchool({
        id: newSchId.toLowerCase().replace(/\s+/g, '-'),
        name: newSchName,
        county: newSchCounty,
        category: newSchCategory,
        genderType: newSchGender,
        logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=60',
        isVerified: currentRole === 'super_admin',
        principalName: newSchPrincipal,
        principalQuote: 'Embracing Competency-Based Education (CBC) paths.',
        certifiedPathways: ['STEM'],
        specialCombinationList: ['Path A (STEM Core Physics, Technology, Mathematics)']
      });
      showFlash('success', currentRole === 'super_admin' ? 'Certified Center created and active instantly!' : 'Secondary Center proposal uploaded to ministry queue.');
      setNewSchId('');
      setNewSchName('');
      setNewSchPrincipal('');
      loadData();
    } catch (err: any) {
      showFlash('error', err.message || 'Secondary Center registration collapsed');
    }
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName || !facultyEmail) {
      showFlash('error', 'Must specify Faculty Name and valid Email.');
      return;
    }
    try {
      await authService.createUser({
        email: facultyEmail,
        name: facultyName,
        role: facultyRole,
        schoolId: currentRole === 'school_admin' ? adminSchoolId : undefined
      });
      showFlash('success', `Faculty registered: ${facultyName} now possesses authorized (${facultyRole.toUpperCase()}) keys!`);
      setFacultyName('');
      setFacultyEmail('');
      loadData();
    } catch (err: any) {
      showFlash('error', err.message || 'Faculty registration failed');
    }
  };

  const handleUpdateSchoolAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolPrincipal.trim()) {
      showFlash('error', 'Principal name is required.');
      return;
    }
    try {
      const splitCombs = specialCombinations
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      await schoolService.updateSchool(adminSchoolId, {
        principalName: schoolPrincipal,
        principalQuote: schoolPrincipalQuote,
        certifiedPathways: schoolPathways as any,
        specialCombinationList: splitCombs
      });
      showFlash('success', `Ministry records matching "${schools.find(s=>s.id === adminSchoolId)?.name || 'Board'}" updated with matching digital sign.`);
      loadData();
    } catch (err: any) {
      showFlash('error', err.message || 'Profile modification failure');
    }
  };

  const togglePathwayCheckbox = (pathway: string) => {
    if (schoolPathways.includes(pathway)) {
      setSchoolPathways(schoolPathways.filter(p => p !== pathway));
    } else {
      setSchoolPathways([...schoolPathways, pathway]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="school-dashboard-view">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="font-display text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            School Administration
            {currentRole !== 'public_reader' && (
              <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[9px] font-mono font-bold text-blue-800 uppercase">
                {currentRole.replace('_', ' ')} Workspace
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage counties, pathway profiles, staff keys, and student drafts.
          </p>
        </div>

          {/* Workspace navigation toggles */}
          {currentRole !== 'public_reader' && (
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-stretch sm:self-auto shadow-3xs" id="workspace-triggers-bar">
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 sm:flex-initial text-center px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'stats' 
                    ? 'bg-white text-slate-900 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Stats Board
              </button>
              <button
                onClick={() => setActiveTab('workspace')}
                className={`flex-1 sm:flex-initial text-center px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  (activeTab === 'workspace' || activeTab === 'articles' || activeTab === 'profile' || activeTab === 'users' || activeTab === 'submissions' || activeTab === 'moderation' || activeTab === 'settings')
                    ? 'bg-blue-600 text-white shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Workspace
              </button>
            </div>
          )}
      </div>

      {/* Message Flashes */}
      {statusMsg && (
        <div 
          className={`p-4 rounded-xl text-xs font-semibold border flex items-center gap-2 animate-bounce-short ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-red-50 border-red-200 text-red-950'
          }`}
          id="status-flash-notification"
        >
          {statusMsg.type === 'success' ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <XOctagon className="h-4 w-4 text-red-600" />}
          <span>{statusMsg.body}</span>
        </div>
      )}

      {/* Stats Board tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fade-in" id="stats-board-grid">
          {/* General counts metrics grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" id="metric-grid-counters">
            <div className="space-y-1 rounded-xl bg-slate-950 p-5 text-white shadow-xs border border-slate-900">
              <span className="text-[10px] text-slate-300 tracking-widest font-mono font-semibold uppercase block">Traffic</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">41,209</span>
              </div>
              <p className="text-[9.5px] text-slate-200/85">KSSNN active readers</p>
            </div>
            
            <div className="space-y-1 rounded-xl bg-slate-950 p-5 text-white shadow-xs border border-slate-900">
              <span className="text-[10px] text-slate-300 tracking-widest font-mono font-semibold uppercase block">Schools</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-emerald-400">{schools.length || 254}</span>
                <span className="text-[10.5px] text-emerald-200">Centers</span>
              </div>
              <p className="text-[9.5px] text-slate-200/85">Counties represented</p>
            </div>

            <div className="space-y-1 rounded-xl bg-slate-950 p-5 text-white shadow-xs border border-slate-900">
              <span className="text-[10px] text-slate-300 tracking-widest font-mono font-semibold uppercase block">Pathways</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">3</span>
                <span className="text-[10.5px] text-blue-200">Core tracks</span>
              </div>
              <p className="text-[9.5px] text-slate-200/85">Core pathway options</p>
            </div>

            <div className="space-y-1 rounded-xl bg-slate-950 p-5 text-white shadow-xs border border-slate-900">
              <span className="text-[10px] text-slate-300 tracking-widest font-mono font-semibold uppercase block">Grants Value</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-emerald-400">KES 840M</span>
              </div>
              <p className="text-[9.5px] text-emerald-200 font-mono text-emerald-300 uppercase">Accredited allocations</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Placement Allocations Table */}
            <div className="md:col-span-2 rounded-xl border border-slate-150 bg-white p-5 space-y-4 shadow-3xs" id="placement-allocations-block">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Pathway Allocations
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Grade 10</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 font-sans">
                  <thead className="text-[10px] text-slate-400 uppercase tracking-widest font-mono bg-slate-50 border-y border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">School Name</th>
                      <th className="py-2.5 px-3">County</th>
                      <th className="py-2.5 px-3">Placement Quota</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {schools.slice(0, 5).map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800">{s.name}</div>
                          <span className="text-[9.5px] font-mono text-slate-400 capitalize bg-slate-100 px-1 py-0.5 rounded">{s.category} Index</span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {s.county}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800">120 candidates</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9.5px] font-bold border ${s.isVerified ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-100'}`}>
                            {s.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cryptographic identity credentials block */}
            <div className="rounded-xl border border-slate-150 bg-white p-5 space-y-4 h-fit shadow-2xs" id="cryptographic-stamps-info">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Crown className="h-4 w-4 text-blue-700" />
                  Credentials List
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Verification keys are authorized to maintain student portfolios and school pathway credentials.
              </p>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-3 font-mono">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Role:</span>
                  <p className="font-bold text-slate-900 mt-0.5 text-xs capitalize">
                    {currentRole.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Access Verification:</span>
                  <p className={`font-bold mt-0.5 text-xs ${currentRole !== 'public_reader' ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {currentRole !== 'public_reader' ? 'Authorized signature' : 'Default Guest'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Management/Workspace tab */}
      {(activeTab === 'workspace' || activeTab === 'articles' || activeTab === 'profile' || activeTab === 'users' || activeTab === 'submissions' || activeTab === 'moderation' || activeTab === 'settings') && currentRole !== 'public_reader' && (
        <div className="space-y-8 animate-fade-in" id="role-action-panel-views">
          
          {/* Dashboard Sub-navigation (Visual Only for now to show context) */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
            {(currentRole === 'super_admin' || currentRole === 'school_admin' || currentRole === 'editor') && (
              <NavLink 
                to="/dashboard/moderation" 
                className={({isActive}) => `px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-colors ${isActive ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Moderation
              </NavLink>
            )}
            {(currentRole !== 'public_reader') && (
              <NavLink 
                to="/dashboard/articles" 
                className={({isActive}) => `px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-colors ${isActive ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Articles
              </NavLink>
            )}
            {(currentRole === 'school_admin' || currentRole === 'super_admin') && (
              <NavLink 
                to="/dashboard/users" 
                className={({isActive}) => `px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-colors ${isActive ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Users
              </NavLink>
            )}
            <NavLink 
              to="/dashboard/settings" 
              className={({isActive}) => `px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-colors ${isActive ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Settings
            </NavLink>
          </div>
          
          {/* loading skeleton */}
          {isLoading && (
            <div className="p-12 text-center rounded-xl border border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500 animate-pulse font-mono flex items-center justify-center gap-2">
                <Radio className="h-4 w-4 text-blue-600 animate-spin" />
                Loading records...
              </p>
            </div>
          )}

          {/* 1. SUPER ADMIN WORKSPACE SECTION */}
          {currentRole === 'super_admin' && !isLoading && (
            <div className="grid gap-6 lg:grid-cols-3" id="super-admin-full-blocks">
              
              {/* Approving Proposed Schools Registry */}
              <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Pending Accreditation ({pendingSchools.length})
                  </h3>
                  <span className="text-[10px] bg-blue-50 font-bold px-2 py-0.5 rounded text-blue-800 uppercase font-mono">Platform</span>
                </div>

                {pendingSchools.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs font-medium font-sans">
                     No pending school credentials.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {pendingSchools.map(ps => (
                      <div key={ps.id} className="py-3 flex items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{ps.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">County: {ps.county} | Admin: {ps.principalName}</p>
                        </div>
                        <button
                          onClick={() => handleApproveSchool(ps.id)}
                          className="rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold px-3 py-1.5 cursor-pointer shadow-3xs transition-all"
                        >
                          Approve Certified Registry
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit / Propose certified senior school center */}
                <form onSubmit={handleAddSchoolAdmin} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-900 flex items-center gap-1">
                    <PlusCircle className="h-4 w-4 text-blue-700" />
                    Add a New High School Center
                  </h4>
                  <div className="grid gap-3 grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-semibold text-slate-500 font-mono">School ID:</label>
                      <input 
                        type="text" 
                        value={newSchId} 
                        onChange={e => setNewSchId(e.target.value)} 
                        placeholder="e.g.alliance" 
                        className="rounded border border-slate-200 bg-white p-2 text-xs focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-semibold text-slate-500 font-mono">School Name:</label>
                      <input 
                        type="text" 
                        value={newSchName} 
                        onChange={e => setNewSchName(e.target.value)} 
                        placeholder="e.g. Alliance High School" 
                        className="rounded border border-slate-200 bg-white p-2 text-xs focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-semibold text-slate-500 font-mono">County:</label>
                      <select 
                        value={newSchCounty} 
                        onChange={e => setNewSchCounty(e.target.value)} 
                        className="rounded border border-slate-200 bg-white p-2 text-xs focus:border-blue-500 cursor-pointer"
                      >
                        <option value="Kiambu">Kiambu</option>
                        <option value="Nairobi">Nairobi</option>
                        <option value="Nandi">Nandi</option>
                        <option value="Kisumu">Kisumu</option>
                        <option value="Mombasa">Mombasa</option>
                        <option value="Nakuru">Nakuru</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-semibold text-slate-500 font-mono">Principal Name:</label>
                      <input 
                        type="text" 
                        value={newSchPrincipal} 
                        onChange={e => setNewSchPrincipal(e.target.value)} 
                        placeholder="e.g. Mr. David Mwangi" 
                        className="rounded border border-slate-200 bg-white p-2 text-xs focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 shadow-2xs cursor-pointer transition-all"
                  >
                    Add School Center
                  </button>
                </form>
              </div>

              {/* Managing Platform Users List */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-600" />
                    Authorized Administrators ({userList.length})
                  </h3>
                </div>

                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto space-y-2">
                  {userList.map(u => (
                    <div key={u.id} className="pt-2 text-xs flex justify-between items-start gap-1">
                      <div>
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                        <span className="rounded bg-slate-100 text-slate-600 px-1 text-[8px] font-mono tracking-widest uppercase font-bold">{u.role}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded cursor-pointer transition-all"
                        title="Deactivate security key link"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add dynamic users across schools */}
                <form onSubmit={handleAddFaculty} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3 pt-4">
                  <h4 className="text-[10.5px] font-bold uppercase text-slate-705 flex items-center gap-1">
                    <UserPlus className="h-4 w-4 text-blue-650" />
                    Add School Faculty Member
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={facultyName} 
                      onChange={e => setFacultyName(e.target.value)} 
                      className="rounded border border-slate-200 bg-white p-2 text-xs focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={facultyEmail} 
                      onChange={e => setFacultyEmail(e.target.value)} 
                      className="rounded border border-slate-200 bg-white p-2 text-xs focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <select 
                      value={facultyRole} 
                      onChange={e => setFacultyRole(e.target.value as any)} 
                      className="rounded border border-slate-200 bg-white p-2 text-xs focus:border-blue-500 cursor-pointer"
                    >
                      <option value="editor">Editor</option>
                      <option value="student_reporter">Student Reporter</option>
                      <option value="school_admin">School Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded bg-slate-850 hover:bg-slate-900 text-white font-bold text-[10.5px] py-1.5 cursor-pointer shadow-3xs transition-all"
                  >
                    Create Profile
                  </button>
                </form>
              </div>

              {/* Global news drafts approvals block */}
              <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-blue-600" />
                    Pending Student Drafts ({pendingArticles.length})
                  </h3>
                </div>

                {pendingArticles.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs font-sans">
                     No pending drafts in folder.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pendingArticles.map(pa => (
                      <div key={pa.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[8.5px] font-semibold text-amber-800 uppercase">Pending Review</span>
                          <h4 className="font-bold text-slate-900 text-xs tracking-tight line-clamp-1">{pa.title}</h4>
                          <p className="text-[10px] text-slate-505 line-clamp-2 leading-relaxed">{pa.summary}</p>
                          <div className="text-[9px] text-slate-400 font-mono">Reporter: {pa.authorName} ({pa.schoolName || 'Co.'})</div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleApproveDraft(pa.id)}
                            className="flex-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 text-[10px] cursor-pointer shadow-3xs text-center inline-block"
                          >
                            Approve & Publish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. SCHOOL ADMIN WORKSPACE SECTION */}
          {currentRole === 'school_admin' && !isLoading && (
            <div className="grid gap-6 md:grid-cols-2" id="school-admin-full-blocks">
              {/* Configure school profile */}
              <form onSubmit={handleUpdateSchoolAdminProfile} className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-3xs">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Configure Secondary Center
                  </h3>
                  <select
                    value={adminSchoolId}
                    onChange={e => setAdminSchoolId(e.target.value)}
                    className="rounded border border-slate-200 bg-slate-50 text-[10.5px] font-bold px-2 py-1 cursor-pointer"
                  >
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 font-mono">Principal Name:</label>
                    <input 
                      type="text" 
                      value={schoolPrincipal} 
                      onChange={e => setSchoolPrincipal(e.target.value)} 
                      placeholder="e.g. Mr. David Mwangi" 
                      className="rounded border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 font-semibold"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 font-mono">Principal's Message:</label>
                    <textarea 
                      rows={3}
                      value={schoolPrincipalQuote} 
                      onChange={e => setSchoolPrincipalQuote(e.target.value)} 
                      placeholder="Message representing the school's pathway adoption..." 
                      className="rounded border border-slate-200 p-2.5 text-xs text-slate-850 focus:border-blue-500 font-medium"
                    ></textarea>
                  </div>

                  {/* Certified CBC pathway checkboxes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono block">Certified Pathways:</label>
                    <div className="flex flex-wrap gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                      {['STEM', 'Social Sciences', 'Arts & Sports Science'].map(p => (
                        <label key={p} className="flex items-center gap-1.5 font-semibold text-slate-700 select-none cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={schoolPathways.includes(p)} 
                            onChange={() => togglePathwayCheckbox(p)}
                            className="rounded text-blue-700 focus:ring-blue-500 cursor-pointer h-4 w-4"
                          />
                          {p}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Special combos text */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 font-mono">Pathways Combinations (comma-separated):</label>
                    <input 
                      type="text" 
                      value={specialCombinations} 
                      onChange={e => setSpecialCombinations(e.target.value)} 
                      placeholder="e.g. Pure Sciences & Computing Opt 1, Performing Arts Elite Group" 
                      className="rounded border border-slate-200 p-2 text-xs focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 shadow-2xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>Save School Details</span>
                </button>
              </form>

              {/* Add localized school staff */}
              <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-3xs h-fit">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-600" />
                    Faculty & Student Access
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Admin Link</span>
                </div>

                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Configure login and publishing access for teachers, local editors, and student writers.
                </p>

                <form onSubmit={handleAddFaculty} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 font-mono">Full Name:</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Alex Waiganjo" 
                      value={facultyName} 
                      onChange={e => setFacultyName(e.target.value)} 
                      className="rounded border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 font-mono">School Email:</label>
                    <input 
                      type="email" 
                      placeholder="e.g. alex@school.ke" 
                      value={facultyEmail} 
                      onChange={e => setFacultyEmail(e.target.value)} 
                      className="rounded border border-slate-200 bg-white p-2.5 text-xs text-slate-850 font-mono"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 font-mono">Access Level:</label>
                    <select 
                      value={facultyRole} 
                      onChange={e => setFacultyRole(e.target.value as any)} 
                      className="rounded border border-slate-200 bg-white p-2 text-xs text-slate-800 font-medium cursor-pointer"
                    >
                      <option value="editor">Editor</option>
                      <option value="student_reporter">Student Reporter</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2 shadow-2xs cursor-pointer transition-all flex items-center justify-center gap-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Add Member</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 3. EDITOR WORKSPACE SECTION */}
          {currentRole === 'editor' && !isLoading && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5 shadow-3xs" id="editor-full-blocks">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-blue-600" />
                  Pending Newsletters ({pendingArticles.length})
                </h3>
              </div>

              {pendingArticles.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-sans">
                  No pending co-curricular drafts.
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingArticles.map(pa => (
                    <div key={pa.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3.5 flex flex-col justify-between shadow-3xs hover:shadow-2xs transition-all">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start gap-1">
                          <span className="rounded bg-amber-50 border border-amber-200 px-1 text-[8px] font-mono font-bold text-amber-800 uppercase">Pending Review</span>
                          <span className="text-[8.5px] bg-slate-200/80 px-1 py-0.5 rounded font-bold capitalize text-slate-600">{pa.category}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-xs line-clamp-1">{pa.title}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 font-medium">{pa.summary}</p>
                        <div className="text-[9.5px] text-slate-400 font-mono">Written by: <span className="font-semibold text-slate-600">{pa.authorName}</span> ({pa.schoolName})</div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleApproveDraft(pa.id)}
                          className="flex-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 text-[9.5px] cursor-pointer shadow-3xs transition-all text-center"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleTogglePin(pa.id)}
                          className={`rounded px-2.5 py-1.5 text-[9.5px] font-bold cursor-pointer transition-all border ${pa.tags.includes('Pinned') ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                          title={pa.tags.includes('Pinned') ? 'Pinned story' : 'Pin story'}
                        >
                          Pin
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. STUDENT REPORTER WORKSPACE SECTION */}
          {currentRole === 'student_reporter' && !isLoading && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-3xs" id="reporter-full-blocks">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-blue-600" />
                  My Submitted Drafts ({pendingArticles.length})
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Status</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-sans mt-1">
                All submitted stories require approval from a certified school admin or editor before going live.
              </p>

              {pendingArticles.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-sans">
                  No submitted drafts showing. Click "Composer" to write your first story!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 space-y-2 max-h-80 overflow-y-auto">
                  {pendingArticles.map(pa => (
                    <div key={pa.id} className="pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 leading-snug">
                          {pa.title}
                        </h4>
                        <p className="text-[10.5px] text-slate-505 leading-relaxed max-w-xl">{pa.summary}</p>
                        <div className="text-[9px] text-slate-400 font-mono">Submission date: {pa.date} | Pathway: {pa.category.toUpperCase()}</div>
                      </div>

                      <div className="shrink-0">
                        <span className="rounded bg-amber-50 border border-amber-200 px-2 py-1 text-[9px] font-bold text-amber-800 uppercase animate-pulse">
                          <Clock className="h-3 w-3 text-amber-500 animate-pulse" /> Awaiting Review
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

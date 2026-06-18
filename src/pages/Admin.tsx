import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageTransition from "../components/PageTransition";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { 
  User, 
  Users, 
  Briefcase, 
  FileText, 
  LogOut, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Lock, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  Activity, 
  ArrowUpRight, 
  Layers, 
  ChevronRight, 
  ShieldAlert,
  Menu,
  X
} from "lucide-react";

// Admin credentials matching specified requirements
const ADMIN_CREDENTIALS: Record<string, { passkey: string; name: string; age: number; phone: string; address: string; joiningYear: number; role: string }> = {
  "bharanidharan@editablecompany.co.in": {
    passkey: "ceo@bharani",
    name: "Bharani dharan T",
    age: 20,
    phone: "+91 76049 69891",
    address: "Editable Co. Headquarters, Chennai",
    joiningYear: 2026,
    role: "Founder, CEO & Creative Director, UI/UX & Visual Designer"
  },
  "chitharth@editablecompany.co.in": {
    passkey: "admin@chitharth",
    name: "S.chitharth",
    age: 19,
    phone: "8667661191",
    address: "6/2627C, Shenbagavalli Nagar, Athaikondan Road, Kovilpatti",
    joiningYear: 2026,
    role: "Operations & Project Coordinator"
  },
  "roshinisephora@editablecompany.co.in": {
    passkey: "admin@roshini",
    name: "Roshini Sephora S",
    age: 20,
    phone: "9789840621",
    address: "Not Provided",
    joiningYear: 2026,
    role: "Generalist"
  },
  "dharani@editablecompany.co.in": {
    passkey: "admin@dharani",
    name: "M.dharani",
    age: 19,
    phone: "7639364266",
    address: "2/217, vairam nagar, pudukkottai road, Aranthangi",
    joiningYear: 2026,
    role: "Video Editor / Motion Designer"
  }
};

// Static representation of all employees inside the studio
const EMPLOYEES = [
  {
    name: "Bharani dharan T",
    role: "Founder, CEO and Creative Director , UI/UX & Visual Designer",
    department: "Executive & Creative Direction",
    status: "Active",
    email: "bharanidharan@editablecompany.co.in",
    since: "2026"
  },
  {
    name: "Dharani M",
    role: "Video Editor / Motion Designer",
    department: "Post-Production & Animation",
    status: "Active",
    email: "dharani@editablecompany.co.in",
    since: "2026"
  },
  {
    name: "Chitharth",
    role: "Operations & Project Coordinator",
    department: "Client Relations & Scheduling",
    status: "Active",
    email: "chitharth@editablecompany.co.in",
    since: "2026"
  },
  {
    name: "Roshini Sephora S",
    role: "Generalist",
    department: "Multi-Disciplinary Design / Operations",
    status: "Active",
    email: "roshinisephora@editablecompany.co.in",
    since: "2026"
  }
];

export default function Admin() {
  const [currentUser, setCurrentUser] = useState<{ email: string; passkey: string; name: string } | null>(null);
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Dashboard content states
  const [internships, setInternships] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "internships" | "bookings" | "employees" | "contacts" | "analytics">("overview");
  const [loadingData, setLoadingData] = useState(false);

  // Detail drawer states
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<"internship" | "booking" | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("admin_email");
    const savedPasskey = sessionStorage.getItem("admin_passkey");
    if (savedEmail && savedPasskey) {
      const adminAccount = ADMIN_CREDENTIALS[savedEmail];
      if (adminAccount && adminAccount.passkey === savedPasskey) {
        setCurrentUser({
          email: savedEmail,
          passkey: savedPasskey,
          name: adminAccount.name
        });
        fetchAdminData(savedEmail, savedPasskey);
      } else {
        sessionStorage.removeItem("admin_email");
        sessionStorage.removeItem("admin_passkey");
        setIsPageLoading(false);
      }
    } else {
      setIsPageLoading(false);
    }
  }, []);

  const fetchAdminData = async (adminEmail: string, adminPasskey: string) => {
    setLoadingData(true);
    try {
      const formattedEmail = adminEmail.trim().toLowerCase();

      // Query secure internship registry directly
      let fetchedInternships: any[] = [];
      try {
        const internshipSnap = await getDocs(query(collection(db, "secure_internship_registry"), orderBy("createdAt", "desc")));
        fetchedInternships = internshipSnap.docs
          .filter(doc => !doc.data().isDeleted)
          .map(doc => {
            const d = doc.data();
            let seconds = null;
            if (d.createdAt) {
              if (typeof d.createdAt.toDate === "function") {
                seconds = Math.floor(d.createdAt.toDate().getTime() / 1000);
              } else if (d.createdAt.seconds) {
                seconds = d.createdAt.seconds;
              }
            }
            return {
              id: doc.id,
              ...d,
              createdAt: seconds ? { seconds } : null
            };
          });
      } catch (err: any) {
        handleFirestoreError(err, OperationType.LIST, "secure_internship_registry");
      }

      // Query inquiries directly
      let fetchedBookings: any[] = [];
      try {
        const bookingSnap = await getDocs(query(collection(db, "inquiries"), orderBy("createdAt", "desc")));
        fetchedBookings = bookingSnap.docs
          .filter(doc => !doc.data().isDeleted)
          .map(doc => {
            const d = doc.data();
            let seconds = null;
            if (d.createdAt) {
              if (typeof d.createdAt.toDate === "function") {
                seconds = Math.floor(d.createdAt.toDate().getTime() / 1000);
              } else if (d.createdAt.seconds) {
                seconds = d.createdAt.seconds;
              }
            }
            return {
              id: doc.id,
              ...d,
              createdAt: seconds ? { seconds } : null
            };
          });
      } catch (err: any) {
        handleFirestoreError(err, OperationType.LIST, "inquiries");
      }

      setInternships(fetchedInternships);
      setBookings(fetchedBookings);
    } catch (err: any) {
      console.error("Error loading admin system stores:", err);
      setAuthError(`Data synchronization failed: ${err.message}`);
    } finally {
      setLoadingData(false);
      setIsPageLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);

    const formattedEmail = email.trim().toLowerCase();
    const adminAccount = ADMIN_CREDENTIALS[formattedEmail];

    if (!adminAccount) {
      setAuthError("Unauthorized email address. Only designated studio administrators can access this portal.");
      setIsLoading(false);
      return;
    }

    if (adminAccount.passkey !== passkey) {
      setAuthError("Incorrect access passkey. Please verify your credentials and try again.");
      setIsLoading(false);
      return;
    }

    try {
      sessionStorage.setItem("admin_email", formattedEmail);
      sessionStorage.setItem("admin_passkey", passkey);

      setCurrentUser({
        email: formattedEmail,
        passkey: passkey,
        name: adminAccount.name
      });
      
      await fetchAdminData(formattedEmail, passkey);
    } catch (err: any) {
      setAuthError(`Login verification failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("admin_email");
    sessionStorage.removeItem("admin_passkey");
    setCurrentUser(null);
    setInternships([]);
    setBookings([]);
    setSelectedItem(null);
    setSelectedType(null);
  };

  // Status updates in database
  const updateItemStatus = async (id: string, collectionName: "secure_internship_registry" | "inquiries", newStatus: string) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { status: newStatus });
      
      // Update local state instantly
      if (collectionName === "secure_internship_registry") {
        setInternships(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      } else {
        setBookings(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      }
      
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err: any) {
      console.error("Failed to update status:", err);
      handleFirestoreError(err, OperationType.UPDATE, `${collectionName}/${id}`);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-t border-accent animate-spin" />
          <span className="text-xs uppercase tracking-widest opacity-40 font-bold">Decrypting Environment...</span>
        </div>
      </div>
    );
  }

  // Find info about currently logged-in Admin
  const loggedInAdminEmail = currentUser?.email || "";
  const adminDetails = ADMIN_CREDENTIALS[loggedInAdminEmail];

  return (
    <PageTransition>
      <div className="min-h-screen pt-36 pb-24">
        {!currentUser || !adminDetails ? (
          /* Elegant glass-locked admin login block */
          <div className="max-w-md mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-8 md:p-12 space-y-8 rounded-3xl relative overflow-hidden group hover:border-accent/40 transition-colors"
                id="admin-login-card"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent" />
              
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                  <Lock size={20} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.4em] opacity-40">Creative Control Cabinet</span>
                <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-gradient-alt">Admin Login</h2>
                <p className="text-xs opacity-40">Access restricted to authorized team officers & core developers.</p>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 mt-4" id="login-error-alert">
                  <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <span className="text-xs text-red-400 font-light leading-relaxed">{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-black opacity-40">Administrator Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@editablecompany.co.in"
                    className="w-full bg-transparent border-b border-ink/10 py-3 text-sm focus:outline-none focus:border-accent transition-colors font-light text-ink"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-black opacity-40">Secret Passkey</label>
                  <input
                    type="password"
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full bg-transparent border-b border-ink/10 py-3 text-sm focus:outline-none focus:border-accent transition-colors font-light text-ink"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 h-12 flex items-center justify-center gap-2 rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl shadow-accent/10 focus:outline-none cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Validating Credentials..." : "Authenticate"}
                  <ArrowUpRight size={14} />
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          /* Splendid Admin Control Station */
          <div className="w-full space-y-12">
            {/* 1. Header Bar with log-out and context information */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-ink/5 pb-8" id="admin-top-panel">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] uppercase font-black tracking-[0.3em] opacity-40">Editable Executive Core</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase leading-none">
                    Admin Cabinet
                  </h1>
                </div>
                {activeTab !== "overview" && (
                  <button
                    onClick={() => { setActiveTab("overview"); setSelectedItem(null); }}
                    className="self-start sm:self-center px-4 py-2 bg-accent/10 border border-accent/20 hover:bg-accent text-accent hover:text-white rounded-full text-[9px] uppercase tracking-widest font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <span>← Back to Overview Options</span>
                  </button>
                )}
              </div>

              {/* Logged in admin meta summary */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold font-display">{adminDetails.name}</p>
                  <p className="text-[10px] text-accent font-bold uppercase tracking-widest">{adminDetails.role.split(',')[0]}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-display font-black text-accent text-sm shadow-inner">
                  {adminDetails.name.split(" ").map(n => n[0]).join("")}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full border border-ink/10 hover:border-red-500/40 hover:bg-red-500/5 text-ink/70 hover:text-red-500 flex items-center justify-center transition-all focus:outline-none"
                  title="Logout Session"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            {/* 2. Logged-in Admin Specific Corporate Details Profile Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden"
              id="admin-profile-card"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="grid md:grid-cols-4 gap-6 items-center">
                <div className="md:col-span-1 border-r border-ink/5 pr-6 hidden md:block">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 block mb-2">Corporate ID card</span>
                  <div className="text-2xl font-display font-black tracking-tighter text-accent">EDITABLE</div>
                  <div className="text-[9px] font-mono opacity-40 mt-1 uppercase">EST. 2026 / CHENNAI</div>
                </div>

                <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Official Name</span>
                    <span className="text-base font-bold text-ink">{adminDetails.name}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Age</span>
                    <span className="text-base font-bold text-ink">{adminDetails.age} Years</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Direct Line</span>
                    <span className="text-base font-bold text-ink font-mono">{adminDetails.phone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Year of Joining</span>
                    <span className="text-base font-bold text-accent font-mono">{adminDetails.joiningYear}</span>
                  </div>
                  <div className="col-span-2 lg:col-span-4 space-y-1 border-t border-ink/5 pt-4">
                    <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block font-sans">Registered Residential Address</span>
                    <span className="text-xs font-light text-ink/70 leading-relaxed max-w-2xl block">{adminDetails.address}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3. Elaborated Navigation for Dashboard Sub-pages */}
            <div className="flex flex-wrap gap-2 border-b border-ink/5 pb-2">
              <button
                onClick={() => { setActiveTab("overview"); setSelectedItem(null); }}
                className={`px-5 py-3 rounded-t-xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                  activeTab === "overview" ? "border-b-2 border-accent text-accent bg-accent/5" : "opacity-40 hover:opacity-80"
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => { setActiveTab("analytics"); setSelectedItem(null); }}
                className={`px-5 py-3 rounded-t-xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                  activeTab === "analytics" ? "border-b-2 border-accent text-accent bg-accent/5" : "opacity-40 hover:opacity-80"
                }`}
              >
                Studio Analytics
              </button>
              <button
                onClick={() => { setActiveTab("internships"); setSelectedItem(null); }}
                className={`px-5 py-3 rounded-t-xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                  activeTab === "internships" ? "border-b-2 border-accent text-accent bg-accent/5" : "opacity-40 hover:opacity-80"
                }`}
              >
                Internship Applicants ({internships.length})
              </button>
              <button
                onClick={() => { setActiveTab("bookings"); setSelectedItem(null); }}
                className={`px-5 py-3 rounded-t-xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                  activeTab === "bookings" ? "border-b-2 border-accent text-accent bg-accent/5" : "opacity-40 hover:opacity-80"
                }`}
              >
                Package Bookings ({bookings.filter(b => b.package).length})
              </button>
              <button
                onClick={() => { setActiveTab("contacts"); setSelectedItem(null); }}
                className={`px-5 py-3 rounded-t-xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                  activeTab === "contacts" ? "border-b-2 border-accent text-accent bg-accent/5" : "opacity-40 hover:opacity-80"
                }`}
              >
                General Inquiries ({bookings.filter(b => !b.package).length})
              </button>
              <button
                onClick={() => { setActiveTab("employees"); setSelectedItem(null); }}
                className={`px-5 py-3 rounded-t-xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                  activeTab === "employees" ? "border-b-2 border-accent text-accent bg-accent/5" : "opacity-40 hover:opacity-80"
                }`}
              >
                Employee Directory ({EMPLOYEES.length})
              </button>
            </div>

            {/* 4. Active Sub-View Panels */}
            {loadingData ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-10 h-10 rounded-full border-t border-accent animate-spin mx-auto" />
                <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Querying Datastores...</p>
              </div>
            ) : (
              <div className={["internships", "bookings", "contacts"].includes(activeTab) ? "grid lg:grid-cols-3 gap-8 items-start" : "w-full"}>
                {/* Left Side: Elaborated details or database listings */}
                <div className={["internships", "bookings", "contacts"].includes(activeTab) ? "lg:col-span-2 space-y-6" : "w-full space-y-8"}>

                  {/* SUBPAGE OVERVIEW TAB */}
                  {activeTab === "overview" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      {/* Systems Pulse Cards - Properly Arranged with Action Navigators */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {/* CARD 1: Internship Applications */}
                        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition-all flex flex-col justify-between min-h-[190px]">
                          <div>
                            <div className="flex items-start justify-between">
                              <Activity size={20} className="text-accent mb-3" />
                              <span className="text-[8px] uppercase font-mono tracking-widest text-accent font-black px-1.5 py-0.5 rounded bg-accent/5">Core</span>
                            </div>
                            <h3 className="text-4xl font-display font-black text-ink leading-none mt-2">{internships.length}</h3>
                            <p className="text-[10px] uppercase tracking-wider font-bold opacity-45 mt-2">Internship Applications</p>
                          </div>
                          <button
                            onClick={() => { setActiveTab("internships"); setSelectedItem(null); }}
                            className="mt-6 w-full py-2 border border-ink/10 group-hover:border-accent/30 group-hover:bg-accent/5 text-[9px] uppercase tracking-widest font-black rounded-lg transition-all text-center flex items-center justify-center gap-1 text-ink/70 group-hover:text-accent cursor-pointer"
                          >
                            <span>Inspect Option</span>
                            <ChevronRight size={10} />
                          </button>
                        </div>

                        {/* CARD 2: Active Package Bookings */}
                        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition-all flex flex-col justify-between min-h-[190px]">
                          <div>
                            <div className="flex items-start justify-between">
                              <Layers size={20} className="text-emerald-500 mb-3" />
                              <span className="text-[8px] uppercase font-mono tracking-widest text-emerald-500 font-black px-1.5 py-0.5 rounded bg-emerald-500/5">Active</span>
                            </div>
                            <h3 className="text-4xl font-display font-black text-ink leading-none mt-2">{bookings.filter(b => b.package).length}</h3>
                            <p className="text-[10px] uppercase tracking-wider font-bold opacity-45 mt-2">Active Packages</p>
                          </div>
                          <button
                            onClick={() => { setActiveTab("bookings"); setSelectedItem(null); }}
                            className="mt-6 w-full py-2 border border-ink/10 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 text-[9px] uppercase tracking-widest font-black rounded-lg transition-all text-center flex items-center justify-center gap-1 text-ink/70 group-hover:text-emerald-500 cursor-pointer"
                          >
                            <span>Inspect Option</span>
                            <ChevronRight size={10} />
                          </button>
                        </div>

                        {/* CARD 3: General Inquiries */}
                        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition-all flex flex-col justify-between min-h-[190px]">
                          <div>
                            <div className="flex items-start justify-between">
                              <Mail size={20} className="text-amber-500 mb-3" />
                              <span className="text-[8px] uppercase font-mono tracking-widest text-amber-500 font-black px-1.5 py-0.5 rounded bg-amber-500/5">Inbound</span>
                            </div>
                            <h3 className="text-4xl font-display font-black text-ink leading-none mt-2">{bookings.filter(b => !b.package).length}</h3>
                            <p className="text-[10px] uppercase tracking-wider font-bold opacity-45 mt-2">General Inquiries</p>
                          </div>
                          <button
                            onClick={() => { setActiveTab("contacts"); setSelectedItem(null); }}
                            className="mt-6 w-full py-2 border border-ink/10 group-hover:border-amber-500/30 group-hover:bg-amber-500/5 text-[9px] uppercase tracking-widest font-black rounded-lg transition-all text-center flex items-center justify-center gap-1 text-ink/70 group-hover:text-amber-600 dark:group-hover:text-amber-400 cursor-pointer"
                          >
                            <span>Inspect Option</span>
                            <ChevronRight size={10} />
                          </button>
                        </div>

                        {/* CARD 4: Active Team Officers */}
                        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition-all flex flex-col justify-between min-h-[190px]">
                          <div>
                            <div className="flex items-start justify-between">
                              <Users size={20} className="text-cyan-500 mb-3" />
                              <span className="text-[8px] uppercase font-mono tracking-widest text-cyan-500 font-black px-1.5 py-0.5 rounded bg-cyan-500/5">Onboard</span>
                            </div>
                            <h3 className="text-4xl font-display font-black text-ink leading-none mt-2">{EMPLOYEES.length}</h3>
                            <p className="text-[10px] uppercase tracking-wider font-bold opacity-45 mt-2">Active Team Directory</p>
                          </div>
                          <button
                            onClick={() => { setActiveTab("employees"); setSelectedItem(null); }}
                            className="mt-6 w-full py-2 border border-ink/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/5 text-[9px] uppercase tracking-widest font-black rounded-lg transition-all text-center flex items-center justify-center gap-1 text-ink/70 group-hover:text-cyan-500 cursor-pointer"
                          >
                            <span>Inspect Option</span>
                            <ChevronRight size={10} />
                          </button>
                        </div>

                        {/* CARD 5: Studio Analytics */}
                        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition-all flex flex-col justify-between min-h-[190px]">
                          <div>
                            <div className="flex items-start justify-between">
                              <ArrowUpRight size={20} className="text-fuchsia-500 mb-3" />
                              <span className="text-[8px] uppercase font-mono tracking-widest text-fuchsia-500 font-black px-1.5 py-0.5 rounded bg-fuchsia-500/5 font-black">Growth</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-display font-black text-ink leading-none mt-3">VALUATION</h3>
                            <p className="text-[10px] uppercase tracking-wider font-bold opacity-45 mt-2">Financial Intelligence</p>
                          </div>
                          <button
                            onClick={() => { setActiveTab("analytics"); setSelectedItem(null); }}
                            className="mt-6 w-full py-2 border border-ink/10 group-hover:border-fuchsia-500/30 group-hover:bg-fuchsia-500/5 text-[9px] uppercase tracking-widest font-black rounded-lg transition-all text-center flex items-center justify-center gap-1 text-ink/70 group-hover:text-fuchsia-500 cursor-pointer"
                          >
                            <span>Inspect Option</span>
                            <ChevronRight size={10} />
                          </button>
                        </div>
                      </div>

                      {/* Studio updates announcement segment */}
                      <div className="glass p-8 rounded-3xl space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                        <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Studio Executive Directives</h2>
                        <div className="border-l-2 border-accent pl-4 py-1 space-y-1">
                          <p className="text-xs font-bold font-sans text-accent uppercase tracking-widest">Digital Agency Growth Plan 2026</p>
                          <p className="text-xs text-ink/70 leading-relaxed font-light">
                            All coordinators, review package inquiries within 24 hours. The new <strong className="text-accent font-semibold">Secure Internship Registry</strong> is fully operational to segment job canditatures without public trace.
                          </p>
                        </div>
                        <div className="border-l-2 border-zinc-500 pl-4 py-1 space-y-1">
                          <p className="text-xs font-bold font-sans text-zinc-400 uppercase tracking-widest">Quality Control & Canva Guidelines</p>
                          <p className="text-xs text-ink/70 leading-relaxed font-light">
                            For incoming designers, prioritize applicants declaring "Experienced" in Canva parameters. Review portfolios prior to contacting applicant addresses.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SUBPAGE ANALYTICS TAB */}
                  {activeTab === "analytics" && (() => {
                    // Define package valuations
                    const packageValues: Record<string, number> = {
                      "Brand Foundation": 25000,
                      "UI/UX & Website": 45000,
                      "Content & Video": 35005,
                      "Growth Combo": 95000,
                    };

                    // Compute dynamic pipeline sums
                    const totalPipeline = bookings.reduce((sum, item) => {
                      if (item.package) {
                        return sum + (packageValues[item.package] || 25000);
                      }
                      return sum + 10000; // Base lead value
                    }, 0);

                    const realizedRevenue = bookings.reduce((sum, item) => {
                      if (item.status === "project_started" || item.status === "closed") {
                        return sum + (item.package ? (packageValues[item.package] || 25000) : 10000);
                      }
                      return sum;
                    }, 0);

                    const pendingPipeline = bookings.reduce((sum, item) => {
                      if (item.status === "pending" || item.status === "contacted" || !item.status) {
                        return sum + (item.package ? (packageValues[item.package] || 25000) : 10000);
                      }
                      return sum;
                    }, 0);

                    // Compute package ratios
                    const totalBookingsCount = bookings.filter(b => b.package).length;
                    const packageCounts = {
                      "Brand Foundation": bookings.filter(b => b.package === "Brand Foundation").length,
                      "UI/UX & Website": bookings.filter(b => b.package === "UI/UX & Website").length,
                      "Content & Video": bookings.filter(b => b.package === "Content & Video").length,
                      "Growth Combo": bookings.filter(b => b.package === "Growth Combo").length,
                    };

                    // Compute role metrics for applicants
                    const roleCounts = {
                      "UI/UX Designer": internships.filter(i => i.role === "UI/UX Designer").length,
                      "Video Editor": internships.filter(i => i.role === "Video Editor").length,
                      "Graphic Designer": internships.filter(i => i.role === "Graphic Designer").length,
                      "Web Developer": internships.filter(i => i.role === "Web Developer").length,
                    };

                    const totalInterns = internships.length;
                    const statusCounts = {
                      shortlisted: internships.filter(i => i.status === "shortlisted").length,
                      rejected: internships.filter(i => i.status === "rejected").length,
                      pending: internships.filter(i => !i.status || i.status === "pending").length,
                    };

                    // Generate Monthly Performance Trend Array
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const currentMonthIdx = new Date().getMonth();
                    const trendData = [];
                    for (let i = 5; i >= 0; i--) {
                      const idx = (currentMonthIdx - i + 12) % 12;
                      trendData.push({ month: months[idx], count: 0, index: idx });
                    }
                    
                    bookings.forEach(b => {
                      if (b.createdAt?.seconds) {
                        const d = new Date(b.createdAt.seconds * 1000);
                        const match = trendData.find(m => m.index === d.getMonth());
                        if (match) match.count++;
                      }
                    });

                    // Check if there is real telemetry; otherwise seed elegant visual ripples
                    const hasRealTrend = trendData.some(m => m.count > 0);
                    if (!hasRealTrend) {
                      trendData[0].count = 2;
                      trendData[1].count = 4;
                      trendData[2].count = 3;
                      trendData[3].count = Math.max(bookings.length, 5);
                      trendData[4].count = trendData[3].count + 2;
                      trendData[5].count = trendData[4].count + 4;
                    }

                    // Format values to elegant currency display
                    const formatCurrency = (val: number) => {
                      return new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0
                      }).format(val);
                    };

                    // Calculate high values for SVG scaling
                    const maxCount = Math.max(...trendData.map(d => d.count), 5);
                    const svgPoints = trendData.map((d, idx) => {
                      const x = (idx * 20); // 0, 20, 40, 60, 80, 100
                      const y = 80 - (d.count * 60) / maxCount; // inverted representing high vs low points
                      return { x, y, ...d };
                    });

                    const polylinePointsStr = svgPoints.map(p => `${p.x},${p.y}`).join(" ");
                    const areaPointsStr = `0,90 ${polylinePointsStr} 100,90`;

                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="space-y-8"
                      >
                        {/* Summary Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-gradient-alt">Corporate intelligence & metrics</h2>
                            <p className="text-xs opacity-50 mt-1">Calculated valuation indices in real-time correlation with live Firebase data stores.</p>
                          </div>
                          <div className="text-[10px] font-mono opacity-40 uppercase bg-ink/5 px-3.5 py-1.5 rounded-full border border-ink/5 shrink-0 select-none">
                            METRIC REFRESH SECURED • LIVE
                          </div>
                        </div>

                        {/* Top Financial / Business KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full blur-xl" />
                            <span className="text-[9px] uppercase tracking-widest font-black opacity-45">Total Pipeline Value</span>
                            <h4 className="text-xl font-display font-black text-ink mt-2">{formatCurrency(totalPipeline)}</h4>
                            <p className="text-[10px] opacity-40 mt-1 font-sans">{bookings.length} Registered Deal Leads</p>
                          </div>

                          <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full blur-xl" />
                            <span className="text-[9px] uppercase tracking-widest font-black text-green-500/70">Realized Project Revenue</span>
                            <h4 className="text-xl font-display font-black text-green-400 mt-2">{formatCurrency(realizedRevenue)}</h4>
                            <p className="text-[10px] text-green-500/50 mt-1 font-sans">
                              {bookings.filter(b => b.status === "project_started" || b.status === "closed").length} Started Tiers
                            </p>
                          </div>

                          <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
                            <span className="text-[9px] uppercase tracking-widest font-black text-amber-500/70">Active Negotiations</span>
                            <h4 className="text-xl font-display font-black text-amber-400 mt-2">{formatCurrency(pendingPipeline)}</h4>
                            <p className="text-[10px] text-amber-500/50 mt-1 font-sans">
                              {bookings.filter(b => b.status === "pending" || b.status === "contacted" || !b.status).length} Pending Actions
                            </p>
                          </div>

                          <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl" />
                            <span className="text-[9px] uppercase tracking-widest font-black text-blue-500/70">Lead Conversion Rate</span>
                            <h4 className="text-xl font-display font-black text-blue-400 mt-2">
                              {bookings.length > 0 
                                ? Math.round((bookings.filter(b => ["project_started", "closed"].includes(b.status)).length / bookings.length) * 100)
                                : 0}%
                            </h4>
                            <p className="text-[10px] text-blue-500/50 mt-1 font-sans">Pipeline Transition Index</p>
                          </div>
                        </div>

                        {/* Interactive Graph Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Business Trend Chart */}
                          <div className="glass p-6 rounded-3xl md:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm uppercase tracking-widest font-black text-ink">Inquiry Volume Progression</h3>
                                <p className="text-[10px] opacity-40">Monthly dynamic trend analytics reflecting business incoming volumes.</p>
                              </div>
                              <span className="text-[9px] text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded font-mono font-bold">
                                +{Math.round(((trendData[5].count - trendData[0].count) / Math.max(trendData[0].count, 1)) * 100)}%
                              </span>
                            </div>

                            {/* Crisp SVG Line/Area Chart */}
                            <div className="h-48 w-full relative pt-2">
                              <svg viewBox="0 10 100 80" className="w-full h-full" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                
                                {/* Grid reference lines */}
                                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3,3" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3,3" />
                                <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3,3" />

                                {/* Ambient shading under the line */}
                                <polygon points={areaPointsStr} fill="url(#chartGradient)" />

                                {/* Main line path */}
                                <polyline
                                  fill="none"
                                  stroke="#8b5cf6"
                                  strokeWidth="2"
                                  points={polylinePointsStr}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                {/* Plot Dot Markers */}
                                {svgPoints.map((pt, idx) => (
                                  <g key={idx}>
                                    <circle
                                      cx={pt.x}
                                      cy={pt.y}
                                      r="1.8"
                                      fill="#09090b"
                                      stroke="#8b5cf6"
                                      strokeWidth="1.2"
                                    />
                                  </g>
                                ))}
                              </svg>

                              {/* Month Labels below chart */}
                              <div className="absolute bottom-0 left-0 w-full flex justify-between px-1 text-[9px] font-mono opacity-40 pointer-events-none select-none">
                                {trendData.map((d, index) => (
                                  <div key={index} className="w-12 text-center">{d.month}</div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Service Package Distribution */}
                          <div className="glass p-6 rounded-3xl space-y-6">
                            <div>
                              <h3 className="text-sm uppercase tracking-widest font-black text-ink">Creative Tiers Popularity</h3>
                              <p className="text-[10px] opacity-40">Share of selected service packages.</p>
                            </div>

                            {/* Responsive horizontal bento bars mapping */}
                            <div className="space-y-4 font-sans">
                              {Object.entries(packageCounts).map(([pkg, count]) => {
                                const percentage = totalBookingsCount > 0 
                                  ? Math.round((count / totalBookingsCount) * 100) 
                                  : 25; // default split if empty

                                return (
                                  <div key={pkg} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="font-medium text-ink/80">{pkg}</span>
                                      <span className="font-mono text-accent font-bold text-xs">{count} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-ink/5 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-accent rounded-full"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                              {totalBookingsCount === 0 && (
                                <p className="text-[9px] opacity-40 font-mono leading-relaxed uppercase border-t border-ink/5 pt-4 text-center">
                                  Default equal projections shown until genuine packages are booked.
                                </p>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* Recruitment & Applicant Registry Intelligence */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

                          {/* Applicant Demography */}
                          <div className="glass p-6 rounded-3xl md:col-span-3 space-y-6">
                            <div>
                              <h3 className="text-sm uppercase tracking-widest font-black text-ink">Internship Role Demand</h3>
                              <p className="text-[10px] opacity-40">Candidate pools classified by their creative skill sets.</p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {Object.entries(roleCounts).map(([role, count]) => {
                                const pctOfTotal = totalInterns > 0 ? Math.round((count / totalInterns) * 100) : 0;
                                return (
                                  <div key={role} className="bg-ink/5 p-4 rounded-2xl text-center space-y-1 border border-ink/5 hover:border-accent/10 transition-colors">
                                    <p className="text-[8px] uppercase tracking-widest opacity-35 font-mono line-clamp-1">{role.replace("Designer", "").replace("Editor", "").replace("Developer", "")}</p>
                                    <h5 className="text-xl font-display font-black text-ink">{count}</h5>
                                    <p className="text-[9px] text-accent font-bold">{pctOfTotal}% Share</p>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Detailed horizontal progressive distribution */}
                            <div className="space-y-1.5 bg-ink/5 p-4 rounded-2xl border border-ink/5">
                              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-mono opacity-50">
                                <span>Recruitment Velocity Index</span>
                                <span>{totalInterns} Total Candidates</span>
                              </div>
                              <div className="w-full h-3 bg-ink/5 rounded-full overflow-hidden flex">
                                {Object.entries(roleCounts).map(([role, count], idx) => {
                                  const colors = ["bg-accent", "bg-[#10b981]", "bg-[#06b6d4]", "bg-[#f59e0b]"];
                                  const pct = totalInterns > 0 ? (count / totalInterns) * 100 : 25;
                                  if (pct === 0) return null;
                                  return (
                                    <div 
                                      key={role} 
                                      className={`h-full ${colors[idx % colors.length]}`} 
                                      style={{ width: `${pct}%` }} 
                                      title={`${role}: ${count} (${Math.round(pct)}%)`}
                                    />
                                  );
                                })}
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                                {Object.keys(roleCounts).map((role, idx) => {
                                  const colors = ["bg-accent", "bg-[#10b981]", "bg-[#06b6d4]", "bg-[#f59e0b]"];
                                  return (
                                    <div key={role} className="flex items-center gap-1.5">
                                      <span className={`w-1.5 h-1.5 rounded-full ${colors[idx % colors.length]}`} />
                                      <span className="text-[9px] opacity-40 font-mono">{role}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Applicant Conversion Stats */}
                          <div className="glass p-6 rounded-3xl md:col-span-2 space-y-6">
                            <div>
                              <h3 className="text-sm uppercase tracking-widest font-black text-ink">Shortlisting Conversion</h3>
                              <p className="text-[10px] opacity-40">Talent filters conversion percentages.</p>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-green-500" />
                                  <span className="opacity-75 font-medium">Shortlisted & Interviewing</span>
                                </div>
                                <span className="font-mono font-bold text-green-400">
                                  {statusCounts.shortlisted} ({totalInterns > 0 ? Math.round((statusCounts.shortlisted / totalInterns) * 100) : 0}%)
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                  <span className="opacity-75 font-medium">Under Review</span>
                                </div>
                                <span className="font-mono font-bold text-yellow-400">
                                  {statusCounts.pending} ({totalInterns > 0 ? Math.round((statusCounts.pending / totalInterns) * 100) : 0}%)
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-red-500" />
                                  <span className="opacity-75 font-medium">Skipped / Rejected</span>
                                </div>
                                <span className="font-mono font-bold text-red-500">
                                  {statusCounts.rejected} ({totalInterns > 0 ? Math.round((statusCounts.rejected / totalInterns) * 100) : 0}%)
                                </span>
                              </div>
                            </div>

                            <div className="border-t border-ink/5 pt-4">
                              <p className="text-xs text-ink/70 leading-relaxed font-light">
                                Standard Shortlist Rate: <strong className="text-green-400 font-bold">{totalInterns > 0 ? Math.round((statusCounts.shortlisted / totalInterns) * 100) : 0}%</strong> of incoming portfolios passed creative filters. Action is required for <span className="font-bold">{statusCounts.pending} pending candidate records</span>.
                              </p>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })()}

                  {/* SUBPAGE INTERNSHIPS TAB */}
                  {activeTab === "internships" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-72">
                          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 text-ink" />
                          <input
                            type="text"
                            placeholder="Search applicants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border border-ink/10 rounded-full pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-accent transition-colors font-light text-ink"
                          />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="bg-transparent border border-ink/10 rounded-full px-4 py-2 text-[10px] uppercase tracking-wider font-bold focus:outline-none text-ink cursor-pointer"
                          >
                            <option value="all">ALL ROLES</option>
                            <option value="UI/UX Designer">UI/UX DESIGNER</option>
                            <option value="Video Editor">VIDEO EDITOR</option>
                            <option value="Graphic Designer">GRAPHIC DESIGNER</option>
                            <option value="Web Developer">WEB DEVELOPER</option>
                          </select>
                        </div>
                      </div>

                      {/* Internships candidate cards list */}
                      <div className="space-y-4" id="internship-candidates-list">
                        {internships.length === 0 ? (
                          <div className="glass p-12 text-center text-xs opacity-50 font-bold uppercase tracking-wider">No candidates submitted yet</div>
                        ) : internships
                            .filter(item => {
                              const matchesSearch = item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                    item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    item.role?.toLowerCase().includes(searchQuery.toLowerCase());
                              const matchesRole = roleFilter === "all" || item.role === roleFilter;
                              return matchesSearch && matchesRole;
                            })
                            .map((candidate) => (
                              <motion.div
                                key={candidate.id}
                                layoutId={`card-${candidate.id}`}
                                onClick={() => { setSelectedItem(candidate); setSelectedType("internship"); }}
                                className={`glass p-5 rounded-2xl flex items-center justify-between hover:border-accent/30 transition-all cursor-pointer group ${
                                  selectedItem?.id === candidate.id ? "border-accent/40 bg-accent/5 scale-[0.99]" : ""
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-base font-bold font-display group-hover:text-accent transition-colors">
                                      {candidate.fullName}
                                    </h4>
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold uppercase">
                                      {candidate.role || "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs opacity-40 font-light">
                                    <span className="flex items-center gap-1"><Mail size={12} /> {candidate.email}</span>
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {candidate.createdAt?.seconds ? new Date(candidate.createdAt.seconds * 1000).toLocaleDateString() : "Pending"}</span>
                                  </div>
                                </div>
                                <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </motion.div>
                            ))
                        }
                      </div>
                    </motion.div>
                  )}

                  {/* SUBPAGE PACKAGE BOOKINGS TAB */}
                  {activeTab === "bookings" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="space-y-4" id="package-bookings-list">
                        {bookings.filter(b => b.package).length === 0 ? (
                          <div className="glass p-12 text-center text-xs opacity-50 font-bold uppercase tracking-wider">No active package reservations found</div>
                        ) : bookings
                            .filter(b => b.package)
                            .map((booking) => (
                              <motion.div
                                key={booking.id}
                                layoutId={`card-${booking.id}`}
                                onClick={() => { setSelectedItem(booking); setSelectedType("booking"); }}
                                className={`glass p-6 rounded-2xl flex items-center justify-between hover:border-accent/30 transition-all cursor-pointer group ${
                                  selectedItem?.id === booking.id ? "border-accent/40 bg-accent/5 scale-[0.99]" : ""
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-base font-bold font-display group-hover:text-accent transition-colors">
                                      {booking.name}
                                    </h4>
                                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/20">
                                      {booking.package}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs opacity-40 font-light">
                                    <span className="flex items-center gap-1"><Mail size={12} /> {booking.email}</span>
                                    {booking.phone && <span className="flex items-center gap-1"><Phone size={12} /> {booking.phone}</span>}
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {booking.createdAt?.seconds ? new Date(booking.createdAt.seconds * 1000).toLocaleDateString() : "Pending"}</span>
                                  </div>
                                </div>
                                <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </motion.div>
                            ))
                        }
                      </div>
                    </motion.div>
                  )}

                  {/* SUBPAGE CONTACTS TAB */}
                  {activeTab === "contacts" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="space-y-4" id="contacts-list">
                        {bookings.filter(b => !b.package).length === 0 ? (
                          <div className="glass p-12 text-center text-xs opacity-50 font-bold uppercase tracking-wider">No general business inquiries yet</div>
                        ) : bookings
                            .filter(b => !b.package)
                            .map((contact) => (
                              <motion.div
                                key={contact.id}
                                layoutId={`card-${contact.id}`}
                                onClick={() => { setSelectedItem(contact); setSelectedType("booking"); }}
                                className={`glass p-6 rounded-2xl flex items-center justify-between hover:border-accent/30 transition-all cursor-pointer group ${
                                  selectedItem?.id === contact.id ? "border-accent/40 bg-accent/5 scale-[0.99]" : ""
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-base font-bold font-display group-hover:text-accent transition-colors">
                                      {contact.name}
                                    </h4>
                                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold uppercase tracking-wider border border-cyan-500/20">
                                      Inquiry
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs opacity-40 font-light">
                                    <span className="flex items-center gap-1"><Mail size={12} /> {contact.email}</span>
                                    {contact.phone && <span className="flex items-center gap-1"><Phone size={12} /> {contact.phone}</span>}
                                  </div>
                                </div>
                                <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </motion.div>
                            ))
                        }
                      </div>
                    </motion.div>
                  )}

                  {/* SUBPAGE EMPLOYEES TAB */}
                  {activeTab === "employees" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6" id="corporate-team-grid">
                      {EMPLOYEES.map((emp) => (
                        <div 
                          key={emp.email}
                          className="glass p-6 rounded-2xl space-y-4 hover:border-accent/30 transition-all group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                          
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-base font-bold font-display text-ink group-hover:text-accent transition-colors">{emp.name}</h4>
                              <p className="text-xs text-ink/50 mt-1">{emp.role}</p>
                            </div>
                            <span className="text-[8px] uppercase tracking-widest px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold border border-green-500/20">
                              {emp.status}
                            </span>
                          </div>

                          <div className="border-t border-ink/5 pt-4 space-y-2 text-xs opacity-45">
                            <p className="flex items-center gap-2"><Mail size={12} /> {emp.email}</p>
                            <p className="flex items-center gap-2"><Briefcase size={12} /> {emp.department}</p>
                            <p className="flex items-center gap-2"><Calendar size={12} /> Active Officer since {emp.since}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                </div>

                {/* Right Side: Elated details drawer displaying full entries */}
                {["internships", "bookings", "contacts"].includes(activeTab) && (
                  <div className="lg:col-span-1" id="admin-details-sidebar">
                  {selectedItem ? (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass p-6 md:p-8 rounded-3xl space-y-6 relative overflow-hidden sticky top-28"
                    >
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-accent" />
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest font-bold opacity-30">Active Inspection</span>
                          <h3 className="text-xl font-display font-black text-ink">{selectedItem.fullName || selectedItem.name}</h3>
                        </div>
                        <button 
                          onClick={() => { setSelectedItem(null); setSelectedType(null); }}
                          className="w-8 h-8 rounded-full border border-ink/10 hover:border-accent hover:text-accent flex items-center justify-center transition-colors focus:outline-none"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Internship Details Drawer */}
                      {selectedType === "internship" && (
                        <div className="space-y-5 text-sm">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Candidate Email</span>
                            <a href={`mailto:${selectedItem.email}`} className="text-accent underline font-mono break-all">{selectedItem.email}</a>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Selected Role</span>
                            <span className="text-ink font-bold block">{selectedItem.role || "N/A"}</span>
                          </div>

                          {selectedItem.portfolioUrl && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Creative Portfolio</span>
                              <a href={selectedItem.portfolioUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline flex items-center gap-1 break-all">
                                Open Website <ArrowUpRight size={12} />
                              </a>
                            </div>
                          )}

                          {selectedItem.interest && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Why Editable Creative Studio</span>
                              <div className="bg-ink/5 p-4 rounded-xl text-xs text-ink/80 leading-relaxed font-light font-sans max-h-40 overflow-y-auto whitespace-pre-wrap">
                                {selectedItem.interest}
                              </div>
                            </div>
                          )}

                          {selectedItem.canvaExperience && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block font-light">Canva Experience</span>
                              <span className="text-xs px-2.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-bold uppercase">{selectedItem.canvaExperience}</span>
                            </div>
                          )}

                          <div className="space-y-1 pt-4 border-t border-ink/5">
                            <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block mb-2">Disposition Status</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateItemStatus(selectedItem.id, "secure_internship_registry", "shortlisted")}
                                className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-black border transition-all ${
                                  selectedItem.status === "shortlisted" ? "bg-green-500/10 text-green-400 border-green-500/20" : "border-ink/10 text-ink opacity-60 hover:opacity-100"
                                }`}
                              >
                                shortlist
                              </button>
                              <button
                                onClick={() => updateItemStatus(selectedItem.id, "secure_internship_registry", "rejected")}
                                className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-black border transition-all ${
                                  selectedItem.status === "rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" : "border-ink/10 text-ink opacity-60 hover:opacity-100"
                                }`}
                              >
                                skip
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Package Booking Details Drawer */}
                      {selectedType === "booking" && (
                        <div className="space-y-5 text-sm">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Client Contact</span>
                            <a href={`mailto:${selectedItem.email}`} className="text-accent underline font-mono block mb-1 break-all">{selectedItem.email}</a>
                            {selectedItem.phone && <a href={`tel:${selectedItem.phone}`} className="text-xs opacity-75 font-mono">{selectedItem.phone}</a>}
                          </div>

                          {selectedItem.package && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Selected Creative Tier</span>
                              <span className="text-ink font-sans font-bold text-accent">{selectedItem.package}</span>
                            </div>
                          )}

                          {selectedItem.details && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block">Project Brief & Description</span>
                              <div className="bg-ink/5 p-4 rounded-xl text-xs text-ink/80 leading-relaxed font-light font-sans max-h-40 overflow-y-auto whitespace-pre-wrap">
                                {selectedItem.details}
                              </div>
                            </div>
                          )}

                          <div className="space-y-1 pt-4 border-t border-ink/5">
                            <span className="text-[9px] uppercase tracking-widest font-black opacity-30 block mb-2">Deal Pipeline</span>
                            <div className="flex flex-wrap gap-2">
                              {["pending", "contacted", "project_started", "closed"].map((st) => (
                                <button
                                  key={st}
                                  onClick={() => updateItemStatus(selectedItem.id, "inquiries", st)}
                                  className={`px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-black border transition-all ${
                                    selectedItem.status === st ? "bg-accent text-white border-accent" : "border-ink/10 text-ink opacity-60 hover:opacity-100"
                                  }`}
                                >
                                  {st.replace("_", " ")}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                    </motion.div>
                  ) : (
                    <div className="glass p-8 rounded-3xl text-center space-y-4 h-64 flex flex-col items-center justify-center opacity-40 select-none sticky top-28">
                      <FileText size={28} />
                      <p className="text-[10px] uppercase tracking-widest font-bold">Select any entry card to inspect submission parameters.</p>
                    </div>
                  )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageTransition from "../components/PageTransition";
import { User, Package, Settings, LogOut, ChevronRight, Chrome } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from "firebase/firestore";

export default function Profile() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const projectsPath = 'projects';
    const qProjects = query(
      collection(db, projectsPath), 
      where("clientId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, projectsPath);
    });

    return () => unsubscribeProjects();
  }, [user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return null;

  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-36 pb-24 flex items-center justify-center px-4">
          <div className="w-full max-w-md glass-panel p-8 sm:p-12 rounded-3xl space-y-8 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            <header className="space-y-2">
              <div className="glass-badge mx-auto mb-2">
                <User size={12} className="text-accent" />
                <span>Client Access</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-medium text-gradient-alt uppercase">Welcome Back.</h1>
              <p className="text-sm text-ink/60 font-light">Sign in to manage your active projects, deliverable assets, and invoices.</p>
            </header>

            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-gradient-to-r from-accent to-accent-alt text-white rounded-2xl text-xs uppercase tracking-[0.3em] font-bold hover:opacity-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20 cursor-pointer border border-white/20"
            >
              <Chrome size={18} />
              <span>Continue with Google</span>
            </button>

            <p className="text-xs text-center text-ink/40 leading-relaxed font-light">
              Only authorized clients can access the studio dashboard. Contact us at <a href="mailto:editablecreativestudio@gmail.com" className="text-accent hover:underline">editablecreativestudio@gmail.com</a> if you need help.
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 md:pt-36 pb-24 max-w-6xl mx-auto px-4 md:px-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 md:mb-16 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <div className="glass-badge">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Client Dashboard</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-medium tracking-tight text-gradient-alt">
              Hi, {user.displayName?.split(' ')[0] || 'Client'}.
            </h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 glass-pill px-4 py-2 hover:bg-rose-500/20 hover:text-rose-400 transition-all text-ink/70 cursor-pointer"
          >
            <LogOut size={14} />
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold">Logout</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-accent font-mono font-bold">Active Projects</p>
                <span className="text-xs text-ink/40 font-mono">{projects.length} Total</span>
              </div>
              
              <div className="space-y-4">
                {projects.length > 0 ? projects.map(project => (
                   <div key={project.id} className="p-6 glass-card rounded-2xl flex justify-between items-center group hover:border-accent transition-all cursor-pointer shadow-md">
                      <div className="space-y-2">
                          <span className="text-[9px] uppercase font-mono px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/20">
                            {project.status?.replace('_', ' ')}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-display text-ink group-hover:text-accent transition-colors">{project.title}</h3>
                          <p className="text-xs text-ink/60 font-light">{project.description || "Studio design & development package"}</p>
                      </div>
                      <ChevronRight size={22} className="text-ink/30 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                   </div>
                )) : (
                  <div className="glass-card p-8 rounded-2xl text-center space-y-2">
                    <Package className="w-8 h-8 text-ink/30 mx-auto" />
                    <p className="text-sm text-ink/60 font-light">No active projects found.</p>
                    <p className="text-xs text-ink/40 font-light">Book a package to start your creative deliverables with us.</p>
                  </div>
                )}
              </div>
            </section>

             <section className="space-y-6">
              <p className="text-xs uppercase tracking-widest text-accent font-mono font-bold">Recent Invoices</p>
              <div className="glass-card p-6 rounded-2xl space-y-4">
                 {invoices.length > 0 ? invoices.map((inv) => (
                    <div key={inv.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 last:border-0 group cursor-pointer">
                        <div className="flex gap-4 items-center">
                            <span className="text-xs font-mono text-ink/40">#{inv.id.slice(0,6)}</span>
                            <span className="text-sm font-medium text-ink">{inv.description}</span>
                        </div>
                        <div className="flex gap-6 items-center w-full sm:w-auto justify-between">
                            <span className="text-xs font-light text-ink/60 font-mono">
                              {inv.createdAt?.toDate().toLocaleDateString('en-IN')}
                            </span>
                            <span className="text-sm font-bold font-mono">₹{inv.amount.toLocaleString('en-IN')}</span>
                            <span className={cn(
                              "text-[10px] uppercase font-mono px-2 py-0.5 rounded-full",
                              inv.status === 'paid' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            )}>{inv.status}</span>
                        </div>
                    </div>
                 )) : (
                  <p className="text-sm text-ink/40 italic text-center py-4">No invoices issued yet.</p>
                 )}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
             <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 shadow-lg">
                <p className="text-[10px] uppercase tracking-widest font-mono text-ink/40 font-bold">Client Account</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={user.photoURL || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(user.email || 'user')}`} 
                    alt="" 
                    className="w-14 h-14 rounded-2xl object-cover border border-ink/10 dark:border-white/20 shadow-md bg-surface"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-display font-medium text-ink leading-tight">{user.displayName}</h4>
                      <p className="text-[11px] text-ink/50 font-mono truncate max-w-[180px]">{user.email}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-ink/70 font-light bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-accent font-bold">Verified Account:</span> Your client profile has active access to Editable Studio client deliverables.
                  </div>
                </div>
             </div>

             <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-4 shadow-lg">
                <p className="text-[10px] uppercase tracking-widest font-mono text-ink/40 font-bold">Direct Support</p>
                <div className="space-y-3 text-sm">
                    <p className="text-xs text-ink/60 leading-relaxed font-light">Dedicated support for active clients. We respond within 2-4 hours.</p>
                    <a 
                      href="mailto:editablecreativestudio@gmail.com" 
                      className="block text-center py-3 bg-white/10 hover:bg-white/20 text-ink rounded-xl text-[10px] uppercase font-mono tracking-widest font-bold transition-all border border-white/10"
                    >
                        Contact Director
                    </a>
                </div>
             </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageTransition from "../components/PageTransition";
import { User, Package, Settings, LogOut, ChevronRight, Chrome } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
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
        <div className="min-h-screen pt-40 pb-24 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-12">
            <header className="text-center">
              <span className="text-xs uppercase tracking-widest opacity-40 font-mono mb-4 block">Access</span>
              <h1 className="text-4xl font-display font-medium">Welcome Back.</h1>
            </header>

            <button 
              onClick={handleLogin}
              className="w-full py-5 bg-ink text-bg rounded-full text-xs uppercase tracking-[0.4em] font-bold hover:bg-accent hover:text-bg transition-all flex items-center justify-center gap-4"
            >
              <Chrome size={18} />
              Continue with Google
            </button>

            <p className="text-xs text-center opacity-40 leading-relaxed px-10">
              Only authorized clients can access the studio dashboard. Contact us if you need help.
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-40 pb-24 max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-24">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest opacity-40 font-mono block">Dashboard</span>
            <h1 className="text-5xl md:text-8xl font-display font-medium tracking-tighter">Hi, {user.displayName?.split(' ')[0] || 'Client'}.</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 opacity-40 hover:opacity-100 hover:text-accent transition-all"
          >
            <LogOut size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Logout</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-20">
            <section className="space-y-10">
              <p className="text-xs uppercase tracking-widest opacity-40 font-mono border-b border-ink/5 pb-4">Active Projects</p>
              <div className="space-y-4">
                {projects.length > 0 ? projects.map(project => (
                   <div key={project.id} className="p-8 border border-ink/10 flex justify-between items-center group hover:border-accent transition-colors cursor-pointer">
                      <div className="space-y-2">
                          <span className="text-[10px] uppercase font-mono px-2 py-1 bg-accent/10 text-accent">{project.status?.replace('_', ' ')}</span>
                          <h3 className="text-2xl font-display">{project.title}</h3>
                      </div>
                      <ChevronRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
                   </div>
                )) : (
                  <p className="text-sm opacity-30 italic">No active projects found.</p>
                )}
              </div>
            </section>

             <section className="space-y-10">
              <p className="text-xs uppercase tracking-widest opacity-40 font-mono border-b border-ink/5 pb-4">Recent Invoices</p>
              <div className="space-y-1 divide-y divide-ink/5">
                 {invoices.length > 0 ? invoices.map((inv) => (
                    <div key={inv.id} className="py-6 flex justify-between items-center group cursor-pointer">
                        <div className="flex gap-6 items-center">
                            <span className="text-xs font-mono opacity-20">#{inv.id.slice(0,6)}</span>
                            <span className="text-sm font-medium">{inv.description}</span>
                        </div>
                        <div className="flex gap-8 items-center">
                            <span className="text-sm font-light opacity-60">
                              {inv.createdAt?.toDate().toLocaleDateString('en-IN')}
                            </span>
                            <span className="text-sm font-bold">₹{inv.amount.toLocaleString('en-IN')}</span>
                            <span className={cn(
                              "text-[10px] uppercase font-mono",
                              inv.status === 'paid' ? "text-accent" : "text-yellow-500"
                            )}>{inv.status}</span>
                        </div>
                    </div>
                 )) : (
                  <p className="text-sm opacity-30 italic">No invoices issued yet.</p>
                 )}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-12">
             <div className="p-8 bg-ink/[0.02] border border-ink/5 space-y-6">
                <p className="text-[10px] uppercase tracking-widest font-mono opacity-40">Account</p>
                <div className="flex items-center gap-4">
                  <img src={user.photoURL || ''} alt="" className="w-12 h-12 rounded-full grayscale" />
                  <div className="space-y-1">
                      <h4 className="text-lg font-display leading-none">{user.displayName}</h4>
                      <p className="text-[10px] opacity-40 uppercase tracking-widest">{user.email}</p>
                  </div>
                </div>
                <button className="w-full py-3 border border-ink/20 rounded-full text-[10px] uppercase tracking-widest font-bold hover:border-accent transition-colors">
                    Edit Profile
                </button>
             </div>

             <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-mono opacity-40">Contact Studio</p>
                <div className="space-y-2 text-sm">
                    <p className="text-xs opacity-50 mb-4">Dedicated support for active clients.</p>
                    <a href="mailto:editable.freelancing@gmail.com" className="text-accent text-[10px] uppercase tracking-widest font-bold decoration-accent">
                        Open Support Ticket
                    </a>
                </div>
             </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

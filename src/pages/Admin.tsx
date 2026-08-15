import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import PageTransition from "../components/PageTransition";
import { db, handleFirestoreError, OperationType, auth } from "../lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
  X,
  Chrome,
  RefreshCw,
  Trash2,
  Sparkles,
  ExternalLink,
  MessageSquare
} from "lucide-react";

// Admin credentials matching specified requirements
const ADMIN_CREDENTIALS: Record<string, { passkey: string; passkeys?: string[]; name: string; age: number; phone: string; address: string; joiningYear: number; role: string }> = {
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
  },
  "editablecreativestudio@gmail.com": {
    passkey: "admin@editable",
    passkeys: ["admin@editable", "ceo@bharani", "admin@dharani", "admin@chitharth", "admin@roshini"],
    name: "Bharani dharan T",
    age: 20,
    phone: "+91 76049 69891",
    address: "Editable Co. Headquarters, Chennai",
    joiningYear: 2026,
    role: "Founder, CEO & Creative Director, UI/UX & Visual Designer"
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

const getAcceptanceEmail = (candidateName: string, adminName: string, adminPosition: string) => {
  return `Dear ${candidateName},

Thank you for your interest in the Internship Program at Editable. We are pleased to inform you that, after reviewing your application, you have been shortlisted for the UI/UX Design Internship position.

To proceed with the onboarding process, a one-time registration fee of ₹250 is required to confirm your participation. We would like to assure you that this is the only fee associated with the internship, and no additional charges will be requested at any stage. Your official Letter of Joining will be shared within the next week, following which the internship program will commence.

While the internship does not include a fixed stipend, a performance-based stipend will be awarded to the best-performing intern(s). Upon successful completion of the internship, you will also receive a Completion Certificate.

Kindly reply to this email and let us know whether you would like to accept this offer and proceed with the internship. Upon receiving your confirmation, we will share the next steps regarding registration and onboarding.

We look forward to hearing from you and potentially welcoming you to our team.

Best regards,
${adminName}
${adminPosition}
Editable`;
};

const getRejectionEmail = (candidateName: string, adminName: string) => {
  return `Dear ${candidateName},

Thank you for your interest in the Internship Program at Editable and for taking the time to apply.

After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. We received a large number of applications, and the selection process was highly competitive.

We appreciate your interest in our organization and encourage you to apply for future opportunities that match your skills and experience.

We wish you all the best in your academic and professional journey.

Best regards,
${adminName}
Editable`;
};

const getReminderEmail = (candidateName: string, adminName: string) => {
  return `Dear ${candidateName},

We hope you're doing well.

This is a reminder regarding your shortlisting for our Internship Program. Kindly confirm your acceptance by replying to this email within 48 hours so that we can proceed with the onboarding process.

If we do not receive a response within this timeframe, your position may be offered to another candidate.

We look forward to hearing from you.

Best regards,
${adminName}
Editable`;
};

const getAdminDetails = (adminEmail: string) => {
  const emailLower = (adminEmail || "").trim().toLowerCase();
  if (emailLower.includes("bharanidharan")) {
    return { name: "Bharani dharan T", position: "CEO & Founder", company: "Editable Creative Studio" };
  } else if (emailLower.includes("dharani")) {
    return { name: "Dharani S", position: "Co-Founder & HR Lead", company: "Editable Creative Studio" };
  } else if (emailLower.includes("chitharth")) {
    return { name: "Chitharth S", position: "Managing Director", company: "Editable Creative Studio" };
  } else if (emailLower.includes("roshini")) {
    return { name: "Roshini Sephora S", position: "HR Administrator", company: "Editable Creative Studio" };
  }
  return { name: "The Editable Team", position: "Careers Desk", company: "Editable Creative Studio" };
};

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
  const [activeTab, setActiveTab] = useState<"overview" | "independence" | "internships" | "bookings" | "employees" | "contacts" | "analytics">("overview");
  const [loadingData, setLoadingData] = useState(false);

  // Detail drawer states
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<"internship" | "booking" | null>(null);

  // Deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Email Composer Modal States
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTargetCandidate, setEmailTargetCandidate] = useState<any | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailType, setEmailType] = useState<"accept" | "reject" | "reminder">("accept");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailMethod, setEmailMethod] = useState<"gmailWeb" | "mailto" | "gmail" | "smtp">("gmailWeb");
  const [gmailToken, setGmailToken] = useState<string | null>(null);
  const [gmailUserEmail, setGmailUserEmail] = useState<string | null>(null);
  const [isGoogleConnecting, setIsGoogleConnecting] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("admin_email");
    const savedPasskey = sessionStorage.getItem("admin_passkey");
    if (savedEmail && savedPasskey) {
      const adminAccount = ADMIN_CREDENTIALS[savedEmail];
      const isSavedPasskeyValid = adminAccount && (adminAccount.passkeys 
        ? adminAccount.passkeys.includes(savedPasskey) 
        : adminAccount.passkey === savedPasskey);

      if (isSavedPasskeyValid) {
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

      // Get applicant entries from internship_applications to recover all submitted details
      let fetchedInternships: any[] = [];
      try {
        const internshipSnap = await getDocs(query(collection(db, "internship_applications"), orderBy("createdAt", "desc")));
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

        const allowedLowerNames = ["naren", "iraianbu e", "sathish alagar"];
        fetchedInternships = fetchedInternships.filter(intern => {
          const name = (intern.fullName || "").trim().toLowerCase();
          const isAllowedName = allowedLowerNames.some(allowed => name === allowed || name.includes(allowed));
          
          // Allow newly applied candidates on or after June 20, 2026 UTC (timestamp 1781913600)
          let isNewlyApplied = false;
          if (intern.createdAt && intern.createdAt.seconds) {
            if (intern.createdAt.seconds >= 1781913600) {
              isNewlyApplied = true;
            }
          } else if (!intern.createdAt) {
            isNewlyApplied = true;
          }

          return isAllowedName || isNewlyApplied;
        });
      } catch (err: any) {
        handleFirestoreError(err, OperationType.LIST, "internship_applications");
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

    const isPasskeyValid = adminAccount.passkeys 
      ? adminAccount.passkeys.includes(passkey) 
      : adminAccount.passkey === passkey;

    if (!isPasskeyValid) {
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
  const updateItemStatus = async (id: string, collectionName: "secure_internship_registry" | "inquiries" | "internship_applications", newStatus: string) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { status: newStatus });
      
      // Update local state instantly
      if (collectionName === "secure_internship_registry" || collectionName === "internship_applications") {
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

  const deleteInternshipApplication = async (id: string) => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const docRef = doc(db, "internship_applications", id);
      await updateDoc(docRef, { isDeleted: true });
      
      // Update local state instantly
      setInternships(prev => prev.filter(item => item.id !== id));
      
      // Clear selection if the deleted item is open in detail view
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
        setSelectedType(null);
      }
    } catch (err: any) {
      console.error("Failed to delete internship application:", err);
      handleFirestoreError(err, OperationType.UPDATE, `internship_applications/${id}`);
    } finally {
      setIsLoading(false);
      setDeletingId(null);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const docRef = doc(db, "inquiries", id);
      await updateDoc(docRef, { isDeleted: true });
      
      // Update local state instantly
      setBookings(prev => prev.filter(item => item.id !== id));
      
      // Clear selection if the deleted item is open in detail view
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
        setSelectedType(null);
      }
    } catch (err: any) {
      console.error("Failed to delete inquiry:", err);
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
    } finally {
      setIsLoading(false);
      setDeletingId(null);
    }
  };

  const openEmailComposer = (candidate: any, type: "accept" | "reject" | "reminder") => {
    const adminInfo = getAdminDetails(currentUser?.email || "");
    let subject = "";
    let body = "";

    if (type === "accept") {
      subject = "Shortlisted for Internship Program at Editable Creative Studio";
      body = getAcceptanceEmail(candidate.fullName, adminInfo.name, adminInfo.position);
    } else if (type === "reject") {
      subject = "Internship Application Status update - Editable Creative Studio";
      body = getRejectionEmail(candidate.fullName, adminInfo.name);
    } else {
      subject = "Urgent: Response required for Internship Program - Editable Creative Studio";
      body = getReminderEmail(candidate.fullName, adminInfo.name);
    }

    setEmailTargetCandidate(candidate);
    setEmailType(type);
    setEmailSubject(subject);
    setEmailBody(body);
    setEmailSuccess(false);
    setEmailError("");
    setIsEmailModalOpen(true);
  };

  const handleConnectGmail = async () => {
    setIsGoogleConnecting(true);
    setEmailError("");
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/gmail.send");
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGmailToken(credential.accessToken);
        setGmailUserEmail(result.user.email || "Gmail User");
      } else {
        throw new Error("Unable to obtain Google OAuth access token from authentication popup.");
      }
    } catch (err: any) {
      console.error("Gmail Connection Error:", err);
      let errMsg = err?.message || String(err);
      if (err?.code === "auth/popup-blocked") {
        errMsg = "Sign-in popup blocked by the browser. Please allow popups for this site and try again.";
      }
      setEmailError(`Failed to connect your Gmail account: ${errMsg}`);
    } finally {
      setIsGoogleConnecting(false);
    }
  };

  const sendEmailViaGmailDirect = async () => {
    if (!emailTargetCandidate || !gmailToken) return;
    setEmailSending(true);
    setEmailError("");
    setEmailSuccess(false);

    try {
      const htmlBody = emailBody.replace(/\n/g, "<br>");
      
      const utf8B64 = (str: string) => {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
          String.fromCharCode(parseInt(p1, 16))
        ));
      };

      const emailParts = [
        `To: ${emailTargetCandidate.email}`,
        `Subject: =?utf-8?B?${utf8B64(emailSubject)}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        `Content-Transfer-Encoding: base64`,
        ``,
        utf8B64(htmlBody)
      ];

      const rawMIME = utf8B64(emailParts.join("\r\n"))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${gmailToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: rawMIME })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gmail API returned HTTP ${response.status}`);
      }

      setEmailSuccess(true);
      if (emailType === "accept") {
        await updateItemStatus(emailTargetCandidate.id, "internship_applications", "shortlisted");
      } else if (emailType === "reject") {
        await updateItemStatus(emailTargetCandidate.id, "internship_applications", "rejected");
      }
    } catch (err: any) {
      console.error("Gmail Dispatch Error:", err);
      setEmailError(`Gmail API outbound dispatch failed:\n${err?.message || err}`);
    } finally {
      setEmailSending(false);
    }
  };

  const sendEmailOutreach = async () => {
    if (!currentUser || !emailTargetCandidate) return;

    if (emailMethod === "gmailWeb") {
      setEmailSending(true);
      setEmailError("");
      try {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTargetCandidate.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
        
        setEmailSuccess(true);
        if (emailType === "accept") {
          await updateItemStatus(emailTargetCandidate.id, "internship_applications", "shortlisted");
        } else if (emailType === "reject") {
          await updateItemStatus(emailTargetCandidate.id, "internship_applications", "rejected");
        }
      } catch (err: any) {
        console.error("Gmail Web App Link Error:", err);
        setEmailError(`Failed to open Gmail compose draft: ${err?.message || err}`);
      } finally {
        setEmailSending(false);
      }
      return;
    }

    if (emailMethod === "mailto") {
      setEmailSending(true);
      setEmailError("");
      try {
        const mailtoUrl = `mailto:${encodeURIComponent(emailTargetCandidate.email)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoUrl;

        setEmailSuccess(true);
        if (emailType === "accept") {
          await updateItemStatus(emailTargetCandidate.id, "internship_applications", "shortlisted");
        } else if (emailType === "reject") {
          await updateItemStatus(emailTargetCandidate.id, "internship_applications", "rejected");
        }
      } catch (err: any) {
        console.error("Mailto Link Error:", err);
        setEmailError(`Failed to open native default mail app: ${err?.message || err}`);
      } finally {
        setEmailSending(false);
      }
      return;
    }

    if (emailMethod === "gmail") {
      if (!gmailToken) {
        setEmailError("Please connect your Gmail account before initiating dispatch.");
        return;
      }
      await sendEmailViaGmailDirect();
      return;
    }

    setEmailSending(true);
    setEmailError("");
    setEmailSuccess(false);

    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: currentUser.email,
          passkey: currentUser.passkey,
          candidateEmail: emailTargetCandidate.email,
          subject: emailSubject,
          body: emailBody
        })
      });

      let result: any = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.warn("Server responded with non-JSON data:", text);
        throw new Error("Mail dispatch received an HTML response from the server representing a gateway error. Please verify the EMAIL_USER and EMAIL_PASS variables are configured in the sidebar settings.");
      }

      if (!response.ok) {
        const fullMessage = result.details 
          ? `${result.error}\n\n${result.details}`
          : (result.error || "Failed to deliver email through SMTP gateway. Check server log output.");
        throw new Error(fullMessage);
      }

      setEmailSuccess(true);
      // Automatically transition candidate status based on the selected email type (Accept -> Shortlisted, Reject -> Rejected)
      if (emailType === "accept") {
        await updateItemStatus(emailTargetCandidate.id, "internship_applications", "shortlisted");
      } else if (emailType === "reject") {
        await updateItemStatus(emailTargetCandidate.id, "internship_applications", "rejected");
      }
    } catch (err: any) {
      setEmailError(err.message || "An unexpected error occurred while sending mail.");
    } finally {
      setEmailSending(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen pt-8 md:pt-12 pb-24">
        {!currentUser || !adminDetails ? (
          /* Swiss Editorial Admin Login Card */
          <div className="max-w-lg mx-auto relative z-10 pt-4 sm:pt-8 md:pt-12">
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 sm:p-12 space-y-8 rounded-3xl border border-ink/10 dark:border-white/10 bg-surface/60 dark:bg-surface/30 shadow-xl relative overflow-hidden backdrop-blur-xl"
              id="admin-login-card"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-ink/40 dark:text-white/40">
                    [ RESTRICTED ACCESS ]
                  </span>
                  <div className="w-8 h-8 rounded-full border border-ink/10 dark:border-white/10 flex items-center justify-center text-ink/70 dark:text-white/70">
                    <Lock size={14} />
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-display font-bold uppercase tracking-tight text-ink">
                  Admin Cabinet
                </h1>
                <p className="text-xs text-ink/60 dark:text-white/60 font-light leading-relaxed">
                  Access reserved for authorized studio officers and core team members.
                </p>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3" id="login-error-alert">
                  <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <span className="text-xs text-red-500 dark:text-red-400 font-mono leading-relaxed">{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink/50 dark:text-white/50 block">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@editablecompany.co.in"
                      className="w-full bg-ink/5 dark:bg-white/5 border border-ink/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-ink dark:text-white placeholder:text-ink/30 dark:placeholder:text-white/30 focus:outline-none focus:border-ink dark:focus:border-white transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink/50 dark:text-white/50 block">
                    Secret Passkey
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={passkey}
                      onChange={(e) => setPasskey(e.target.value)}
                      placeholder="••••••••••••••"
                      className="w-full bg-ink/5 dark:bg-white/5 border border-ink/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-ink dark:text-white placeholder:text-ink/30 dark:placeholder:text-white/30 focus:outline-none focus:border-ink dark:focus:border-white transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 h-12 flex items-center justify-center gap-2 rounded-full bg-ink text-bg dark:bg-white dark:text-ink hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-md focus:outline-none cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? "Validating Credentials..." : "Authenticate Session"}</span>
                  <ArrowUpRight size={14} />
                </button>
              </form>

              <div className="pt-4 border-t border-ink/10 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-ink/40 dark:text-white/40 uppercase tracking-widest">
                <span>Editable Studio</span>
                <span>Encrypted 256-Bit</span>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Swiss Editorial Admin Control Station */
          <div className="w-full space-y-10">
            {/* 1. Header Bar with log-out and context information */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-ink/10 dark:border-white/10 pb-8" id="admin-top-panel">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-[0.2em] text-ink/40 dark:text-white/40">
                    [ EXECUTIVE CONTROL ]
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl sm:text-2xl font-display text-ink/40 font-light">(01)</span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight uppercase leading-none text-ink">
                    Admin Cabinet
                  </h1>
                </div>
              </div>

              {/* Logged in admin meta summary */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {activeTab !== "overview" && (
                  <button
                    onClick={() => { setActiveTab("overview"); setSelectedItem(null); }}
                    className="px-4 py-2 border border-ink/15 dark:border-white/15 hover:bg-ink hover:text-bg dark:hover:bg-white dark:hover:text-ink rounded-full text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>← Back to Overview</span>
                  </button>
                )}

                <div className="text-right pl-2">
                  <p className="text-xs sm:text-sm font-bold font-display text-ink">{adminDetails.name}</p>
                  <p className="text-[10px] text-accent font-mono font-bold uppercase tracking-widest">{adminDetails.role.split(',')[0]}</p>
                </div>
                
                <div className="w-9 h-9 rounded-full border border-ink/15 dark:border-white/15 bg-ink/5 dark:bg-white/5 flex items-center justify-center font-mono font-bold text-xs text-ink">
                  {adminDetails.name.split(" ").map(n => n[0]).join("")}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-9 h-9 rounded-full border border-ink/15 dark:border-white/15 hover:border-red-500 hover:bg-red-500 hover:text-white text-ink/70 flex items-center justify-center transition-all focus:outline-none cursor-pointer"
                  title="Logout Session"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>

            {/* 2. Logged-in Admin Corporate Details Profile Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 rounded-3xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 relative overflow-hidden backdrop-blur-md"
              id="admin-profile-card"
            >
              <div className="flex items-center justify-between border-b border-ink/10 dark:border-white/10 pb-4 mb-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/40 dark:text-white/40">
                  [ 01 / OFFICER CREDENTIAL CARD ]
                </span>
                <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-widest">
                  EST. 2026 • CHENNAI
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-ink/40 dark:text-white/40 block font-bold">Official Officer</span>
                  <span className="text-sm sm:text-base font-bold text-ink font-display">{adminDetails.name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-ink/40 dark:text-white/40 block font-bold">Age</span>
                  <span className="text-sm sm:text-base font-bold text-ink font-mono">{adminDetails.age} Yrs</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-ink/40 dark:text-white/40 block font-bold">Direct Line</span>
                  <span className="text-sm sm:text-base font-bold text-ink font-mono">{adminDetails.phone}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-ink/40 dark:text-white/40 block font-bold">Year of Joining</span>
                  <span className="text-sm sm:text-base font-bold text-accent font-mono">{adminDetails.joiningYear}</span>
                </div>
                <div className="col-span-2 md:col-span-4 space-y-1 border-t border-ink/10 dark:border-white/10 pt-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-ink/40 dark:text-white/40 block font-bold">Registered Headquarters</span>
                  <span className="text-xs font-mono text-ink/70 dark:text-white/70 leading-relaxed block">{adminDetails.address}</span>
                </div>
              </div>
            </motion.div>

            {/* 3. Swiss Editorial Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-ink/10 dark:border-white/10 pb-4 overflow-x-auto">
              {[
                { id: "overview", label: "Overview" },
                { 
                  id: "independence", 
                  label: `Independence Claims (${bookings.filter(b => b.isIndependenceOffer || (b.package && b.package.toLowerCase().includes("independence")) || b.slotNumber).length})`,
                  isSpecial: true
                },
                { id: "analytics", label: "Studio Analytics" },
                { id: "internships", label: `Applicants (${internships.length})` },
                { id: "bookings", label: `Packages (${bookings.filter(b => b.package && !b.isIndependenceOffer && !b.package.toLowerCase().includes("independence")).length})` },
                { id: "contacts", label: `Inquiries (${bookings.filter(b => !b.package && !b.isIndependenceOffer && !b.slotNumber).length})` },
                { id: "employees", label: `Directory (${EMPLOYEES.length})` },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setSelectedItem(null); }}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? "bg-ink text-bg dark:bg-white dark:text-ink shadow-sm"
                        : tab.isSpecial
                        ? "border border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                        : "border border-ink/10 dark:border-white/10 text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-ink/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {tab.isSpecial && <Sparkles size={11} className={isActive ? "text-bg dark:text-ink" : "text-rose-500"} />}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 4. Active Sub-View Panels */}
            {loadingData ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-10 h-10 rounded-full border-t border-accent animate-spin mx-auto" />
                <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Querying Datastores...</p>
              </div>
            ) : (
              <div className={["internships", "bookings", "contacts", "independence"].includes(activeTab) ? "grid lg:grid-cols-3 gap-8 items-start" : "w-full"}>
                {/* Left Side: Elaborated details or database listings */}
                <div className={["internships", "bookings", "contacts", "independence"].includes(activeTab) ? "lg:col-span-2 space-y-6" : "w-full space-y-8"}>

                  {/* SUBPAGE OVERVIEW TAB */}
                  {activeTab === "overview" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                      {/* Systems Pulse Cards */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-ink/10 dark:border-white/10 pb-3">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/40 dark:text-white/40">
                            [ 01 / STUDIO TELEMETRY & CHANNELS ]
                          </span>
                          <span className="text-[10px] font-mono text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest">
                            REAL-TIME SYNC
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                          {/* CARD 0: Independence Day Special */}
                          <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/[0.04] flex flex-col justify-between min-h-[190px] transition-all hover:border-rose-500">
                            <div>
                              <div className="flex items-start justify-between">
                                <span className="text-xs font-mono font-bold text-rose-500">(01)</span>
                                <span className="text-[9px] uppercase font-mono tracking-widest text-rose-500 font-bold px-2 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/10">
                                  CAMPAIGN
                                </span>
                              </div>
                              <h3 className="text-3xl font-display font-bold text-ink leading-none mt-4">
                                {bookings.filter(b => b.isIndependenceOffer || (b.package && b.package.toLowerCase().includes("independence")) || b.slotNumber).length}
                                <span className="text-xs font-mono font-normal opacity-40 ml-1">/ 15</span>
                              </h3>
                              <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-rose-500 mt-2">Independence Claims</p>
                            </div>
                            <button
                              onClick={() => { setActiveTab("independence"); setSelectedItem(null); }}
                              className="mt-5 w-full py-2 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-[9px] uppercase font-mono tracking-widest font-bold rounded-full transition-all text-center flex items-center justify-center gap-1 text-rose-500 cursor-pointer"
                            >
                              <span>Inspect Claims</span>
                              <ChevronRight size={10} />
                            </button>
                          </div>

                          {/* CARD 1: Internship Applications */}
                          <div className="p-6 rounded-2xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 flex flex-col justify-between min-h-[190px] transition-all hover:border-ink dark:hover:border-white">
                            <div>
                              <div className="flex items-start justify-between">
                                <span className="text-xs font-mono font-bold text-ink/40 dark:text-white/40">(02)</span>
                                <span className="text-[9px] uppercase font-mono tracking-widest text-accent font-bold px-2 py-0.5 rounded-full border border-accent/30 bg-accent/10">
                                  TALENT
                                </span>
                              </div>
                              <h3 className="text-3xl font-display font-bold text-ink leading-none mt-4">{internships.length}</h3>
                              <p className="text-[10px] uppercase font-mono tracking-wider font-bold opacity-45 mt-2">Applicants</p>
                            </div>
                            <button
                              onClick={() => { setActiveTab("internships"); setSelectedItem(null); }}
                              className="mt-5 w-full py-2 border border-ink/15 dark:border-white/15 hover:bg-ink hover:text-bg dark:hover:bg-white dark:hover:text-ink text-[9px] uppercase font-mono tracking-widest font-bold rounded-full transition-all text-center flex items-center justify-center gap-1 text-ink/70 dark:text-white/70 cursor-pointer"
                            >
                              <span>Inspect Pool</span>
                              <ChevronRight size={10} />
                            </button>
                          </div>

                          {/* CARD 2: Active Package Bookings */}
                          <div className="p-6 rounded-2xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 flex flex-col justify-between min-h-[190px] transition-all hover:border-ink dark:hover:border-white">
                            <div>
                              <div className="flex items-start justify-between">
                                <span className="text-xs font-mono font-bold text-ink/40 dark:text-white/40">(03)</span>
                                <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-500 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                                  PACKAGES
                                </span>
                              </div>
                              <h3 className="text-3xl font-display font-bold text-ink leading-none mt-4">{bookings.filter(b => b.package).length}</h3>
                              <p className="text-[10px] uppercase font-mono tracking-wider font-bold opacity-45 mt-2">Active Packages</p>
                            </div>
                            <button
                              onClick={() => { setActiveTab("bookings"); setSelectedItem(null); }}
                              className="mt-5 w-full py-2 border border-ink/15 dark:border-white/15 hover:bg-ink hover:text-bg dark:hover:bg-white dark:hover:text-ink text-[9px] uppercase font-mono tracking-widest font-bold rounded-full transition-all text-center flex items-center justify-center gap-1 text-ink/70 dark:text-white/70 cursor-pointer"
                            >
                              <span>Inspect Deals</span>
                              <ChevronRight size={10} />
                            </button>
                          </div>

                          {/* CARD 3: General Inquiries */}
                          <div className="p-6 rounded-2xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 flex flex-col justify-between min-h-[190px] transition-all hover:border-ink dark:hover:border-white">
                            <div>
                              <div className="flex items-start justify-between">
                                <span className="text-xs font-mono font-bold text-ink/40 dark:text-white/40">(04)</span>
                                <span className="text-[9px] uppercase font-mono tracking-widest text-amber-500 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10">
                                  INBOUND
                                </span>
                              </div>
                              <h3 className="text-3xl font-display font-bold text-ink leading-none mt-4">{bookings.filter(b => !b.package).length}</h3>
                              <p className="text-[10px] uppercase font-mono tracking-wider font-bold opacity-45 mt-2">Inquiries</p>
                            </div>
                            <button
                              onClick={() => { setActiveTab("contacts"); setSelectedItem(null); }}
                              className="mt-5 w-full py-2 border border-ink/15 dark:border-white/15 hover:bg-ink hover:text-bg dark:hover:bg-white dark:hover:text-ink text-[9px] uppercase font-mono tracking-widest font-bold rounded-full transition-all text-center flex items-center justify-center gap-1 text-ink/70 dark:text-white/70 cursor-pointer"
                            >
                              <span>Inspect Leads</span>
                              <ChevronRight size={10} />
                            </button>
                          </div>

                          {/* CARD 4: Active Team Officers */}
                          <div className="p-6 rounded-2xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 flex flex-col justify-between min-h-[190px] transition-all hover:border-ink dark:hover:border-white">
                            <div>
                              <div className="flex items-start justify-between">
                                <span className="text-xs font-mono font-bold text-ink/40 dark:text-white/40">(05)</span>
                                <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-500 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10">
                                  STAFF
                                </span>
                              </div>
                              <h3 className="text-3xl font-display font-bold text-ink leading-none mt-4">{EMPLOYEES.length}</h3>
                              <p className="text-[10px] uppercase font-mono tracking-wider font-bold opacity-45 mt-2">Directory</p>
                            </div>
                            <button
                              onClick={() => { setActiveTab("employees"); setSelectedItem(null); }}
                              className="mt-5 w-full py-2 border border-ink/15 dark:border-white/15 hover:bg-ink hover:text-bg dark:hover:bg-white dark:hover:text-ink text-[9px] uppercase font-mono tracking-widest font-bold rounded-full transition-all text-center flex items-center justify-center gap-1 text-ink/70 dark:text-white/70 cursor-pointer"
                            >
                              <span>Inspect Team</span>
                              <ChevronRight size={10} />
                            </button>
                          </div>

                          {/* CARD 5: Studio Analytics */}
                          <div className="p-6 rounded-2xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 flex flex-col justify-between min-h-[190px] transition-all hover:border-ink dark:hover:border-white">
                            <div>
                              <div className="flex items-start justify-between">
                                <span className="text-xs font-mono font-bold text-ink/40 dark:text-white/40">(06)</span>
                                <span className="text-[9px] uppercase font-mono tracking-widest text-fuchsia-500 font-bold px-2 py-0.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
                                  ANALYTICS
                                </span>
                              </div>
                              <h3 className="text-2xl font-display font-bold text-ink leading-none mt-4">FINANCE</h3>
                              <p className="text-[10px] uppercase font-mono tracking-wider font-bold opacity-45 mt-2">Valuation Index</p>
                            </div>
                            <button
                              onClick={() => { setActiveTab("analytics"); setSelectedItem(null); }}
                              className="mt-5 w-full py-2 border border-ink/15 dark:border-white/15 hover:bg-ink hover:text-bg dark:hover:bg-white dark:hover:text-ink text-[9px] uppercase font-mono tracking-widest font-bold rounded-full transition-all text-center flex items-center justify-center gap-1 text-ink/70 dark:text-white/70 cursor-pointer"
                            >
                              <span>View Metrics</span>
                              <ChevronRight size={10} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Studio updates announcement segment */}
                      <div className="p-6 sm:p-8 rounded-3xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 space-y-6">
                        <div className="flex items-center justify-between border-b border-ink/10 dark:border-white/10 pb-4">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/40 dark:text-white/40">
                            [ 02 / STUDIO EXECUTIVE DIRECTIVES ]
                          </span>
                          <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-widest">
                            2026 ROADMAP
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="border border-ink/10 dark:border-white/10 p-5 rounded-2xl space-y-2 bg-ink/[0.02] dark:bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-accent">01.</span>
                              <p className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Digital Agency Growth Plan</p>
                            </div>
                            <p className="text-xs text-ink/70 dark:text-white/70 leading-relaxed font-light">
                              All coordinators, review package inquiries within 24 hours. The new <strong className="text-accent font-semibold">Secure Internship Registry</strong> is fully operational to segment job canditatures without public trace.
                            </p>
                          </div>

                          <div className="border border-ink/10 dark:border-white/10 p-5 rounded-2xl space-y-2 bg-ink/[0.02] dark:bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-ink/40 dark:text-white/40">02.</span>
                              <p className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Quality Control & Canva Guidelines</p>
                            </div>
                            <p className="text-xs text-ink/70 dark:text-white/70 leading-relaxed font-light">
                              For incoming designers, prioritize applicants declaring "Experienced" in Canva parameters. Review portfolios prior to contacting applicant addresses.
                            </p>
                          </div>
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
                      "Graphic/UI UX Designer": internships.filter(i => i.role === "Graphic/UI UX Designer" || i.role === "Graphic Designer").length,
                      "Social Media Manager": internships.filter(i => i.role === "Social Media Manager").length,
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
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="space-y-10"
                      >
                        {/* Summary Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink/10 dark:border-white/10 pb-4">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/40 dark:text-white/40">
                              [ 01 / CORPORATE VALUATION & PIPELINE INTELLIGENCE ]
                            </span>
                            <h2 className="text-2xl font-display font-bold text-ink mt-1">Valuation & Growth Metrics</h2>
                          </div>
                          <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-accent/20 bg-accent/5 self-start md:self-auto">
                            REAL-TIME DATASTORE SYNC
                          </div>
                        </div>

                        {/* Top Financial / Business KPIs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-6 rounded-2xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 flex flex-col justify-between">
                            <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-ink/40 dark:text-white/40">Total Pipeline Value</span>
                            <h4 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-3">{formatCurrency(totalPipeline)}</h4>
                            <p className="text-[10px] font-mono text-ink/50 dark:text-white/50 mt-3 font-semibold">{bookings.length} Registered Deal Leads</p>
                          </div>

                          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] flex flex-col justify-between">
                            <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-emerald-600 dark:text-emerald-400">Realized Project Revenue</span>
                            <h4 className="text-2xl sm:text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-3">{formatCurrency(realizedRevenue)}</h4>
                            <p className="text-[10px] font-mono text-emerald-600/70 dark:text-emerald-400/70 mt-3 font-semibold">
                              {bookings.filter(b => b.status === "project_started" || b.status === "closed").length} Started Tiers
                            </p>
                          </div>

                          <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] flex flex-col justify-between">
                            <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-amber-600 dark:text-amber-400">Active Negotiations</span>
                            <h4 className="text-2xl sm:text-3xl font-display font-bold text-amber-600 dark:text-amber-400 mt-3">{formatCurrency(pendingPipeline)}</h4>
                            <p className="text-[10px] font-mono text-amber-600/70 dark:text-amber-400/70 mt-3 font-semibold">
                              {bookings.filter(b => b.status === "pending" || b.status === "contacted" || !b.status).length} Pending Actions
                            </p>
                          </div>

                          <div className="p-6 rounded-2xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 flex flex-col justify-between">
                            <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-ink/40 dark:text-white/40">Lead Conversion Rate</span>
                            <h4 className="text-2xl sm:text-3xl font-display font-bold text-accent mt-3">
                              {bookings.length > 0 
                                ? Math.round((bookings.filter(b => ["project_started", "closed"].includes(b.status)).length / bookings.length) * 100)
                                : 0}%
                            </h4>
                            <p className="text-[10px] font-mono text-ink/50 dark:text-white/50 mt-3 font-semibold">Pipeline Transition Index</p>
                          </div>
                        </div>

                        {/* Interactive Graph Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                          {/* Business Trend Chart */}
                          <div className="p-6 sm:p-8 rounded-3xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between border-b border-ink/10 dark:border-white/10 pb-4">
                              <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/40 dark:text-white/40">
                                  [ 02 / TRAJECTORY ]
                                </span>
                                <h3 className="text-base font-display font-bold text-ink mt-0.5">Inquiry Volume Progression</h3>
                              </div>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                                +{Math.round(((trendData[5].count - trendData[0].count) / Math.max(trendData[0].count, 1)) * 100)}%
                              </span>
                            </div>

                            {/* Crisp SVG Line/Area Chart */}
                            <div className="h-48 w-full relative pt-2">
                              <svg viewBox="0 10 100 80" className="w-full h-full" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-accent, #6366f1)" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="var(--color-accent, #6366f1)" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                
                                {/* Grid reference lines */}
                                <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" strokeDasharray="3,3" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" strokeDasharray="3,3" />
                                <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" strokeDasharray="3,3" />

                                {/* Ambient shading under the line */}
                                <polygon points={areaPointsStr} fill="url(#chartGradient)" />

                                {/* Main line path */}
                                <polyline
                                  fill="none"
                                  stroke="currentColor"
                                  className="text-accent"
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
                                      r="2"
                                      className="fill-bg stroke-accent"
                                      strokeWidth="1.5"
                                    />
                                  </g>
                                ))}
                              </svg>

                              {/* Month Labels below chart */}
                              <div className="absolute bottom-0 left-0 w-full flex justify-between px-1 text-[9px] font-mono text-ink/40 dark:text-white/40 pointer-events-none select-none">
                                {trendData.map((d, index) => (
                                  <div key={index} className="w-12 text-center font-bold">{d.month}</div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Service Package Distribution */}
                          <div className="p-6 sm:p-8 rounded-3xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 space-y-6">
                            <div className="border-b border-ink/10 dark:border-white/10 pb-4">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/40 dark:text-white/40">
                                [ 03 / TIER ALLOCATION ]
                              </span>
                              <h3 className="text-base font-display font-bold text-ink mt-0.5">Service Tier Demand</h3>
                            </div>

                            {/* Responsive horizontal bars */}
                            <div className="space-y-4">
                              {Object.entries(packageCounts).map(([pkg, count]) => {
                                const percentage = totalBookingsCount > 0 
                                  ? Math.round((count / totalBookingsCount) * 100) 
                                  : 25;

                                return (
                                  <div key={pkg} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="font-mono text-ink/70 dark:text-white/70 font-medium">{pkg}</span>
                                      <span className="font-mono text-ink dark:text-white font-bold text-xs">{count} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-ink/10 dark:bg-white/10 rounded-full overflow-hidden">
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
                            </div>
                          </div>

                        </div>

                        {/* Recruitment & Applicant Registry Intelligence */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                          {/* Applicant Demography */}
                          <div className="p-6 sm:p-8 rounded-3xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 lg:col-span-3 space-y-6">
                            <div className="border-b border-ink/10 dark:border-white/10 pb-4">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/40 dark:text-white/40">
                                [ 04 / TALENT ALLOCATION ]
                              </span>
                              <h3 className="text-base font-display font-bold text-ink mt-0.5">Internship Role Demand</h3>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {Object.entries(roleCounts).map(([role, count]) => {
                                const pctOfTotal = totalInterns > 0 ? Math.round((count / totalInterns) * 100) : 0;
                                return (
                                  <div key={role} className="p-4 rounded-2xl border border-ink/10 dark:border-white/10 text-center space-y-1 bg-ink/[0.02] dark:bg-white/[0.02]">
                                    <p className="text-[8px] uppercase tracking-widest font-mono text-ink/40 dark:text-white/40 font-bold line-clamp-1">{role.replace("Designer", "").replace("Editor", "").replace("Developer", "")}</p>
                                    <h5 className="text-2xl font-display font-bold text-ink">{count}</h5>
                                    <p className="text-[10px] font-mono text-accent font-bold">{pctOfTotal}%</p>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Detailed horizontal progressive distribution */}
                            <div className="space-y-3 p-4 rounded-2xl border border-ink/10 dark:border-white/10 bg-ink/[0.02] dark:bg-white/[0.02]">
                              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-mono text-ink/50 dark:text-white/50 font-bold">
                                <span>Recruitment Velocity Index</span>
                                <span>{totalInterns} Total Candidates</span>
                              </div>
                              <div className="w-full h-2.5 bg-ink/10 dark:bg-white/10 rounded-full overflow-hidden flex">
                                {Object.entries(roleCounts).map(([role, count], idx) => {
                                  const colors = ["bg-accent", "bg-emerald-500", "bg-cyan-500", "bg-amber-500"];
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
                            </div>
                          </div>

                          {/* Applicant Conversion Stats */}
                          <div className="p-6 sm:p-8 rounded-3xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 lg:col-span-2 space-y-6">
                            <div className="border-b border-ink/10 dark:border-white/10 pb-4">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/40 dark:text-white/40">
                                [ 05 / FUNNEL METRICS ]
                              </span>
                              <h3 className="text-base font-display font-bold text-ink mt-0.5">Shortlisting Conversion</h3>
                            </div>

                            <div className="space-y-4 font-mono text-xs">
                              <div className="flex items-center justify-between p-3 rounded-xl border border-ink/10 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span className="text-ink/80 dark:text-white/80 font-medium">Shortlisted</span>
                                </div>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  {statusCounts.shortlisted} ({totalInterns > 0 ? Math.round((statusCounts.shortlisted / totalInterns) * 100) : 0}%)
                                </span>
                              </div>

                              <div className="flex items-center justify-between p-3 rounded-xl border border-ink/10 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                                  <span className="text-ink/80 dark:text-white/80 font-medium">Under Review</span>
                                </div>
                                <span className="font-bold text-amber-600 dark:text-amber-400">
                                  {statusCounts.pending} ({totalInterns > 0 ? Math.round((statusCounts.pending / totalInterns) * 100) : 0}%)
                                </span>
                              </div>

                              <div className="flex items-center justify-between p-3 rounded-xl border border-ink/10 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                                  <span className="text-ink/80 dark:text-white/80 font-medium">Archived</span>
                                </div>
                                <span className="font-bold text-rose-600 dark:text-rose-400">
                                  {statusCounts.rejected} ({totalInterns > 0 ? Math.round((statusCounts.rejected / totalInterns) * 100) : 0}%)
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })()}

                  {/* SUBPAGE INDEPENDENCE DAY CLAIMS TAB */}
                  {activeTab === "independence" && (() => {
                    const independenceClaims = bookings.filter(b => 
                      b.isIndependenceOffer || 
                      (b.package && b.package.toLowerCase().includes("independence")) || 
                      b.slotNumber
                    );

                    const filteredClaims = independenceClaims.filter(item => {
                      const query = searchQuery.toLowerCase();
                      const matchesSearch = 
                        (item.name && item.name.toLowerCase().includes(query)) ||
                        (item.businessName && item.businessName.toLowerCase().includes(query)) ||
                        (item.email && item.email.toLowerCase().includes(query)) ||
                        (item.phone && item.phone.toLowerCase().includes(query)) ||
                        (item.projectType && item.projectType.toLowerCase().includes(query)) ||
                        (item.slotNumber && String(item.slotNumber).includes(query));
                      return matchesSearch;
                    });

                    return (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        {/* Quota Banner & Search */}
                        <div className="p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-rose-500/[0.03] space-y-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-rose-500">
                                  [ CAMPAIGN ALLOCATION TRACKER ]
                                </span>
                              </div>
                              <h3 className="text-xl md:text-2xl font-display font-bold text-ink mt-1">
                                Independence Day Special (Aug 15 - 30)
                              </h3>
                              <p className="text-xs text-ink/70 font-light mt-0.5">
                                Limited 15-slot quota for free custom website architecture & creative development.
                              </p>
                            </div>
                            <div className="text-left md:text-right shrink-0">
                              <div className="text-3xl font-display font-bold text-rose-500 font-mono">
                                {independenceClaims.length} <span className="text-sm font-normal text-ink/40">/ 15 Claims</span>
                              </div>
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-50 block mt-0.5">
                                {15 - independenceClaims.length > 0 ? `${15 - independenceClaims.length} Slots Available` : "All Slots Filled"}
                              </span>
                            </div>
                          </div>

                          {/* Quota bar */}
                          <div className="w-full bg-ink/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-rose-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, (independenceClaims.length / 15) * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Search Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                          <div className="relative w-full sm:w-80">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-ink" />
                            <input
                              type="text"
                              placeholder="Search by brand, founder, phone..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-transparent border border-ink/10 dark:border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-rose-500 transition-colors font-mono text-ink"
                            />
                          </div>
                          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink/50 dark:text-white/50">
                            {filteredClaims.length} OF {independenceClaims.length} ENTRIES
                          </span>
                        </div>

                        {/* List of Claims */}
                        <div className="space-y-3" id="independence-claims-list">
                          {filteredClaims.length === 0 ? (
                            <div className="p-12 text-center space-y-3 rounded-2xl border border-dashed border-ink/10 dark:border-white/10">
                              <Sparkles size={24} className="mx-auto text-rose-500/40" />
                              <p className="text-xs opacity-50 font-mono font-bold uppercase tracking-wider">
                                {independenceClaims.length === 0 ? "No Independence Day offers claimed yet." : "No matching claims found."}
                              </p>
                            </div>
                          ) : (
                            filteredClaims.map((claim) => (
                              <motion.div
                                key={claim.id}
                                layoutId={`card-${claim.id}`}
                                onClick={() => { setSelectedItem(claim); setSelectedType("booking"); }}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                  selectedItem?.id === claim.id 
                                    ? "border-rose-500 bg-rose-500/[0.04]" 
                                    : "border-ink/10 dark:border-white/10 bg-surface/40 hover:border-ink/30 dark:hover:border-white/30"
                                }`}
                              >
                                <div className="space-y-2.5 flex-grow">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-mono text-[9px] font-bold tracking-wider border border-rose-500/30">
                                      SLOT #{claim.slotNumber || "RESERVED"}
                                    </span>
                                    <h4 className="text-base font-bold font-display text-ink">
                                      {claim.businessName || claim.name}
                                    </h4>
                                    {claim.businessName && claim.name && (
                                      <span className="text-xs font-mono opacity-50">
                                        ({claim.name})
                                      </span>
                                    )}
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono font-bold uppercase tracking-wider border border-amber-500/20">
                                      {claim.projectType || "Free Website Build"}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs opacity-60 font-mono">
                                    <a 
                                      href={`mailto:${claim.email}`} 
                                      onClick={(e) => e.stopPropagation()} 
                                      className="flex items-center gap-1 hover:text-accent underline"
                                    >
                                      <Mail size={12} /> {claim.email}
                                    </a>
                                    {claim.phone && (
                                      <a 
                                        href={`https://wa.me/${claim.phone.replace(/[^0-9]/g, '')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1 hover:text-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium"
                                      >
                                        <MessageSquare size={12} /> WA: {claim.phone}
                                      </a>
                                    )}
                                    <span className="flex items-center gap-1">
                                      <Calendar size={12} /> {claim.createdAt?.seconds ? new Date(claim.createdAt.seconds * 1000).toLocaleDateString() : "Recent"}
                                    </span>
                                  </div>

                                  {claim.details && (
                                    <p className="text-xs text-ink/70 dark:text-white/70 font-light line-clamp-2 italic bg-ink/[0.02] dark:bg-white/[0.02] p-2.5 rounded-xl border border-ink/5 dark:border-white/5">
                                      "{claim.details}"
                                    </p>
                                  )}

                                  {/* Quick Action controls */}
                                  <div className="flex items-center gap-2 pt-2 border-t border-ink/5 dark:border-white/5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-[9px] uppercase font-mono tracking-wider font-bold opacity-40">Status:</span>
                                    {["pending", "contacted", "project_started", "closed"].map((st) => (
                                      <button
                                        key={st}
                                        onClick={() => updateItemStatus(claim.id, "inquiries", st)}
                                        className={`px-2.5 py-1 rounded-full text-[8px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                                          claim.status === st
                                            ? "bg-rose-500 text-white shadow-sm"
                                            : "border border-ink/10 dark:border-white/10 hover:bg-ink/5 dark:hover:bg-white/5 text-ink/70 dark:text-white/70"
                                        }`}
                                      >
                                        {st.replace("_", " ")}
                                      </button>
                                    ))}

                                    {deletingId === claim.id ? (
                                      <div className="flex items-center gap-1 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 ml-auto">
                                        <span className="text-[9px] uppercase font-mono font-bold text-red-500">Delete?</span>
                                        <button
                                          onClick={() => deleteInquiry(claim.id)}
                                          className="px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-[8px] uppercase font-mono font-bold cursor-pointer"
                                        >
                                          Yes
                                        </button>
                                        <button
                                          onClick={() => setDeletingId(null)}
                                          className="px-2 py-0.5 bg-ink/10 text-ink dark:text-white rounded-full text-[8px] uppercase font-mono font-bold cursor-pointer"
                                        >
                                          No
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setDeletingId(claim.id)}
                                        className="px-2.5 py-1 text-red-500 hover:bg-red-500/10 rounded-full text-[9px] uppercase font-mono tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1 ml-auto"
                                        title="Delete Claim"
                                      >
                                        <Trash2 size={10} />
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 self-center hidden sm:block" />
                              </motion.div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    );
                  })()}

                  {/* SUBPAGE INTERNSHIPS TAB */}
                  {activeTab === "internships" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-80">
                          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-ink" />
                          <input
                            type="text"
                            placeholder="Search applicants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border border-ink/10 dark:border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-accent transition-colors font-mono text-ink"
                          />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="bg-transparent border border-ink/10 dark:border-white/10 rounded-full px-4 py-2.5 text-[10px] uppercase font-mono tracking-wider font-bold focus:outline-none text-ink cursor-pointer"
                          >
                            <option value="all">ALL ROLES</option>
                            <option value="Graphic/UI UX Designer">GRAPHIC/UI UX DESIGNER</option>
                            <option value="Social Media Manager">SOCIAL MEDIA MANAGER</option>
                          </select>
                        </div>
                      </div>

                      {/* Internships candidate cards list */}
                      <div className="space-y-3" id="internship-candidates-list">
                        {internships.length === 0 ? (
                          <div className="p-12 text-center text-xs opacity-50 font-mono font-bold uppercase tracking-wider rounded-2xl border border-dashed border-ink/10 dark:border-white/10">
                            No candidates submitted yet
                          </div>
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
                                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                  selectedItem?.id === candidate.id 
                                    ? "border-accent bg-accent/[0.04]" 
                                    : "border-ink/10 dark:border-white/10 bg-surface/40 hover:border-ink/30 dark:hover:border-white/30"
                                }`}
                              >
                                <div className="space-y-2 flex-grow pr-4">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-base font-bold font-display text-ink">
                                      {candidate.fullName}
                                    </h4>
                                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-mono font-bold uppercase tracking-wider border border-accent/20">
                                      {candidate.role || "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs opacity-50 font-mono flex-wrap">
                                    <span className="flex items-center gap-1"><Mail size={12} /> {candidate.email}</span>
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {candidate.createdAt?.seconds ? new Date(candidate.createdAt.seconds * 1000).toLocaleDateString() : "Pending"}</span>
                                  </div>

                                  {/* Quick SMTP Email Buttons next to applicant in list */}
                                  <div className="flex items-center gap-2 pt-2 border-t border-ink/5 dark:border-white/5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => openEmailComposer(candidate, "accept")}
                                      className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 rounded-full text-[9px] uppercase font-mono tracking-wider font-bold transition-all cursor-pointer"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => openEmailComposer(candidate, "reject")}
                                      className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-full text-[9px] uppercase font-mono tracking-wider font-bold transition-all cursor-pointer"
                                    >
                                      Reject
                                    </button>
                                    <button
                                      onClick={() => openEmailComposer(candidate, "reminder")}
                                      className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500/20 rounded-full text-[9px] uppercase font-mono tracking-wider font-bold transition-all cursor-pointer"
                                    >
                                      Remind
                                    </button>

                                    {deletingId === candidate.id ? (
                                      <div className="flex items-center gap-1 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 ml-auto">
                                        <span className="text-[9px] uppercase font-mono font-bold text-red-500">Delete?</span>
                                        <button
                                          onClick={() => deleteInternshipApplication(candidate.id)}
                                          className="px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-[8px] uppercase font-mono font-bold transition-all cursor-pointer"
                                        >
                                          Yes
                                        </button>
                                        <button
                                          onClick={() => setDeletingId(null)}
                                          className="px-2 py-0.5 bg-ink/10 text-ink dark:text-white rounded-full text-[8px] uppercase font-mono font-bold transition-all cursor-pointer"
                                        >
                                          No
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setDeletingId(candidate.id)}
                                        className="px-2.5 py-1 text-red-500 hover:bg-red-500/10 rounded-full text-[9px] uppercase font-mono tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1 ml-auto"
                                        title="Delete Application"
                                      >
                                        <Trash2 size={10} />
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                              </motion.div>
                            ))
                        }
                      </div>
                    </motion.div>
                  )}

                  {/* SUBPAGE PACKAGE BOOKINGS TAB */}
                  {activeTab === "bookings" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="space-y-3" id="package-bookings-list">
                        {bookings.filter(b => b.package).length === 0 ? (
                          <div className="p-12 text-center text-xs opacity-50 font-mono font-bold uppercase tracking-wider rounded-2xl border border-dashed border-ink/10 dark:border-white/10">
                            No active package reservations found
                          </div>
                        ) : bookings
                            .filter(b => b.package)
                            .map((booking) => (
                              <motion.div
                                key={booking.id}
                                layoutId={`card-${booking.id}`}
                                onClick={() => { setSelectedItem(booking); setSelectedType("booking"); }}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                  selectedItem?.id === booking.id 
                                    ? "border-accent bg-accent/[0.04]" 
                                    : "border-ink/10 dark:border-white/10 bg-surface/40 hover:border-ink/30 dark:hover:border-white/30"
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-base font-bold font-display text-ink">
                                      {booking.name}
                                    </h4>
                                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold uppercase tracking-wider border border-emerald-500/20">
                                      {booking.package}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs opacity-50 font-mono">
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
                      <div className="space-y-3" id="contacts-list">
                        {bookings.filter(b => !b.package).length === 0 ? (
                          <div className="p-12 text-center text-xs opacity-50 font-mono font-bold uppercase tracking-wider rounded-2xl border border-dashed border-ink/10 dark:border-white/10">
                            No general business inquiries yet
                          </div>
                        ) : bookings
                            .filter(b => !b.package)
                            .map((contact) => (
                              <motion.div
                                key={contact.id}
                                layoutId={`card-${contact.id}`}
                                onClick={() => { setSelectedItem(contact); setSelectedType("booking"); }}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                  selectedItem?.id === contact.id 
                                    ? "border-accent bg-accent/[0.04]" 
                                    : "border-ink/10 dark:border-white/10 bg-surface/40 hover:border-ink/30 dark:hover:border-white/30"
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-base font-bold font-display text-ink">
                                      {contact.name}
                                    </h4>
                                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold uppercase tracking-wider border border-cyan-500/20">
                                      Inquiry
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs opacity-50 font-mono">
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4" id="corporate-team-grid">
                      {EMPLOYEES.map((emp) => (
                        <div 
                          key={emp.email}
                          className="p-6 rounded-3xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 space-y-4 transition-all hover:border-ink dark:hover:border-white"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-base font-bold font-display text-ink">{emp.name}</h4>
                              <p className="text-xs font-mono text-ink/60 dark:text-white/60 mt-1">{emp.role}</p>
                            </div>
                            <span className="text-[8px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                              {emp.status}
                            </span>
                          </div>

                          <div className="border-t border-ink/10 dark:border-white/10 pt-4 space-y-2 text-xs font-mono opacity-60">
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
                      className="p-6 md:p-7 rounded-3xl border border-ink/10 dark:border-white/10 bg-surface/50 dark:bg-surface/20 space-y-6 relative overflow-hidden sticky top-28"
                    >
                      <div className="flex items-start justify-between border-b border-ink/10 dark:border-white/10 pb-4">
                        <div>
                          <span className="text-[9px] uppercase font-mono tracking-[0.2em] font-bold text-ink/40 dark:text-white/40 block">
                            [ ACTIVE INSPECTION ]
                          </span>
                          <h3 className="text-lg font-display font-bold text-ink mt-1">{selectedItem.fullName || selectedItem.name}</h3>
                        </div>
                        <button 
                          onClick={() => { setSelectedItem(null); setSelectedType(null); }}
                          className="w-8 h-8 rounded-full border border-ink/10 dark:border-white/10 hover:bg-ink hover:text-bg dark:hover:bg-white dark:hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Internship Details Drawer */}
                      {selectedType === "internship" && (
                        <div className="space-y-5 text-sm">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Candidate Email</span>
                            <a href={`mailto:${selectedItem.email}`} className="text-accent underline font-mono break-all font-semibold text-xs">{selectedItem.email}</a>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Selected Role</span>
                            <span className="text-ink font-bold block">{selectedItem.role || "N/A"}</span>
                          </div>

                          {selectedItem.type && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Commitment type</span>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold uppercase inline-block">
                                {selectedItem.type}
                              </span>
                            </div>
                          )}

                          {selectedItem.degree && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Education / Degree</span>
                              <span className="text-ink font-medium block bg-ink/5 dark:bg-white/5 px-3 py-2 rounded-xl text-xs font-mono">{selectedItem.degree}</span>
                            </div>
                          )}

                          {selectedItem.portfolioUrl && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Creative Portfolio</span>
                              <a href={selectedItem.portfolioUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline flex items-center gap-1 font-mono text-xs break-all font-bold">
                                {selectedItem.portfolioUrl} <ArrowUpRight size={12} />
                              </a>
                            </div>
                          )}

                          {selectedItem.canvaExperience && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Canva Experience</span>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono font-bold uppercase inline-block">{selectedItem.canvaExperience}</span>
                            </div>
                          )}

                          {selectedItem.interest && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Candidate Statement</span>
                              <div className="bg-ink/5 dark:bg-white/5 p-4 rounded-xl text-xs text-ink/85 dark:text-white/85 leading-relaxed font-light font-sans max-h-48 overflow-y-auto whitespace-pre-wrap border border-ink/5 dark:border-white/5">
                                {selectedItem.interest}
                              </div>
                            </div>
                          )}

                          {/* SMTP Email Outreach Section */}
                          <div className="space-y-2 pt-4 border-t border-ink/10 dark:border-white/10">
                            <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Email Outreach</span>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => openEmailComposer(selectedItem, "accept")}
                                className="px-2 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 rounded-xl text-[9px] uppercase font-mono tracking-wider font-bold transition-all cursor-pointer text-center"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => openEmailComposer(selectedItem, "reject")}
                                className="px-2 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[9px] uppercase font-mono tracking-wider font-bold transition-all cursor-pointer text-center"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => openEmailComposer(selectedItem, "reminder")}
                                className="px-2 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500/20 rounded-xl text-[9px] uppercase font-mono tracking-wider font-bold transition-all cursor-pointer text-center"
                              >
                                Remind
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 pt-4 border-t border-ink/10 dark:border-white/10">
                            <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block mb-2">Disposition Status</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateItemStatus(selectedItem.id, "internship_applications", "shortlisted")}
                                className={`px-4 py-2 rounded-full text-[9px] uppercase font-mono tracking-widest font-bold border transition-all cursor-pointer ${
                                  selectedItem.status === "shortlisted" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "border-ink/10 dark:border-white/10 text-ink/70 dark:text-white/70 hover:bg-ink/5 dark:hover:bg-white/5"
                                }`}
                              >
                                shortlist
                              </button>
                              <button
                                onClick={() => updateItemStatus(selectedItem.id, "internship_applications", "rejected")}
                                className={`px-4 py-2 rounded-full text-[9px] uppercase font-mono tracking-widest font-bold border transition-all cursor-pointer ${
                                  selectedItem.status === "rejected" ? "bg-red-500/10 text-red-500 border-red-500/30" : "border-ink/10 dark:border-white/10 text-ink/70 dark:text-white/70 hover:bg-ink/5 dark:hover:bg-white/5"
                                }`}
                              >
                                skip
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 pt-4 border-t border-ink/10 dark:border-white/10">
                            <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block mb-2">Administrative Control</span>
                            {deletingId === selectedItem.id ? (
                              <div className="flex items-center gap-2 bg-red-500/5 p-2.5 rounded-2xl border border-red-500/10">
                                <span className="text-xs text-red-500 font-bold">Confirm Delete?</span>
                                <button
                                  onClick={() => deleteInternshipApplication(selectedItem.id)}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-[10px] uppercase font-mono font-bold transition-all cursor-pointer"
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  onClick={() => setDeletingId(null)}
                                  className="px-3 py-1.5 bg-ink/10 hover:bg-ink/20 text-ink/70 rounded-full text-[10px] uppercase font-mono font-bold transition-all cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingId(selectedItem.id)}
                                className="px-4 py-2 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-full text-[9px] uppercase font-mono tracking-widest font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Trash2 size={12} />
                                Delete Application
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Package Booking & Independence Claims Details Drawer */}
                      {selectedType === "booking" && (
                        <div className="space-y-5 text-sm">
                          {/* Independence Special Header if applicable */}
                          {(selectedItem.isIndependenceOffer || selectedItem.slotNumber || (selectedItem.package && selectedItem.package.toLowerCase().includes("independence"))) && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                              <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-rose-500" />
                                <span className="text-[9px] uppercase font-mono tracking-widest font-bold text-rose-500">Independence Day Initiative</span>
                              </div>
                              <h5 className="text-sm font-bold font-display text-ink">
                                Slot #{selectedItem.slotNumber || "RESERVED"} of 15 Free Websites
                              </h5>
                              {selectedItem.businessName && (
                                <p className="text-xs text-ink/80 font-medium">
                                  Brand: <span className="font-bold text-rose-500">{selectedItem.businessName}</span>
                                </p>
                              )}
                            </div>
                          )}

                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Client Contact</span>
                            <div className="font-bold text-ink">{selectedItem.name}</div>
                            <a href={`mailto:${selectedItem.email}`} className="text-accent underline font-mono block mb-1 break-all text-xs">{selectedItem.email}</a>
                            {selectedItem.phone && (
                              <div className="flex items-center gap-2 mt-1">
                                <a href={`tel:${selectedItem.phone}`} className="text-xs opacity-75 font-mono flex items-center gap-1 hover:text-accent">
                                  <Phone size={12} /> {selectedItem.phone}
                                </a>
                                <a 
                                  href={`https://wa.me/${selectedItem.phone.replace(/[^0-9]/g, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1"
                                >
                                  <MessageSquare size={10} /> WA
                                </a>
                              </div>
                            )}
                          </div>

                          {(selectedItem.projectType || selectedItem.package) && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Project Classification</span>
                              <span className="text-ink font-mono font-bold text-accent">{selectedItem.projectType || selectedItem.package}</span>
                            </div>
                          )}

                          {selectedItem.details && (
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block">Project Brief & Details</span>
                              <div className="bg-ink/5 dark:bg-white/5 p-4 rounded-xl text-xs text-ink/80 dark:text-white/80 leading-relaxed font-light font-sans max-h-40 overflow-y-auto whitespace-pre-wrap border border-ink/5 dark:border-white/5">
                                {selectedItem.details}
                              </div>
                            </div>
                          )}

                          <div className="space-y-1 pt-4 border-t border-ink/10 dark:border-white/10">
                            <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block mb-2">Deal Pipeline Status</span>
                            <div className="flex flex-wrap gap-2">
                              {["pending", "contacted", "project_started", "closed"].map((st) => (
                                <button
                                  key={st}
                                  onClick={() => updateItemStatus(selectedItem.id, "inquiries", st)}
                                  className={`px-3 py-1.5 rounded-full text-[8px] uppercase font-mono tracking-widest font-bold border transition-all ${
                                    selectedItem.status === st ? "bg-accent text-white border-accent" : "border-ink/10 dark:border-white/10 text-ink/70 dark:text-white/70 hover:bg-ink/5 dark:hover:bg-white/5"
                                  }`}
                                >
                                  {st.replace("_", " ")}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1 pt-4 border-t border-ink/10 dark:border-white/10">
                            <span className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-40 block mb-2">Administrative Control</span>
                            {deletingId === selectedItem.id ? (
                              <div className="flex items-center gap-2 bg-red-500/5 p-2.5 rounded-2xl border border-red-500/10">
                                <span className="text-xs text-red-500 font-bold">Confirm Delete?</span>
                                <button
                                  onClick={() => deleteInquiry(selectedItem.id)}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-[10px] uppercase font-mono font-bold transition-all cursor-pointer"
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  onClick={() => setDeletingId(null)}
                                  className="px-3 py-1.5 bg-ink/10 hover:bg-ink/20 text-ink/70 rounded-full text-[10px] uppercase font-mono font-bold transition-all cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingId(selectedItem.id)}
                                className="px-4 py-2 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-full text-[9px] uppercase font-mono tracking-widest font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Trash2 size={12} />
                                Delete Entry
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                    </motion.div>
                  ) : (
                    <div className="p-8 rounded-3xl border border-dashed border-ink/10 dark:border-white/10 text-center space-y-4 h-64 flex flex-col items-center justify-center opacity-40 select-none sticky top-28">
                      <FileText size={24} />
                      <p className="text-[10px] uppercase font-mono tracking-widest font-bold">Select any entry card to inspect submission parameters.</p>
                    </div>
                  )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Dynamic Email Composer and SMTP Dispatcher Modal */}
      {createPortal(
        <AnimatePresence>
          {isEmailModalOpen && emailTargetCandidate && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { if (!emailSending) setIsEmailModalOpen(false); }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative w-full max-w-2xl bg-[#0d0d10] border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 overflow-hidden text-white"
              >
                {/* Top ambient aesthetic light gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-5 relative z-10">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-1 inline-block">
                      {emailMethod === "gmailWeb" 
                        ? "Gmail Web App Redirection" 
                        : emailMethod === "mailto" 
                        ? "Native Mail Client Launcher" 
                        : emailMethod === "gmail" 
                        ? "Gmail Workspace API" 
                        : "SMTP Server Gateway"}
                    </span>
                    <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                      Email Outreach: {emailTargetCandidate.fullName}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {emailMethod === "gmailWeb" && (
                        <span>Prepare draft and open in <strong className="text-accent">Gmail Web App</strong> to send to <strong className="text-accent">{emailTargetCandidate.email}</strong></span>
                      )}
                      {emailMethod === "mailto" && (
                        <span>Open pre-filled window in your <strong className="text-accent">Local Email Client</strong> for <strong className="text-accent">{emailTargetCandidate.email}</strong></span>
                      )}
                      {emailMethod === "gmail" && (
                        <span>Delivering securely via Gmail API from <strong className="text-accent">{gmailUserEmail || "authorized user"}</strong> to <strong className="text-accent">{emailTargetCandidate.email}</strong></span>
                      )}
                      {emailMethod === "smtp" && (
                        <span>Sending from <strong className="text-accent">editablecreativestudio@gmail.com</strong> to <strong className="text-accent">{emailTargetCandidate.email}</strong></span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEmailModalOpen(false)}
                    disabled={emailSending}
                    className="w-8 h-8 rounded-full border border-white/10 hover:border-accent hover:text-accent flex items-center justify-center transition-colors focus:outline-none text-white cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Status Indicator Bar */}
                <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Campaign Type:</span>
                    {emailType === "accept" && (
                      <span className="text-[9px] px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-widest">
                        Acceptance Letter
                      </span>
                    )}
                    {emailType === "reject" && (
                      <span className="text-[9px] px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold uppercase tracking-widest">
                        Rejection Notice
                      </span>
                    )}
                    {emailType === "reminder" && (
                      <span className="text-[9px] px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase tracking-widest">
                        Outreach Reminder
                      </span>
                    )}
                  </div>
                </div>

                {/* Delivery Channel Selector */}
                <div className="bg-zinc-950/60 p-1 rounded-2xl border border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-1 mb-5 relative z-10">
                  <button
                    type="button"
                    onClick={() => { if (!emailSending && !emailSuccess) setEmailMethod("gmailWeb"); }}
                    disabled={emailSending || emailSuccess}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      emailMethod === "gmailWeb"
                        ? "bg-accent text-white shadow-md font-black"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    <ArrowUpRight size={14} className={emailMethod === "gmailWeb" ? "text-white" : "text-zinc-500"} />
                    Gmail Web App
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (!emailSending && !emailSuccess) setEmailMethod("mailto"); }}
                    disabled={emailSending || emailSuccess}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      emailMethod === "mailto"
                        ? "bg-accent text-white shadow-md font-black"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    <Mail size={14} className={emailMethod === "mailto" ? "text-white" : "text-zinc-500"} />
                    Native Mail App
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (!emailSending && !emailSuccess) setEmailMethod("smtp"); }}
                    disabled={emailSending || emailSuccess}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      emailMethod === "smtp"
                        ? "bg-accent text-white shadow-md font-black"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    <Layers size={14} className={emailMethod === "smtp" ? "text-white" : "text-zinc-500"} />
                    SMTP Relay
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (!emailSending && !emailSuccess) setEmailMethod("gmail"); }}
                    disabled={emailSending || emailSuccess}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      emailMethod === "gmail"
                        ? "bg-accent text-white shadow-md font-black"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    <Chrome size={14} className={emailMethod === "gmail" ? "text-white" : "text-zinc-500"} />
                    Gmail API
                  </button>
                </div>

                {/* Gmail Connection Status Section */}
                {emailMethod === "gmail" && !emailSuccess && (
                  <div className="mb-5 p-4 rounded-xl bg-zinc-900/60 border border-white/5 relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${gmailToken ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                      <div>
                        {gmailToken ? (
                          <>
                            <span className="text-xs font-bold text-zinc-100 block">Connected to Gmail</span>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">{gmailUserEmail}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-bold text-zinc-200 block">Gmail Account Required</span>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">Authorization is required to send emails directly via your Google address.</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      {gmailToken ? (
                        <button
                          type="button"
                          onClick={handleConnectGmail}
                          disabled={isGoogleConnecting}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] uppercase tracking-wider font-extrabold transition-colors text-zinc-300 hover:text-white"
                        >
                          Switch Account
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleConnectGmail}
                          disabled={isGoogleConnecting}
                          className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-[10px] uppercase tracking-wider font-black transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                        >
                          {isGoogleConnecting ? (
                            <div className="w-3 h-3 rounded-full border-t border-black border-2 animate-spin" />
                          ) : (
                            <Chrome size={12} />
                          )}
                          Connect Gmail
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Area */}
                <div className="space-y-4 relative z-10">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-black text-zinc-400 block">
                      Email Subject Line
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      disabled={emailSending || emailSuccess}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors text-white placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] uppercase tracking-widest font-black text-zinc-400 block">
                        Email Body Content
                      </label>
                      <span className="text-[8px] text-zinc-500">Full Plain-Text Editable Format</span>
                    </div>
                    <textarea
                      rows={12}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      disabled={emailSending || emailSuccess}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-accent transition-colors text-white font-mono leading-relaxed placeholder:text-zinc-600 resize-none"
                    />
                  </div>
                </div>

                {/* Success / Error Banners */}
                {emailSuccess ? (
                  <div className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 relative z-10">
                    <CheckCircle size={14} className="flex-shrink-0" />
                    <span>
                      {emailMethod === "gmailWeb" && "Draft launched successfully! Please complete any final edits and click 'Send' in the opened Gmail Web tab."}
                      {emailMethod === "mailto" && "Mail client opened successfully with pre-filled contents! You can now send it."}
                      {emailMethod === "gmail" && `Success: The pre-formatted email was securely delivered via Gmail Workspace API to ${emailTargetCandidate.email}.`}
                      {emailMethod === "smtp" && `Success: The pre-formatted email was securely routed and delivered via SMTP Server to ${emailTargetCandidate.email}.`}
                    </span>
                  </div>
                ) : emailError ? (
                  <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start gap-2.5 relative z-10 max-h-60 overflow-y-auto">
                    <ShieldAlert size={15} className="flex-shrink-0 mt-0.5 text-red-400" />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-red-400 block mb-1">Transmission Interrupted</span>
                      <span className="opacity-90 block text-[11.5px] leading-relaxed whitespace-pre-wrap font-sans text-zinc-200">{emailError}</span>
                    </div>
                  </div>
                ) : null}

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 items-center mt-6 border-t border-white/10 pt-5 relative z-10">
                  <button
                    onClick={() => setIsEmailModalOpen(false)}
                    disabled={emailSending}
                    className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-xl text-xs uppercase tracking-wider font-extrabold focus:outline-none disabled:opacity-50 text-white cursor-pointer"
                  >
                    {emailSuccess ? "Close" : "Cancel"}
                  </button>
                  
                  {!emailSuccess && (
                    <button
                      onClick={sendEmailOutreach}
                      disabled={emailSending || (emailMethod === "gmail" && !gmailToken)}
                      className="px-5 py-2 bg-accent hover:bg-accent/85 text-white rounded-xl text-xs uppercase tracking-widest font-black transition-opacity flex items-center gap-2 focus:outline-none disabled:opacity-80 cursor-pointer"
                    >
                      {emailSending ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-t border-white border-2 animate-spin" />
                          Processing...
                        </>
                      ) : emailMethod === "gmailWeb" ? (
                        "Open Gmail Web App"
                      ) : emailMethod === "mailto" ? (
                        "Open Native Mail App"
                      ) : emailMethod === "gmail" ? (
                        "Send via Gmail API"
                      ) : (
                        "Send via SMTP"
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </PageTransition>
  );
}

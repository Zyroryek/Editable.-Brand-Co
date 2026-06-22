import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let adminDbInstance: any = null;

function getAdminDb() {
  if (!adminDbInstance) {
    try {
      if (getApps().length === 0) {
        initializeApp({
          projectId: "gen-lang-client-0929192980"
        });
      }
      adminDbInstance = getFirestore(getApp(), "ai-studio-faa49e72-8ba8-4840-836d-70a6a54a905e");
      console.log("Firebase Admin SDK successfully connected to database: ai-studio-faa49e72-8ba8-4840-836d-70a6a54a905e");
    } catch (err) {
      console.error("Failed to initialize Firebase Admin SDK:", err);
      throw err;
    }
  }
  return adminDbInstance;
}

const ADMIN_CREDENTIALS: Record<string, string> = {
  "bharanidharan@editablecompany.co.in": "ceo@bharani",
  "dharani@editablecompany.co.in": "admin@dharani",
  "chitharth@editablecompany.co.in": "admin@chitharth",
  "roshinisephora@editablecompany.co.in": "admin@roshini"
};

function isValidAdmin(email?: string, passkey?: string): boolean {
  if (!email || !passkey) return false;
  const formatted = email.trim().toLowerCase();
  return ADMIN_CREDENTIALS[formatted] === passkey;
}

function formatTimestamp(field: any) {
  if (!field) return null;
  if (typeof field.toDate === "function") {
    return { seconds: Math.floor(field.toDate().getTime() / 1000) };
  }
  if (field._seconds) {
    return { seconds: field._seconds };
  }
  if (typeof field.seconds === "number") {
    return { seconds: field.seconds };
  }
  if (field instanceof Date) {
    return { seconds: Math.floor(field.getTime() / 1000) };
  }
  const dateNum = Date.parse(field);
  if (!isNaN(dateNum)) {
    return { seconds: Math.floor(dateNum / 1000) };
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON bodies
  app.use(express.json());

  // API endpoint for internship notifications
  app.post("/api/internship/apply", async (req, res) => {
    const { fullName, email, portfolioUrl, degree, interest, canvaExperience, role, type } = req.body;

    if (!fullName || !email || !portfolioUrl || !degree || !interest || !role || !type) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const host = process.env.EMAIL_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.EMAIL_PORT || "587");
    const user = process.env.EMAIL_USER || "editablecreativestudio@gmail.com";
    const pass = process.env.EMAIL_PASS;
    const recipient = process.env.COMPANY_EMAIL || "editablecreativestudio@gmail.com";

    console.log(`Received application from ${fullName} for ${role} (${type}). Recipient: ${recipient}`);

    if (!user || !pass) {
      console.warn("EMAIL_USER and EMAIL_PASS are not configured in environment variables. Saving application state to Firestore only.");
      res.json({ 
        success: true, 
        note: "Submitted successfully, but email notification is pending server credential configuration" 
      });
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // True for port 465 SSL, false for 587 TLS
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `"Editable Careers" <${user}>`,
        to: recipient,
        replyTo: email,
        subject: `🚨 New Internship Application: ${fullName} (${role} - ${type})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e4e4e7; border-radius: 16px; padding: 32px; color: #18181b; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #ff4d00; font-weight: bold; display: block; margin-bottom: 4px;">Candidate Submission</span>
              <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: -0.02em;">Internship Application</h2>
            </div>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b; width: 140px;">Applicant Name:</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: bold;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">Selected Role:</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #ff4d00; font-weight: bold;">${role}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">Commitment Type:</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: bold;">${type}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">Email Address:</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #0f172a;"><a href="mailto:${email}" style="color: #ff4d00; text-decoration: none; font-weight: 500;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">Education / Degree:</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #0f172a;">${degree}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">Canva Experience:</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #0f172a;"><span style="background-color: #ff4d00; color: #ffffff; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;">${canvaExperience}</span></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b; vertical-align: top;">Creative Portfolio:</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #0f172a; word-break: break-all;">
                    <a href="${portfolioUrl}" target="_blank" style="color: #ff4d00; text-decoration: underline; font-weight: 500;">
                      ${portfolioUrl}
                    </a>
                  </td>
                </tr>
              </table>
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 700; margin-bottom: 8px;">Why Editable Creative Studio?</p>
              <div style="background-color: #fafafa; border: 1px solid #f1f5f9; padding: 18px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">
                ${interest}
              </div>
            </div>

            <div style="margin-top: 32px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                Submitted on ${new Date().toLocaleString()} via Editable Careers Center
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Success: Notification email sent successfully to ${recipient}`);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Nodemailer SMTP failed to send mail:", err);
      // Fallback: Since Firestore is successfully written, treat deployment SMTP issue as a recoverable warning.
      res.json({ 
        success: true, 
        emailSent: false,
        note: `Saved to system, but email notification flow couldn't connect to SMTP servers: ${err?.message || err}` 
      });
    }
  });

  // Admin API Endpoints
  app.post("/api/admin/login", (req, res) => {
    const { email, passkey } = req.body;
    if (isValidAdmin(email, passkey)) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid credentials: Check email and passkey values." });
    }
  });

  app.post("/api/admin/get-data", async (req, res) => {
    const { email, passkey } = req.body;
    if (!isValidAdmin(email, passkey)) {
      res.status(401).json({ error: "Unauthorised access to executive datastores." });
      return;
    }

    try {
      const db = getAdminDb();

      // Retrieve all internship applicants
      const internshipSnapshot = await db.collection("secure_internship_registry").get();
      const internships = internshipSnapshot.docs
        .map((doc: any) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: formatTimestamp(data.createdAt)
          };
        })
        .filter((item: any) => !item.isDeleted);

      // Retrieve all general / package bookings
      const inquirySnapshot = await db.collection("inquiries").get();
      const inquiries = inquirySnapshot.docs
        .map((doc: any) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: formatTimestamp(data.createdAt)
          };
        })
        .filter((item: any) => !item.isDeleted);

      res.json({
        success: true,
        internships,
        inquiries
      });
    } catch (err: any) {
      console.error("Firebase Admin query failure:", err);
      res.status(500).json({ error: "Server failed querying executive collections", details: err?.message });
    }
  });

  app.post("/api/admin/update-status", async (req, res) => {
    const { email, passkey, collectionName, id, status } = req.body;
    if (!isValidAdmin(email, passkey)) {
      res.status(401).json({ error: "Unauthorised access to executive modifications." });
      return;
    }
    if (!id || !collectionName || !status) {
      res.status(400).json({ error: "Requested change lacks target parameters." });
      return;
    }

    try {
      const db = getAdminDb();
      const docRef = db.collection(collectionName).doc(id);
      await docRef.update({ status });
      res.json({ success: true });
    } catch (err: any) {
      console.error("Firebase Admin update failure:", err);
      res.status(500).json({ error: "Server failed applying updates to the specified record", details: err?.message });
    }
  });

  // Admin SMTP Dispatch API
  app.post("/api/admin/send-email", async (req, res) => {
    const { email, passkey, candidateEmail, subject, body } = req.body;

    if (!isValidAdmin(email, passkey)) {
      res.status(401).json({ error: "Unauthorised access to SMTP dispatch servers." });
      return;
    }

    if (!candidateEmail || !subject || !body) {
      res.status(400).json({ error: "Email dispatch requires candidateEmail, subject, and body parameters." });
      return;
    }

    const host = process.env.EMAIL_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.EMAIL_PORT || "587");
    const user = process.env.EMAIL_USER || "editablecreativestudio@gmail.com";
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.warn("EMAIL_USER and EMAIL_PASS are not configured in environment variables.");
      res.status(500).json({ 
        error: "SMTP credentials are not configured on the server. Please check your environment variables." 
      });
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `"Editable Careers" <${user}>`,
        to: candidateEmail,
        subject: subject,
        text: body,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e4e4e7; border-radius: 16px; padding: 36px; color: #18181b; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03); line-height: 1.6;">
            <div style="margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
              <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: -0.01em;">Editable Creative Studio</h2>
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #ff4d00; font-weight: bold;">Careers & Internships Desk</span>
            </div>
            
            <div style="font-size: 14.5px; color: #334155; white-space: pre-wrap;">${body}</div>

            <div style="margin-top: 36px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 24px;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                This email was dispatched securely by an authorized coordinator of Editable Creative Studio.
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Success: SMTP email sent to ${candidateEmail}`);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Nodemailer SMTP failed to send admin triggered mail:", err);
      res.status(500).json({ error: "Failed to dispatch email via SMTP server", details: err?.message || err });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const viteModuleName = "vite";
    const { createServer: createViteServer } = await import(viteModuleName);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully operational on http://0.0.0.0:${PORT}`);
  });
}

startServer();

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

const ADMIN_CREDENTIALS: Record<string, string[]> = {
  "bharanidharan@editablecompany.co.in": ["ceo@bharani"],
  "dharani@editablecompany.co.in": ["admin@dharani"],
  "chitharth@editablecompany.co.in": ["admin@chitharth"],
  "roshinisephora@editablecompany.co.in": ["admin@roshini"],
  "editablecreativestudio@gmail.com": ["admin@editable", "ceo@bharani", "admin@dharani", "admin@chitharth", "admin@roshini"]
};

function isValidAdmin(email?: string, passkey?: string): boolean {
  if (!email || !passkey) return false;
  const formatted = email.trim().toLowerCase();
  const allowed = ADMIN_CREDENTIALS[formatted];
  if (!allowed) return false;
  return allowed.includes(passkey);
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

interface SMTPOptions {
  host: string;
  port: number;
  user: string;
  pass: string | undefined;
  recipient: string;
}

function getSMTPOptions(): SMTPOptions {
  let host = (process.env.EMAIL_HOST || "smtp.gmail.com").trim();
  let portStr = (process.env.EMAIL_PORT || "587").trim();
  let user = (process.env.EMAIL_USER || "editablecreativestudio@gmail.com").trim();
  let pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : undefined;
  let recipient = (process.env.COMPANY_EMAIL || "editablecreativestudio@gmail.com").trim();

  // Auto-Detect swapped Host and Pass
  if (host.includes("@") && (!pass || pass === "smtp.gmail.com" || !pass.includes("@"))) {
    console.log(`[SMTP Config] Swapped EMAIL_HOST ("${host}") and EMAIL_PASS detected. Correcting...`);
    const temp = host;
    host = pass || "smtp.gmail.com";
    pass = temp;
  }

  // Sanitise host
  if (host.includes("@") || !host.includes(".")) {
    console.warn(`[SMTP Config] Invalid host detected: "${host}". Falling back to default "smtp.gmail.com".`);
    host = "smtp.gmail.com";
  }

  // Ensure port is number
  let port = parseInt(portStr);
  if (isNaN(port)) {
    port = 587;
  }

  return { host, port, user, pass, recipient };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Parse JSON bodies
  app.use(express.json());

  // Health check endpoint for Cloud Run and monitoring
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API endpoint for general / package inquiries and automated confirmation emails
  app.post("/api/inquiries", async (req, res) => {
    const { name, email, phone, businessName, package: packageName, details, slotNumber, isIndependenceOffer } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ error: "Name, email, and phone are required fields." });
      return;
    }

    try {
      const db = getAdminDb();
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        businessName: businessName?.trim() || "Independent Client",
        package: packageName || null,
        details: details?.trim() || "",
        slotNumber: slotNumber || null,
        isIndependenceOffer: isIndependenceOffer || false,
        status: "pending",
        createdAt: new Date()
      };

      const docRef = await db.collection("inquiries").add(payload);

      const { host, port, user, pass, recipient } = getSMTPOptions();
      let emailSent = false;
      let emailNote = "";

      if (user && pass) {
        try {
          const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
            tls: { rejectUnauthorized: false }
          });

          // 1. Send confirmation email to the user
          const userMailOptions = {
            from: `"Editable Creative Studio" <${user}>`,
            to: email.trim(),
            subject: `✨ Booking Confirmation: ${packageName || "Creative Project"}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e4e4e7; border-radius: 16px; padding: 32px; color: #18181b; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 24px;">
                  <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #ff4d00; font-weight: bold; display: block; margin-bottom: 4px;">Editable Creative Studio</span>
                  <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: -0.02em;">Booking & Inquiry Received</h2>
                </div>
                
                <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                  Hello <strong style="color: #0f172a;">${name.trim()}</strong>,
                </p>
                
                <p style="font-size: 14.5px; color: #334155; line-height: 1.6;">
                  Thank you for reaching out to us! We have successfully received your request for <strong style="color: #ff4d00;">${packageName || "Custom Creative Services"}</strong>. Our design leads are reviewing your project requirements and will get in touch with you within 24 hours.
                </p>

                <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9; margin: 24px 0;">
                  <h4 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-top: 0; margin-bottom: 12px; font-weight: 700;">Your Submission Summary</h4>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b; width: 130px;">Ecosystem:</td>
                      <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: bold;">${packageName || "General Inquiry"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">Company / Brand:</td>
                      <td style="padding: 6px 0; font-size: 13px; color: #0f172a;">${businessName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">Contact Email:</td>
                      <td style="padding: 6px 0; font-size: 13px; color: #ff4d00;">${email}</td>
                    </tr>
                  </table>
                </div>

                <div style="margin-top: 32px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                  <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                    Editable Creative Studio • Premium Branding & Digital Engineering
                  </p>
                </div>
              </div>
            `,
          };

          await transporter.sendMail(userMailOptions);

          // 2. Send notification email to admin/recipient
          const adminMailOptions = {
            from: `"Editable Studio Bot" <${user}>`,
            to: recipient,
            subject: `🚨 New Package Inquiry / Booking: ${name.trim()} (${packageName || "General"})`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e4e4e7; border-radius: 16px; padding: 32px; color: #18181b; background-color: #ffffff;">
                <h3 style="color: #ff4d00; text-transform: uppercase;">New Package Inquiry / Booking</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Company:</strong> ${businessName || "N/A"}</p>
                <p><strong>Package:</strong> ${packageName || "N/A"}</p>
                <p><strong>Details:</strong> ${details || "N/A"}</p>
              </div>
            `
          };
          await transporter.sendMail(adminMailOptions);

          emailSent = true;
          console.log(`[Email Service] Confirmation email sent to user (${email}) and notification sent to admin (${recipient})`);
        } catch (mailErr: any) {
          console.error("[Email Service] Failed to send SMTP mail:", mailErr);
          emailNote = `Inquiry saved to database, but email dispatch encountered SMTP error: ${mailErr?.message}`;
        }
      } else {
        emailNote = "Inquiry saved to database successfully. SMTP credentials are not configured.";
      }

      res.json({
        success: true,
        id: docRef.id,
        emailSent,
        note: emailNote
      });
    } catch (err: any) {
      console.error("Error processing inquiry booking:", err);
      res.status(500).json({ error: "Failed to store inquiry in database", details: err?.message });
    }
  });

  // API endpoint for internship notifications
  app.post("/api/internship/apply", async (req, res) => {
    const { fullName, email, portfolioUrl, degree, interest, canvaExperience, role, type } = req.body;

    if (!fullName || !email || !portfolioUrl || !degree || !interest || !role || !type) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const { host, port, user, pass, recipient } = getSMTPOptions();

    console.log(`[SMTP APPLY] Adjusted configuration: host="${host}", port=${port}, user="${user}", passPrefix="${pass ? pass.slice(0, 3) : "none"}", passSuffix="${pass ? pass.slice(-3) : "none"}", passLength=${pass ? pass.length : 0}`);

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

    const { host, port, user, pass } = getSMTPOptions();

    console.log(`[SMTP ADMIN] Adjusted configuration: host="${host}", port=${port}, user="${user}", passPrefix="${pass ? pass.slice(0, 3) : "none"}", passSuffix="${pass ? pass.slice(-3) : "none"}", passLength=${pass ? pass.length : 0}`);

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
      const errMsg = err?.message || String(err);
      let details = errMsg;
      let errorTitle = "Failed to dispatch email via SMTP server";

      if (errMsg.includes("535") || errMsg.toLowerCase().includes("accepted") || errMsg.toLowerCase().includes("invalid login")) {
        errorTitle = "SMTP Authentication Failed (Gmail Error 535)";
        details = "Your SMTP credentials were not accepted by Gmail.\n\n" +
          "💡 TO FIX THIS:\n" +
          "Standard Google account passwords do not support automated email dispatch. You must use a Google App Password instead:\n\n" +
          "1. Go to Google Account Settings (myaccount.google.com)\n" +
          "2. Navigate to 'Security' and ensure '2-Step Verification' is turned ON.\n" +
          "3. Search for 'App passwords' in the search bar or go to: Security -> App passwords.\n" +
          "4. Under App name, type a nickname like 'Editable Studio', and click Create.\n" +
          "5. Copy the newly generated 16-character code (it looks like 'xxxx xxxx xxxx xxxx').\n" +
          "6. Paste this code directly into the 'EMAIL_PASS' environment variable in your AI Studio settings (sidebar Settings -> Environment Variables) instead of your normal password.\n" +
          "7. Click save, restart your dev server, and retry dispatch!";
      } else if (errMsg.includes("ENOTFOUND")) {
        errorTitle = "SMTP Server Host Not Resolved (ENOTFOUND)";
        details = "The mail server address could not be resolved. Please verify that your EMAIL_HOST (e.g., smtp.gmail.com) environment variable in the sidebar Settings menu is spelled correctly.";
      } else if (errMsg.includes("ETIMEDOUT") || errMsg.includes("ECONNRESET") || errMsg.includes("ECONNREFUSED")) {
        errorTitle = "SMTP Connection Terminated";
        details = "The connection to the SMTP server timed out or was refused. Please check that your EMAIL_PORT (typically 587 or 465) matches the encryption protocol used by your provider.";
      }

      res.status(500).json({ error: errorTitle, details: details });
    }
  });

  // Global uncaught server exception handler to prevent HTML fallbacks on API routes
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled API exception caught:", err);
    res.status(500).json({
      error: "An unexpected server-side exception occurred.",
      details: err?.message || String(err)
    });
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
    app.use((req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully operational on http://0.0.0.0:${PORT}`);
  });
}

startServer();

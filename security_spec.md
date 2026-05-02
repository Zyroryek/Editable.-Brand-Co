# Security Specification: Editable.

## Data Invariants
1. A **User** profile can only be created by the user themselves, matching their UID.
2. An **Inquiry** is public but immutable once sent.
3. A **Project** must have a `clientId` referencing a valid `User`.
4. **Invoices** are children of `Projects`.
5. Only **Admins** (uid in `/admins/` collection) can access all inquiries and modify projects/invoices.

## The Dirty Dozen Payloads (Rejection Tests)
1. **Identity Spoofing**: Attempt to create a user profile with `userId` "attacker123" while logged in as "victim456".
2. **PII Leak**: Attempt to `get` another user's email as a non-admin.
3. **Inquiry Hijack**: Attempt to `list` all inquiries as a non-admin user.
4. **Project Poisoning**: Attempt to update a project's `status` to a non-enum value (e.g., "broken").
5. **Ghost Field**: Send an update to a user profile with an extra field `isPro: true`.
6. **Self-Promotion**: Attempt to create a document in the `admins` collection.
7. **Negative Invoice**: Create an invoice with `amount: -5000`.
8. **Orphaned Invoice**: Create an invoice with a non-existent `projectId`.
9. **Time Travel**: Create a document with a hardcoded `createdAt` string instead of `serverTimestamp()`.
10. **State Shortcut**: Update a project `status` from "discovery" to "completed" without an admin role (if logic was client-side, but rules block non-admins).
11. **Malicious ID**: Create an inquiry with a 1MB string as the document ID.
12. **Anonymous Read**: Attempt to read projects without being signed in.

## Conflict Report
| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
| :--- | :--- | :--- | :--- |
| /users | Blocked (isOwner) | N/A | Blocked (size/key check) |
| /inquiries | Blocked (Admin only read) | Blocked (Create only) | Blocked (size check) |
| /projects | Blocked (isOwner/Admin) | Blocked (Admin only write) | Blocked (Admin only write) |
| /invoices | Blocked (isOwner/Admin) | Blocked (Admin only write) | Blocked (Admin only write) |

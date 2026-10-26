# Security Specification (Phase 0: Payload-First Security TDD)

## 1. Data Invariants
1. **PII Split Isolation**: User PII (`email`, `phone`, `address`, `pincode`) is stored exclusively in `/users/{userId}/private/{docId}` and never exposed in `/users/{userId}`. Only the owner (`request.auth.uid == userId`) or a verified admin (`isAdmin()`) can read or write `/users/{userId}/private/{docId}`.
2. **Role & Privilege Escalation Prevention**: Users can only register with `role in ['customer', 'provider']`. Users can never self-assign `admin` or write to `/admins/{adminId}`.
3. **Provider Verification Integrity**: Providers cannot self-approve (`status == 'approved'` or `verified == true`) on creation or update. Only `isAdmin()` can set `status == 'approved'` or `verified == true`.
4. **Private Verification Documents**: Sensitive onboarding KYC references live in `/providerApplications/{appId}/privateDocs/{docId}` and are accessible only when the parent `/providerApplications/{appId}` belongs to `request.auth.uid` (Master Gate relational check) or `isAdmin()`.
5. **Booking Ownership & Terminal State Locking**: A booking can only be created by a verified user where `customerId == request.auth.uid` and `exists(/databases/$(database)/documents/providers/$(incoming().providerId))`. Once a booking reaches `'completed'` or `'cancelled'`, non-admin updates are locked.
6. **Secure List Queries**: Every `allow list` rule evaluates `resource.data` against `request.auth.uid` or public `status == 'approved'` / `'published'`, preventing unauthorized query scraping without O(n) `get()` calls.
7. **Temporal Integrity**: All `createdAt` and `updatedAt` timestamps must match `request.time`.

## 2. The "Dirty Dozen" Payloads (All Must Return `PERMISSION_DENIED`)
1. **Shadow Field Injection on User Create**: `{ uid: "u1", displayName: "Alice", role: "customer", isAdmin: true, createdAt: SERVER_TIME, updatedAt: SERVER_TIME }`
2. **Self-Assigned Admin Role**: `{ uid: "u1", displayName: "Alice", role: "admin", createdAt: SERVER_TIME, updatedAt: SERVER_TIME }`
3. **Spoofed Unverified Admin Email**: Authenticated with `email: "parineetha@tailshug.com"`, `email_verified: false` attempting to approve a provider.
4. **Cross-User PII Read**: `uid: "u2"` attempting `get(/users/u1/private/pii)`.
5. **Provider Self-Verification on Create**: `{ ownerId: "u1", businessName: "Paws", verified: true, status: "approved", ... }`
6. **Provider Update Gap (Modifying `verified` via Update)**: Provider owner updating `verified: true` on `/providers/p1`.
7. **Orphaned Booking Creation**: Creating a booking referencing a non-existent `providerId: "ghost_provider"`.
8. **Terminal Booking Mutation**: Customer updating a booking whose existing `status` is `'completed'` or `'cancelled'`.
9. **Unauthorized Private Doc Read**: `uid: "u2"` attempting `get(/providerApplications/app1/privateDocs/kyc)` where `app1.applicantId == "u1"`.
10. **Blanket List Scraping on Bookings**: `uid: "u1"` running an unconstrained `list` query on `/bookings` without `where('customerId', '==', 'u1')`.
11. **Value Poisoning on Pet Create**: Injecting a 5,000-character string into `name` or a non-numeric `ageYears`.
12. **Timestamp Forgery**: Creating a review with a backdated client timestamp (`createdAt != request.time`).

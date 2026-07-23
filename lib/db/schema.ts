import { pgTable, text, timestamp, boolean, serial, integer, numeric, jsonb } from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.
// The `user` table is extended with app fields (role, phone, box, flags).

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  // App extensions:
  role: text("role").notNull().default("CUSTOMER"), // CUSTOMER | ADMIN
  adminRoles: jsonb("adminRoles").$type<string[]>().notNull().default([]), // SUPER_ADMIN | OPERATIONS | CUSTOMER_SUPPORT
  phone: text("phone"),
  boxNumber: text("boxNumber").unique(),
  mustChangePassword: boolean("mustChangePassword").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables ------------------------------------------------------------

// Customer delivery profile (Argentina address + consents).
export const customerProfile = pgTable("customer_profile", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  street: text("street"),
  streetNumber: text("streetNumber"),
  floor: text("floor"),
  apartment: text("apartment"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postalCode"),
  references: text("references"),
  acceptedTerms: boolean("acceptedTerms").notNull().default(false),
  acceptedPrivacy: boolean("acceptedPrivacy").notNull().default(false),
  acceptedProhibited: boolean("acceptedProhibited").notNull().default(false),
  acceptedStorage: boolean("acceptedStorage").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Virtual wallet — one per customer. Balance is derived from the ledger.
export const wallet = pgTable("wallet", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull().unique(),
  availableBalance: numeric("availableBalance", { precision: 12, scale: 2 }).notNull().default("0"),
  pendingBalance: numeric("pendingBalance", { precision: 12, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Immutable wallet ledger. Never overwrite a balance — always append.
export const walletTransaction = pgTable("wallet_transaction", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  walletId: integer("walletId").notNull(),
  type: text("type").notNull(), // CREDIT | DEBIT
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  balanceAfter: numeric("balanceAfter", { precision: 12, scale: 2 }).notNull(),
  description: text("description").notNull(),
  reference: text("reference"),
  createdByUserId: text("createdByUserId"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Packages (WR records + everything downstream).
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(), // owning customer
  boxNumber: text("boxNumber"),
  status: text("status").notNull().default("EXPECTED"),
  trackingNumber: text("trackingNumber"),
  carrier: text("carrier"),
  store: text("store"),
  description: text("description"),
  quantity: integer("quantity"), // number of pieces; null = 1 (legacy-safe)
  declaredValue: numeric("declaredValue", { precision: 12, scale: 2 }),
  weightLb: numeric("weightLb", { precision: 10, scale: 2 }),
  lengthIn: numeric("lengthIn", { precision: 10, scale: 2 }),
  widthIn: numeric("widthIn", { precision: 10, scale: 2 }),
  heightIn: numeric("heightIn", { precision: 10, scale: 2 }),
  wrNumber: text("wrNumber"),
  cwrNumber: text("cwrNumber"),
  awNumber: text("awNumber"),
  mawbNumber: text("mawbNumber"),
  warehouseLocation: text("warehouseLocation"),
  photos: jsonb("photos").$type<string[]>().notNull().default([]),
  notes: text("notes"),
  receivedByUserId: text("receivedByUserId"),
  receivedByName: text("receivedByName"),
  workstation: text("workstation"),
  receivedAt: timestamp("receivedAt"),
  consolidationId: integer("consolidationId"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Customer pre-alerts for inbound packages.
export const prealerts = pgTable("prealerts", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  store: text("store").notNull(),
  trackingNumber: text("trackingNumber"),
  carrier: text("carrier"),
  description: text("description"),
  estimatedValue: numeric("estimatedValue", { precision: 12, scale: 2 }),
  status: text("status").notNull().default("PENDING"), // PENDING | MATCHED
  matchedPackageId: integer("matchedPackageId"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Consolidation requests (CWR).
export const consolidations = pgTable("consolidations", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  cwrNumber: text("cwrNumber"),
  status: text("status").notNull().default("REQUESTED"), // REQUESTED | PROCESSING | COMPLETED
  packageIds: jsonb("packageIds").$type<number[]>().notNull().default([]),
  notes: text("notes"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Audit log for admin logins and sensitive actions.
export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  actorUserId: text("actorUserId"),
  actorName: text("actorName"),
  action: text("action").notNull(),
  entityType: text("entityType"),
  entityId: text("entityId"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  ipAddress: text("ipAddress"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Named sequential counters (box numbers, WR/CWR/AW numbers).
export const counters = pgTable("counters", {
  name: text("name").primaryKey(),
  value: integer("value").notNull().default(0),
})

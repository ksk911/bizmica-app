# 🛡️ Patrol and Incident Reporting System (PAIRS)
### Database Schema Reference — MySQL Edition

> **Internal Technical Document** | April 2026 | v1.0  
> For developers, architects, QA engineers, and technical project managers.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Architecture Decisions](#architecture-decisions)
4. [Schema Summary](#schema-summary)
5. [Category: Master Data](#category-master-data)
6. [Category: Access Control](#category-access-control)
7. [Category: Operations](#category-operations)
8. [Category: Checklists](#category-checklists)
9. [Category: Execution](#category-execution)
10. [Category: Incidents](#category-incidents)
11. [Category: Safety](#category-safety)
12. [Category: Tracking](#category-tracking)
13. [Category: Notifications](#category-notifications)
14. [Category: Audit](#category-audit)
15. [Image Storage Strategy](#image-storage-strategy)
16. [MySQL-Specific Notes](#mysql-specific-notes)
17. [Indexes & Performance](#indexes--performance)

---

## Overview

PAIRS is a multi-tenant web and mobile platform for security agencies to monitor, control, and document field patrol activities in real time. The database supports:

- **5 user roles** with granular, configurable permissions
- **2 checklist types** — Patrol (fixed questions) and Occurrence (free narrative)
- **Real-time GPS tracking** with OSM-based geofencing
- **SOS emergency management** with full lifecycle audit
- **Multi-company white-labeling** with per-client branding
- **Automated escalation** for unresolved incidents
- **Offline-first mobile** with server-sync on reconnect

**Total Tables: 29**  
**Database Engine: MySQL 8.0+**  
**Character Set: utf8mb4** (required for Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Odia support)

---

## Design Principles

### 1. Soft Delete Everywhere
Tables with a `deleted_at` column use soft deletion. Records are **never permanently removed** — they are deactivated by setting `deleted_at` to the current timestamp. This preserves historical data integrity so patrol records, incident reports, and audit logs remain fully traceable even after an officer, site, or shift is deactivated.

```sql
-- Soft delete example
UPDATE sites SET deleted_at = NOW() WHERE id = 42;

-- Query only active sites
SELECT * FROM sites WHERE deleted_at IS NULL;
```

### 2. Server-Side Timestamping
All patrol submissions, GPS pings, and checklist responses are stamped with the **server's UTC clock**, never the device's local clock. This prevents manual time manipulation and back-dated submissions.

### 3. Hierarchical Multi-Tenancy
Every piece of operational data is scoped to a `company_id`. A single deployment serves multiple clients with fully isolated data, reports, and branding.

### 4. Entity Hierarchy
```
Company
  └── Region
        └── Site (with OSM geofence)
              └── Patrol Zones / Shifts / Assignments
```

### 5. Login Flow
> ⚠️ **Important:** Users do NOT select their role on the login screen. That would be a security risk — anyone could claim Super Admin.

Correct flow:
```
User enters Employee ID + Password
        ↓
System looks up their roles from user_roles table
        ↓
If multiple roles exist → show Role Switcher screen
        ↓
Dashboard loads based on selected role scope
```

---

## Architecture Decisions

### OpenStreetMap for Geofencing
City and district data is **not maintained in a separate cities table**. When a site is created by dropping a pin on the OSM map, a single Nominatim reverse geocode API call resolves and caches the city, state, and country on the `sites` table directly.

```
Admin drops pin on OSM map
        ↓
One call to Nominatim API → returns city, state, country
        ↓
Cached in sites.osm_city, sites.osm_state, sites.osm_country
        ↓
City-level filtering: WHERE osm_city = 'Pune'  ✅
```

### Image Storage (MySQL BLOB with Compression)
Images are stored directly in MySQL using `MEDIUMBLOB`. A **two-pass compression pipeline** keeps every image under 30–80 KB.

```
Officer takes photo on phone
        ↓
App-side compression (react-native-image-resizer)
  → Resize to max 1280px width
  → JPEG quality: 60%
  → Target: under 80 KB
        ↓
Sent to backend server
        ↓
Server-side Sharp.js second pass
  → Strip EXIF metadata
  → Further reduce if above threshold
  → Target: 30–50 KB final
        ↓
Store as MEDIUMBLOB in response_media / occurrence_media
```

**Why two passes?** You never trust the client alone. The server pass is your safety net and guarantees the 5 MB per file / 25 MB per session limits are enforced regardless of what the client sends.

**Free tier viability at 50 KB per photo:**

| MySQL Host | Free Storage | Photos @ 50KB | Days @ 750 photos/day |
|------------|-------------|---------------|----------------------|
| PlanetScale | 1 GB | ~20,000 | ~26 days |
| Railway | 1 GB | ~20,000 | ~26 days |
| Clever Cloud | 256 MB | ~5,000 | ~6 days |

> **Recommendation:** Start with BLOBs on free tier. When storage fills, migrate `image_data` to Cloudflare R2 (10 GB free, zero egress) and replace `image_data MEDIUMBLOB` with `file_url TEXT`. Schema change is isolated to two tables only.

---

## Schema Summary

| # | Table | Category | Spec Reference |
|---|-------|----------|---------------|
| 1 | `industries` | Master Data | Spec 1.15 |
| 2 | `companies` | Master Data | Spec 1.2, 12 |
| 3 | `regions` | Master Data | Spec 1.1 |
| 4 | `sites` | Master Data | Spec 1.3, OSM |
| 5 | `roles` | Access Control | Spec 1.6, 2.1–2.7 |
| 6 | `users` | Access Control | Spec 1.5, 1.16, 4.5 |
| 7 | `user_roles` | Access Control | Spec 1.17 |
| 8 | `role_permissions` | Access Control | Spec 2.8 |
| 9 | `reporting_hierarchy` | Access Control | Spec 1.7, 9.1 |
| 10 | `shifts` | Operations | Spec 1.10 |
| 11 | `user_site_assignments` | Operations | Spec 1.8, 9.4 |
| 12 | `site_holidays` | Operations | Spec 1.11 |
| 13 | `checklists` | Checklists | Spec 5.1, 5.5 |
| 14 | `checklist_questions` | Checklists | Spec 5.3 |
| 15 | `checklist_allocations` | Checklists | Spec 5.6, 5.7, 5.8 |
| 16 | `patrol_sessions` | Execution | Spec 6.x |
| 17 | `checklist_responses` | Execution | Spec 6.2, 6.8 |
| 18 | `response_media` | Execution | Spec 6.2 |
| 19 | `occurrences` | Execution | Occurrence Checklist |
| 20 | `occurrence_media` | Execution | Occurrence Checklist |
| 21 | `incident_catalogue` | Incidents | Spec 1.18 |
| 22 | `observation_catalogue` | Incidents | Spec 1.19 |
| 23 | `incidents` | Incidents | Spec 6.9, 6.10 |
| 24 | `escalation_matrix` | Incidents | Spec 9.2, 9.3 |
| 25 | `sos_events` | Safety | Spec 7.x |
| 26 | `gps_breadcrumbs` | Tracking | Spec 8.2, 8.3 |
| 27 | `notifications` | Notifications | Spec 7.3, 9.2 |
| 28 | `audit_logs` | Audit | Spec 2.10, 10.5 |
| 29 | `auth_sessions` | Audit | Spec 2.11, 4.6 |

---

## Category: Master Data

### 1. `industries`
**Purpose:** Foundational lookup table of industry types. Checklists are tagged to industries allowing the system to surface relevant question templates when onboarding a new client in a specific sector.

```sql
CREATE TABLE industries (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    is_active  TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Auto-incrementing primary key |
| `name` | VARCHAR(100) | Industry name e.g. Hotel, IT Park, Hospital. Must be unique |
| `is_active` | TINYINT(1) | Soft toggle to hide without deleting |
| `created_at` | DATETIME | Audit timestamp |

---

### 2. `companies`
**Purpose:** Top-level tenant table. Every client organisation managed by the security agency lives here. Stores white-labeling configuration — logo, primary/secondary colors, custom domain. All downstream data is scoped to a company.

```sql
CREATE TABLE companies (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(200) NOT NULL,
    industry_id      INT,
    logo_url         TEXT,
    primary_color    VARCHAR(7),
    secondary_color  VARCHAR(7),
    custom_domain    VARCHAR(200),
    is_active        TINYINT(1) DEFAULT 1,
    deleted_at       DATETIME DEFAULT NULL,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (industry_id) REFERENCES industries(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `name` | VARCHAR(200) | Legal or trading name of the client |
| `industry_id` | INT FK | Sector classification |
| `logo_url` | TEXT | URL of uploaded company logo for white-labeling |
| `primary_color` | VARCHAR(7) | HEX color code e.g. `#1A2B3C` |
| `secondary_color` | VARCHAR(7) | Secondary HEX for UI accents |
| `custom_domain` | VARCHAR(200) | Optional branded domain e.g. patrol.infosys.com |
| `is_active` | TINYINT(1) | Active toggle |
| `deleted_at` | DATETIME | Soft delete. NULL = active |
| `created_at` | DATETIME | Record creation timestamp |

---

### 3. `regions`
**Purpose:** Geographic or operational region under a company (e.g. North India, Western Maharashtra). Area Managers are scoped to regions. Sites belong to regions.

```sql
CREATE TABLE regions (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name       VARCHAR(100) NOT NULL,
    is_active  TINYINT(1) DEFAULT 1,
    deleted_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `company_id` | INT FK | Company this region belongs to |
| `name` | VARCHAR(100) | Region name e.g. Western Region, North Zone |
| `is_active` | TINYINT(1) | Active toggle |
| `deleted_at` | DATETIME | Soft delete |
| `created_at` | DATETIME | Audit timestamp |

---

### 4. `sites`
**Purpose:** Core operational unit. Every patrol, checklist, shift, and officer assignment is anchored here. Stores GPS coordinates and OSM geofence radius. City/state auto-resolved from OSM Nominatim on creation and cached here — no separate cities table needed.

```sql
CREATE TABLE sites (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    region_id            INT NOT NULL,
    company_id           INT NOT NULL,
    name                 VARCHAR(200) NOT NULL,
    address              TEXT,
    latitude             DECIMAL(9,6) NOT NULL,
    longitude            DECIMAL(9,6) NOT NULL,
    geofence_radius_m    INT NOT NULL DEFAULT 100,
    osm_city             VARCHAR(100),
    osm_state            VARCHAR(100),
    osm_country          VARCHAR(100),
    osm_place_id         BIGINT,
    safety_protocols     TEXT,
    client_contact_name  VARCHAR(100),
    client_contact_phone VARCHAR(20),
    is_active            TINYINT(1) DEFAULT 1,
    deleted_at           DATETIME DEFAULT NULL,
    created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id)  REFERENCES regions(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `region_id` | INT FK | Region this site belongs to |
| `company_id` | INT FK | Direct company link for faster queries |
| `name` | VARCHAR(200) | Site display name |
| `address` | TEXT | Full postal address |
| `latitude` | DECIMAL(9,6) | OSM center pin latitude |
| `longitude` | DECIMAL(9,6) | OSM center pin longitude |
| `geofence_radius_m` | INT | Circular geofence in meters. Officer must be within this to access checklists |
| `osm_city` | VARCHAR(100) | City resolved from OSM on creation. Enables `WHERE osm_city = 'Pune'` |
| `osm_state` | VARCHAR(100) | State resolved from OSM |
| `osm_country` | VARCHAR(100) | Country resolved from OSM |
| `osm_place_id` | BIGINT | OSM internal reference for future re-queries |
| `safety_protocols` | TEXT | Site-specific safety instructions shown to officers |
| `client_contact_name` | VARCHAR(100) | Client-side point of contact |
| `client_contact_phone` | VARCHAR(20) | Emergency contact at site |
| `is_active` | TINYINT(1) | Active toggle |
| `deleted_at` | DATETIME | Soft delete. Historical patrols remain linked |
| `created_at` | DATETIME | Creation timestamp |

---

## Category: Access Control

### 5. `roles`
**Purpose:** Defines the 7 system roles as a table (not a hardcoded enum) so new roles can be added by Super Admin without code changes.

```sql
CREATE TABLE roles (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(50) NOT NULL UNIQUE,
    scope     VARCHAR(30),
    is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed data
INSERT INTO roles (name, scope) VALUES
('SUPER_ADMIN',    'GLOBAL'),
('ADMIN',          'COMPANY'),
('DIRECTOR',       'COMPANY'),
('AREA_MANAGER',   'REGIONAL'),
('FIELD_OFFICER',  'MULTI_SITE'),
('SUPERVISOR',     'SITE'),
('CLIENT',         'VIEW_ONLY');
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `name` | VARCHAR(50) | Role identifier — see seed data above |
| `scope` | VARCHAR(30) | Data visibility: GLOBAL, COMPANY, REGIONAL, SITE, VIEW_ONLY |
| `is_active` | TINYINT(1) | Toggle to disable without deleting |

---

### 6. `users`
**Purpose:** Central identity record for every system user. Stores hashed credentials, profile photo for face-match authentication on shift start, optional device IMEI binding, and language preference for UI localization.

```sql
CREATE TABLE users (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    employee_id        VARCHAR(50)  NOT NULL UNIQUE,
    full_name          VARCHAR(150) NOT NULL,
    email              VARCHAR(150) UNIQUE,
    phone              VARCHAR(20)  NOT NULL UNIQUE,
    password_hash      TEXT         NOT NULL,
    profile_photo_url  TEXT,
    device_imei        VARCHAR(50),
    preferred_language VARCHAR(10)  DEFAULT 'en',
    company_id         INT,
    is_active          TINYINT(1)   DEFAULT 1,
    last_login_at      DATETIME     DEFAULT NULL,
    deleted_at         DATETIME     DEFAULT NULL,
    created_at         DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `employee_id` | VARCHAR(50) | Unique staff ID used for login. From HR Master |
| `full_name` | VARCHAR(150) | Display name |
| `email` | VARCHAR(150) | Optional. Used for report delivery |
| `phone` | VARCHAR(20) | Mobile number for OTP activation |
| `password_hash` | TEXT | Bcrypt-hashed. Never plain text |
| `profile_photo_url` | TEXT | Reference photo for liveness/face-match on login |
| `device_imei` | VARCHAR(50) | Optional device binding to prevent buddy-punching |
| `preferred_language` | VARCHAR(10) | Language code: en, hi, mr, ta, te, kn, bn |
| `company_id` | INT FK | Primary company affiliation |
| `is_active` | TINYINT(1) | Account active/suspended toggle |
| `last_login_at` | DATETIME | Last successful login for session auditing |
| `deleted_at` | DATETIME | Soft delete |
| `created_at` | DATETIME | Account creation timestamp |

---

### 7. `user_roles`
**Purpose:** Junction table assigning one or more roles to a user, scoped to a specific company and optionally a specific site. Supports the requirement that one user can hold multiple roles simultaneously.

```sql
CREATE TABLE user_roles (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    role_id    INT NOT NULL,
    company_id INT DEFAULT NULL,
    site_id    INT DEFAULT NULL,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    granted_by INT DEFAULT NULL,
    UNIQUE KEY uq_user_role_scope (user_id, role_id, company_id, site_id),
    FOREIGN KEY (user_id)    REFERENCES users(id),
    FOREIGN KEY (role_id)    REFERENCES roles(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (site_id)    REFERENCES sites(id),
    FOREIGN KEY (granted_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `user_id` | INT FK | User being assigned a role |
| `role_id` | INT FK | Role being assigned |
| `company_id` | INT FK | Scopes role to a company. NULL = global (Super Admin) |
| `site_id` | INT FK | Further scopes to a site. NULL = all sites in company |
| `granted_at` | DATETIME | When the role was assigned |
| `granted_by` | INT FK | Admin who made this assignment |

---

### 8. `role_permissions`
**Purpose:** Granular read/write/edit/delete permissions per role per module. Drives the Page Access Matrix. Data-driven so an Admin can change permissions at runtime without a code release.

```sql
CREATE TABLE role_permissions (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    role_id   INT          NOT NULL,
    module    VARCHAR(100) NOT NULL,
    can_read  TINYINT(1)   DEFAULT 0,
    can_write TINYINT(1)   DEFAULT 0,
    can_edit  TINYINT(1)   DEFAULT 0,
    can_delete TINYINT(1)  DEFAULT 0,
    UNIQUE KEY uq_role_module (role_id, module),
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `role_id` | INT FK | Role these permissions apply to |
| `module` | VARCHAR(100) | Module name: CHECKLIST_BUILDER, INCIDENT_HUB, SOS_MONITOR, REPORTS etc. |
| `can_read` | TINYINT(1) | Can view/list records |
| `can_write` | TINYINT(1) | Can create new records |
| `can_edit` | TINYINT(1) | Can modify existing records |
| `can_delete` | TINYINT(1) | Can soft-delete records |

---

### 9. `reporting_hierarchy`
**Purpose:** Stores the parent-child reporting chain between users. Drives automated escalation routing — when an incident is unresolved, the system traverses this chain to find who to notify next.

```sql
CREATE TABLE reporting_hierarchy (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    child_user_id  INT  NOT NULL,
    parent_user_id INT  NOT NULL,
    site_id        INT  DEFAULT NULL,
    effective_from DATE NOT NULL,
    effective_to   DATE DEFAULT NULL,
    UNIQUE KEY uq_hierarchy (child_user_id, parent_user_id, site_id),
    FOREIGN KEY (child_user_id)  REFERENCES users(id),
    FOREIGN KEY (parent_user_id) REFERENCES users(id),
    FOREIGN KEY (site_id)        REFERENCES sites(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `child_user_id` | INT FK | The subordinate user |
| `parent_user_id` | INT FK | The reporting manager |
| `site_id` | INT FK | Site context for this hierarchy link |
| `effective_from` | DATE | When this relationship became active |
| `effective_to` | DATE | End date. NULL = currently active |

---

## Category: Operations

### 10. `shifts`
**Purpose:** Defines shift timings per site with late-login buffer and cross-midnight support for night shifts. Checklists and user assignments are always bound to a shift.

> **Why `crosses_midnight`?** A night shift 22:00–06:00 spans two calendar dates. Without this flag, the system cannot determine if 02:00 AM falls within the shift. Pure `start_time < end_time` logic breaks for overnight shifts.

```sql
CREATE TABLE shifts (
    id                     INT AUTO_INCREMENT PRIMARY KEY,
    site_id                INT          NOT NULL,
    name                   VARCHAR(100) NOT NULL,
    start_time             TIME         NOT NULL,
    end_time               TIME         NOT NULL,
    crosses_midnight       TINYINT(1)   DEFAULT 0,
    late_login_buffer_mins INT          DEFAULT 15,
    is_active              TINYINT(1)   DEFAULT 1,
    deleted_at             DATETIME     DEFAULT NULL,
    created_at             DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES sites(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `site_id` | INT FK | Site this shift belongs to |
| `name` | VARCHAR(100) | Shift label: Morning, Afternoon, Night |
| `start_time` | TIME | Shift start (24-hour) |
| `end_time` | TIME | Shift end |
| `crosses_midnight` | TINYINT(1) | True if end_time is next calendar day |
| `late_login_buffer_mins` | INT | Grace period before login is flagged late |
| `is_active` | TINYINT(1) | Active toggle |
| `deleted_at` | DATETIME | Soft delete preserves historical records |
| `created_at` | DATETIME | Audit timestamp |

---

### 11. `user_site_assignments`
**Purpose:** Tracks which officers are assigned to which sites and shifts on which dates. Gatekeeper for checklist access. Enables Area Manager on-the-fly reassignment to cover absences.

```sql
CREATE TABLE user_site_assignments (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT        NOT NULL,
    site_id        INT        NOT NULL,
    shift_id       INT        DEFAULT NULL,
    assigned_by    INT        DEFAULT NULL,
    effective_from DATE       NOT NULL,
    effective_to   DATE       DEFAULT NULL,
    is_active      TINYINT(1) DEFAULT 1,
    UNIQUE KEY uq_assignment (user_id, site_id, shift_id, effective_from),
    FOREIGN KEY (user_id)     REFERENCES users(id),
    FOREIGN KEY (site_id)     REFERENCES sites(id),
    FOREIGN KEY (shift_id)    REFERENCES shifts(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `user_id` | INT FK | Officer or supervisor being assigned |
| `site_id` | INT FK | Site they are assigned to |
| `shift_id` | INT FK | Specific shift for this assignment |
| `assigned_by` | INT FK | Admin or Area Manager who created assignment |
| `effective_from` | DATE | Assignment start date |
| `effective_to` | DATE | End date. NULL = ongoing |
| `is_active` | TINYINT(1) | Quick toggle to pause an assignment |

---

### 12. `site_holidays`
**Purpose:** Site-specific holiday calendar. Suppresses or reduces checklist deployment on non-operational days. Different sites observe different holidays (hotel vs. IT park).

```sql
CREATE TABLE site_holidays (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    site_id      INT          NOT NULL,
    holiday_date DATE         NOT NULL,
    name         VARCHAR(100),
    UNIQUE KEY uq_site_holiday (site_id, holiday_date),
    FOREIGN KEY (site_id) REFERENCES sites(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `site_id` | INT FK | Site this holiday applies to |
| `holiday_date` | DATE | The holiday date |
| `name` | VARCHAR(100) | Holiday name for calendar display |

---

## Category: Checklists

### 13. `checklists`
**Purpose:** Master repository of all patrol and occurrence checklist templates. Draft checklists are never deployed to officers. Version number increments on each update.

```sql
CREATE TABLE checklists (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    title          VARCHAR(200) NOT NULL,
    checklist_type ENUM('PATROL','OCCURRENCE') NOT NULL,
    industry_id    INT          DEFAULT NULL,
    company_id     INT          DEFAULT NULL,
    site_id        INT          DEFAULT NULL,
    status         ENUM('DRAFT','PUBLISHED','ARCHIVED') DEFAULT 'DRAFT',
    version        INT          DEFAULT 1,
    frequency      ENUM('DAILY','WEEKLY','MONTHLY','PER_SHIFT'),
    created_by     INT          DEFAULT NULL,
    is_active      TINYINT(1)   DEFAULT 1,
    deleted_at     DATETIME     DEFAULT NULL,
    created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (industry_id) REFERENCES industries(id),
    FOREIGN KEY (company_id)  REFERENCES companies(id),
    FOREIGN KEY (site_id)     REFERENCES sites(id),
    FOREIGN KEY (created_by)  REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `title` | VARCHAR(200) | Checklist display name |
| `checklist_type` | ENUM | PATROL (fixed questions) or OCCURRENCE (free narrative) |
| `industry_id` | INT FK | Industry this template is designed for |
| `company_id` | INT FK | Optional — restrict to one company |
| `site_id` | INT FK | Optional — restrict to one site |
| `status` | ENUM | DRAFT (not deployed), PUBLISHED (live), ARCHIVED (retired) |
| `version` | INT | Incremented on each update |
| `frequency` | ENUM | How often this checklist runs |
| `created_by` | INT FK | Admin who created this template |
| `is_active` | TINYINT(1) | Active toggle |
| `deleted_at` | DATETIME | Soft delete |
| `created_at` | DATETIME | Creation timestamp |

---

### 14. `checklist_questions`
**Purpose:** Each individual question within a checklist template. Defines the blank exam paper — what questions exist and in what order. Officers cannot add, delete, or reorder questions.

```sql
CREATE TABLE checklist_questions (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    checklist_id  INT         NOT NULL,
    sequence_no   INT         NOT NULL,
    question_text TEXT        NOT NULL,
    response_type ENUM('YES_NO_NA','NUMERIC','MCQ') NOT NULL,
    UNIQUE KEY uq_question_seq (checklist_id, sequence_no),
    FOREIGN KEY (checklist_id) REFERENCES checklists(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `checklist_id` | INT FK | Checklist template this question belongs to |
| `sequence_no` | INT | Display order on mobile. Officers see questions in this order |
| `question_text` | TEXT | Full question text shown to the officer |
| `response_type` | ENUM | YES_NO_NA (toggle), NUMERIC (number input), MCQ (multiple choice) |

---

### 15. `checklist_allocations`
**Purpose:** Links a checklist template to a specific site, shift, and/or role for auto-deployment. When an officer starts their shift, this table is queried to determine which checklists appear on their task list. Also handles ad-hoc surprise audit assignments.

```sql
CREATE TABLE checklist_allocations (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    checklist_id INT        NOT NULL,
    site_id      INT        DEFAULT NULL,
    shift_id     INT        DEFAULT NULL,
    role_id      INT        DEFAULT NULL,
    is_adhoc     TINYINT(1) DEFAULT 0,
    assigned_to  INT        DEFAULT NULL,
    assigned_by  INT        DEFAULT NULL,
    valid_from   DATE       DEFAULT NULL,
    valid_to     DATE       DEFAULT NULL,
    created_at   DATETIME   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (checklist_id) REFERENCES checklists(id),
    FOREIGN KEY (site_id)      REFERENCES sites(id),
    FOREIGN KEY (shift_id)     REFERENCES shifts(id),
    FOREIGN KEY (role_id)      REFERENCES roles(id),
    FOREIGN KEY (assigned_to)  REFERENCES users(id),
    FOREIGN KEY (assigned_by)  REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `checklist_id` | INT FK | Checklist being allocated |
| `site_id` | INT FK | Target site. NULL = all sites |
| `shift_id` | INT FK | Target shift. NULL = all shifts |
| `role_id` | INT FK | Target role. NULL = all roles |
| `is_adhoc` | TINYINT(1) | True for surprise audit pushes by Area Managers |
| `assigned_to` | INT FK | For ad-hoc: specific user this is pushed to |
| `assigned_by` | INT FK | Manager who created this allocation |
| `valid_from` | DATE | Allocation start date |
| `valid_to` | DATE | End date. NULL = ongoing |
| `created_at` | DATETIME | Allocation creation timestamp |

---

## Category: Execution

### 16. `patrol_sessions`
**Purpose:** The envelope that wraps one complete patrol execution. Tracks who did the patrol, where, when, on which checklist, and the lifecycle from IN_PROGRESS through APPROVED or REJECTED. Without this table, individual question responses have no context.

```sql
CREATE TABLE patrol_sessions (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT            NOT NULL,
    checklist_id      INT            NOT NULL,
    site_id           INT            NOT NULL,
    shift_id          INT            DEFAULT NULL,
    allocation_id     INT            DEFAULT NULL,
    status            ENUM('IN_PROGRESS','DRAFT_SAVED','SUBMITTED','APPROVED','REJECTED')
                      DEFAULT 'IN_PROGRESS',
    started_at        DATETIME       DEFAULT NULL,
    submitted_at      DATETIME       DEFAULT NULL,
    completion_pct    DECIMAL(5,2)   DEFAULT 0.00,
    start_latitude    DECIMAL(9,6)   DEFAULT NULL,
    start_longitude   DECIMAL(9,6)   DEFAULT NULL,
    device_id         VARCHAR(100)   DEFAULT NULL,
    is_offline_submit TINYINT(1)     DEFAULT 0,
    created_at        DATETIME       DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)       REFERENCES users(id),
    FOREIGN KEY (checklist_id)  REFERENCES checklists(id),
    FOREIGN KEY (site_id)       REFERENCES sites(id),
    FOREIGN KEY (shift_id)      REFERENCES shifts(id),
    FOREIGN KEY (allocation_id) REFERENCES checklist_allocations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `user_id` | INT FK | Officer who performed this patrol |
| `checklist_id` | INT FK | Checklist template being executed |
| `site_id` | INT FK | Site where patrol took place |
| `shift_id` | INT FK | Shift during which session occurred |
| `allocation_id` | INT FK | Allocation that triggered this session |
| `status` | ENUM | IN_PROGRESS → DRAFT_SAVED → SUBMITTED → APPROVED/REJECTED |
| `started_at` | DATETIME | Server-stamped time checklist was opened |
| `submitted_at` | DATETIME | Server-stamped submission time. Cannot be device-manipulated |
| `completion_pct` | DECIMAL | Real-time progress shown as % on mobile UI |
| `start_latitude` | DECIMAL(9,6) | GPS at moment of checklist initiation |
| `start_longitude` | DECIMAL(9,6) | Paired with start_latitude |
| `device_id` | VARCHAR(100) | Device identifier to detect unexpected device submissions |
| `is_offline_submit` | TINYINT(1) | True if completed offline and synced later |
| `created_at` | DATETIME | Row creation timestamp |

---

### 17. `checklist_responses`
**Purpose:** Stores every individual answer to each question in a patrol session. This is the core field evidence data. Immutable after submission. Every performance metric and compliance report derives from these rows.

```sql
CREATE TABLE checklist_responses (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    session_id    INT          NOT NULL,
    question_id   INT          NOT NULL,
    response      ENUM('YES','NO','NA') DEFAULT NULL,
    numeric_value DECIMAL(10,2)         DEFAULT NULL,
    remark        TEXT,
    answered_at   DATETIME     NOT NULL,
    latitude      DECIMAL(9,6) DEFAULT NULL,
    longitude     DECIMAL(9,6) DEFAULT NULL,
    UNIQUE KEY uq_session_question (session_id, question_id),
    FOREIGN KEY (session_id)  REFERENCES patrol_sessions(id),
    FOREIGN KEY (question_id) REFERENCES checklist_questions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `session_id` | INT FK | Patrol session this answer belongs to |
| `question_id` | INT FK | Specific question being answered |
| `response` | ENUM | YES, NO, or NA for toggle questions |
| `numeric_value` | DECIMAL | Used when response_type is NUMERIC |
| `remark` | TEXT | Free-text note. Supports voice-to-text dictation |
| `answered_at` | DATETIME | Server-side timestamp. Tamper-proof |
| `latitude` | DECIMAL(9,6) | Location at exact moment of answering |
| `longitude` | DECIMAL(9,6) | Paired with latitude for per-checkpoint proof |

---

### 18. `response_media`
**Purpose:** Photo attachments submitted as evidence for individual checklist responses. Images stored as MEDIUMBLOB after two-pass compression (app + server) targeting 30–80 KB. File size stored for 25 MB session total limit enforcement.

```sql
CREATE TABLE response_media (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    response_id     INT        NOT NULL,
    media_type      ENUM('PHOTO') DEFAULT 'PHOTO',
    image_data      MEDIUMBLOB NOT NULL,
    file_size_bytes INT        NOT NULL,
    uploaded_at     DATETIME   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (response_id) REFERENCES checklist_responses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `response_id` | INT FK | Question-answer this photo is attached to |
| `media_type` | ENUM | PHOTO only (videos excluded for storage efficiency) |
| `image_data` | MEDIUMBLOB | Compressed photo data. Two-pass compression targets 30–80 KB |
| `file_size_bytes` | INT | Summed server-side to enforce 25 MB per session limit |
| `uploaded_at` | DATETIME | Server upload timestamp |

> **Migration path:** When storage scaling is needed, replace `image_data MEDIUMBLOB` with `file_url TEXT` and move files to Cloudflare R2. Schema change is isolated to this table only.

---

### 19. `occurrences`
**Purpose:** Free-text narrative entries within an occurrence checklist session. Unlike patrol checklists which have fixed questions, occurrence checklists allow unlimited open-ended entries, each auto-numbered sequentially per session.

```sql
CREATE TABLE occurrences (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    session_id  INT          NOT NULL,
    sequence_no INT          NOT NULL,
    description TEXT         NOT NULL,
    recorded_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    latitude    DECIMAL(9,6) DEFAULT NULL,
    longitude   DECIMAL(9,6) DEFAULT NULL,
    FOREIGN KEY (session_id) REFERENCES patrol_sessions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `session_id` | INT FK | Patrol session this occurrence belongs to |
| `sequence_no` | INT | Auto-incremented per session: 1, 2, 3... |
| `description` | TEXT | Full narrative text entered by the officer |
| `recorded_at` | DATETIME | Server-stamped entry time |
| `latitude` | DECIMAL(9,6) | GPS location at time of entry |
| `longitude` | DECIMAL(9,6) | Paired with latitude |

---

### 20. `occurrence_media`
**Purpose:** Photo evidence for individual occurrence entries. Kept separate from `response_media` to maintain clean data models — occurrences and patrol responses are distinct entities with different lifecycles.

```sql
CREATE TABLE occurrence_media (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    occurrence_id   INT        NOT NULL,
    media_type      ENUM('PHOTO') DEFAULT 'PHOTO',
    image_data      MEDIUMBLOB NOT NULL,
    file_size_bytes INT        NOT NULL,
    uploaded_at     DATETIME   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (occurrence_id) REFERENCES occurrences(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `occurrence_id` | INT FK | Occurrence entry this photo belongs to |
| `media_type` | ENUM | PHOTO only |
| `image_data` | MEDIUMBLOB | Compressed photo data |
| `file_size_bytes` | INT | For 25 MB total session limit enforcement |
| `uploaded_at` | DATETIME | Upload timestamp |

---

## Category: Incidents

### 21. `incident_catalogue`
**Purpose:** Standardized master list of threat types (Unauthorized Entry, Fire Hazard, Theft). Ensures consistent incident classification across all patrol units and enables structured analytics.

```sql
CREATE TABLE incident_catalogue (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    severity   ENUM('LOW','MEDIUM','HIGH','CRITICAL'),
    company_id INT          DEFAULT NULL,
    is_active  TINYINT(1)   DEFAULT 1,
    FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `name` | VARCHAR(150) | Incident type name shown in dropdown |
| `severity` | ENUM | LOW, MEDIUM, HIGH, CRITICAL. Drives escalation SLA timers |
| `company_id` | INT FK | NULL = global. Set = company-specific type |
| `is_active` | TINYINT(1) | Retire a type without deletion |

---

### 22. `observation_catalogue`
**Purpose:** Curated list of non-critical environmental anomalies (Flickering lights, Wet floor near exit). Separate from incident_catalogue because observations have different severity handling and escalation paths.

```sql
CREATE TABLE observation_catalogue (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT       NOT NULL,
    company_id  INT        DEFAULT NULL,
    is_active   TINYINT(1) DEFAULT 1,
    FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `description` | TEXT | Full description of this observation type shown to officers |
| `company_id` | INT FK | NULL = global. Set = company-specific |
| `is_active` | TINYINT(1) | Active toggle |

---

### 23. `incidents`
**Purpose:** Lifecycle management for every security incident. Tracks from Open through Under Investigation to Closed with full ownership trail. Drives the Incident Hub dashboard for managers.

```sql
CREATE TABLE incidents (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    session_id   INT          DEFAULT NULL,
    catalogue_id INT          DEFAULT NULL,
    reported_by  INT          NOT NULL,
    site_id      INT          NOT NULL,
    description  TEXT,
    status       ENUM('OPEN','UNDER_INVESTIGATION','CLOSED') DEFAULT 'OPEN',
    opened_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
    closed_at    DATETIME     DEFAULT NULL,
    closed_by    INT          DEFAULT NULL,
    latitude     DECIMAL(9,6) DEFAULT NULL,
    longitude    DECIMAL(9,6) DEFAULT NULL,
    FOREIGN KEY (session_id)   REFERENCES patrol_sessions(id),
    FOREIGN KEY (catalogue_id) REFERENCES incident_catalogue(id),
    FOREIGN KEY (reported_by)  REFERENCES users(id),
    FOREIGN KEY (site_id)      REFERENCES sites(id),
    FOREIGN KEY (closed_by)    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `session_id` | INT FK | Patrol session that triggered this incident |
| `catalogue_id` | INT FK | Incident type from catalogue |
| `reported_by` | INT FK | Officer who raised the incident |
| `site_id` | INT FK | Site where incident occurred |
| `description` | TEXT | Additional context for this specific incident |
| `status` | ENUM | OPEN → UNDER_INVESTIGATION → CLOSED |
| `opened_at` | DATETIME | Incident creation timestamp |
| `closed_at` | DATETIME | Resolution timestamp. NULL if still open |
| `closed_by` | INT FK | Manager who closed the incident |
| `latitude` | DECIMAL(9,6) | Exact GPS location of incident |
| `longitude` | DECIMAL(9,6) | Paired with latitude |

---

### 24. `escalation_matrix`
**Purpose:** Admin-configured SLA rules. Rules are set manually once; triggering is **fully automatic** via a background job. If an incident of a given severity is not closed within X hours, the system automatically notifies the next management level.

```sql
CREATE TABLE escalation_matrix (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    company_id         INT        DEFAULT NULL,
    incident_severity  ENUM('LOW','MEDIUM','HIGH','CRITICAL'),
    escalation_level   INT        NOT NULL,
    escalate_after_hrs INT        NOT NULL,
    notify_role_id     INT        DEFAULT NULL,
    notify_user_id     INT        DEFAULT NULL,
    is_active          TINYINT(1) DEFAULT 1,
    FOREIGN KEY (company_id)     REFERENCES companies(id),
    FOREIGN KEY (notify_role_id) REFERENCES roles(id),
    FOREIGN KEY (notify_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `company_id` | INT FK | NULL = global rule. Set = company-specific |
| `incident_severity` | ENUM | Which severity level this rule applies to |
| `escalation_level` | INT | 1 = first escalation, 2 = second, and so on |
| `escalate_after_hrs` | INT | Hours of inactivity before escalation fires. Admin-configured, auto-executed |
| `notify_role_id` | INT FK | Which role gets notified at this level |
| `notify_user_id` | INT FK | Optional — notify a specific user instead of a role |
| `is_active` | TINYINT(1) | Disable a rule without deleting it |

---

## Category: Safety

### 25. `sos_events`
**Purpose:** Records every SOS panic button activation as a Safety Ticket with full audit lifecycle. Separate from incidents because SOS is highest-priority and triggers simultaneous Push + SMS + Email alerts plus mandatory resolution report upload.

```sql
CREATE TABLE sos_events (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    triggered_by         INT          NOT NULL,
    site_id              INT          NOT NULL,
    trigger_latitude     DECIMAL(9,6) DEFAULT NULL,
    trigger_longitude    DECIMAL(9,6) DEFAULT NULL,
    status               ENUM('OPEN','ACKNOWLEDGED','UNDER_INVESTIGATION','RESOLVED')
                         DEFAULT 'OPEN',
    triggered_at         DATETIME     DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at      DATETIME     DEFAULT NULL,
    acknowledged_by      INT          DEFAULT NULL,
    resolved_at          DATETIME     DEFAULT NULL,
    resolved_by          INT          DEFAULT NULL,
    resolution_report_url TEXT        DEFAULT NULL,
    FOREIGN KEY (triggered_by)    REFERENCES users(id),
    FOREIGN KEY (site_id)         REFERENCES sites(id),
    FOREIGN KEY (acknowledged_by) REFERENCES users(id),
    FOREIGN KEY (resolved_by)     REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `triggered_by` | INT FK | Officer who triggered SOS |
| `site_id` | INT FK | Site of the emergency |
| `trigger_latitude` | DECIMAL(9,6) | Exact GPS at moment of SOS trigger |
| `trigger_longitude` | DECIMAL(9,6) | Paired with trigger_latitude |
| `status` | ENUM | OPEN → ACKNOWLEDGED → UNDER_INVESTIGATION → RESOLVED |
| `triggered_at` | DATETIME | Server timestamp of activation |
| `acknowledged_at` | DATETIME | When control room confirmed receipt |
| `acknowledged_by` | INT FK | Operator who acknowledged |
| `resolved_at` | DATETIME | When situation was fully resolved |
| `resolved_by` | INT FK | Manager who closed the safety ticket |
| `resolution_report_url` | TEXT | Mandatory uploaded resolution report on close |

---

## Category: Tracking

### 26. `gps_breadcrumbs`
**Purpose:** Continuous GPS location pings from active officers for real-time map display and historical patrol route playback. Every ping server-stamped to prevent manipulation.

> ⚠️ **High-volume table.** At 50 officers pinging every 30 seconds across a 8-hour shift, this generates ~48,000 rows per day. Partition by month in production and archive data older than 90 days.

```sql
CREATE TABLE gps_breadcrumbs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL,
    session_id  INT          DEFAULT NULL,
    latitude    DECIMAL(9,6) NOT NULL,
    longitude   DECIMAL(9,6) NOT NULL,
    accuracy_m  DECIMAL(6,2) DEFAULT NULL,
    is_mock     TINYINT(1)   DEFAULT 0,
    recorded_at DATETIME     NOT NULL,
    FOREIGN KEY (user_id)    REFERENCES users(id),
    FOREIGN KEY (session_id) REFERENCES patrol_sessions(id),
    INDEX idx_user_time (user_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT PK | Big integer — this table will have millions of rows |
| `user_id` | INT FK | Officer whose location is recorded |
| `session_id` | INT FK | Active patrol session this ping belongs to |
| `latitude` | DECIMAL(9,6) | GPS latitude |
| `longitude` | DECIMAL(9,6) | GPS longitude |
| `accuracy_m` | DECIMAL(6,2) | GPS accuracy in meters. Detects signal degradation |
| `is_mock` | TINYINT(1) | True if anti-spoofing detected a mock location app |
| `recorded_at` | DATETIME | Server atomic time. Device clock never trusted |

---

## Category: Notifications

### 27. `notifications`
**Purpose:** Log of every outbound alert across Push, SMS, and Email channels. Tracks delivery status for retry logic and provides proof of notification in case of disputes.

```sql
CREATE TABLE notifications (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id   INT          NOT NULL,
    channel        ENUM('PUSH','SMS','EMAIL') NOT NULL,
    event_type     VARCHAR(50),
    reference_id   INT          DEFAULT NULL,
    reference_type VARCHAR(50)  DEFAULT NULL,
    message        TEXT,
    status         ENUM('PENDING','SENT','FAILED') DEFAULT 'PENDING',
    sent_at        DATETIME     DEFAULT NULL,
    created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `recipient_id` | INT FK | User being notified |
| `channel` | ENUM | PUSH, SMS, or EMAIL |
| `event_type` | VARCHAR(50) | SOS_TRIGGERED, ESCALATION, INCIDENT_OPEN, PATROL_MISSED etc. |
| `reference_id` | INT | ID of source event (SOS ID, incident ID, session ID) |
| `reference_type` | VARCHAR(50) | What reference_id points to: SOS_EVENT, INCIDENT, SESSION |
| `message` | TEXT | Full notification message text |
| `status` | ENUM | PENDING, SENT, or FAILED. Retry job acts on FAILED rows |
| `sent_at` | DATETIME | When message was successfully dispatched |
| `created_at` | DATETIME | When notification was queued |

---

## Category: Audit

### 28. `audit_logs`
**Purpose:** Immutable system-wide log of every data change. Captures who changed what, when, and before/after values in JSON. Cannot be edited or deleted — it is the compliance backbone of the platform.

```sql
CREATE TABLE audit_logs (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT          DEFAULT NULL,
    action       VARCHAR(50),
    table_name   VARCHAR(100),
    record_id    INT          DEFAULT NULL,
    old_value    JSON         DEFAULT NULL,
    new_value    JSON         DEFAULT NULL,
    ip_address   VARCHAR(45)  DEFAULT NULL,
    performed_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_user_action  (user_id, performed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

> **Note:** MySQL 5.7.8+ supports the `JSON` column type natively.

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT PK | Big integer — accumulates indefinitely |
| `user_id` | INT FK | User who performed the action |
| `action` | VARCHAR(50) | CREATE, UPDATE, DELETE, LOGIN, LOGOUT |
| `table_name` | VARCHAR(100) | Which table was affected |
| `record_id` | INT | Primary key of the affected record |
| `old_value` | JSON | Previous state. NULL for CREATE |
| `new_value` | JSON | New state. NULL for DELETE |
| `ip_address` | VARCHAR(45) | Request IP for security tracing |
| `performed_at` | DATETIME | Exact server timestamp of change |

---

### 29. `auth_sessions`
**Purpose:** Server-side session management for all logged-in users. Enables forced remote logout, inactivity auto-timeout, and immediate invalidation of all sessions for a compromised account.

```sql
CREATE TABLE auth_sessions (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT          NOT NULL,
    token_hash     TEXT         NOT NULL,
    device_info    TEXT         DEFAULT NULL,
    ip_address     VARCHAR(45)  DEFAULT NULL,
    created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
    last_active_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    expires_at     DATETIME     NOT NULL,
    is_revoked     TINYINT(1)   DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_token (token_hash(64)),
    INDEX idx_user_active (user_id, is_revoked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Primary key |
| `user_id` | INT FK | Logged-in user |
| `token_hash` | TEXT | Hashed session token. Never plain text |
| `device_info` | TEXT | Device name and OS for active sessions display |
| `ip_address` | VARCHAR(45) | Login IP address |
| `created_at` | DATETIME | Login timestamp |
| `last_active_at` | DATETIME | Updated on every API call. Used for inactivity timeout |
| `expires_at` | DATETIME | Hard expiry time for this session |
| `is_revoked` | TINYINT(1) | Admin sets true to immediately invalidate a session |

---

## Image Storage Strategy

### Two-Pass Compression Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                    OFFICER'S PHONE                       │
│  Camera → react-native-image-resizer                     │
│  • Resize to max 1280px width                            │
│  • JPEG quality: 60%                                     │
│  • Output: ~80 KB                                        │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP POST
┌──────────────────────────▼──────────────────────────────┐
│                    BACKEND SERVER                        │
│  Sharp.js second pass                                    │
│  • Strip EXIF metadata (removes embedded GPS)            │
│  • Reduce further if above 80 KB threshold               │
│  • Output: 30–50 KB final                                │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                 MySQL MEDIUMBLOB                          │
│  • response_media.image_data                             │
│  • occurrence_media.image_data                           │
│  • file_size_bytes tracked for 25 MB session limit       │
└─────────────────────────────────────────────────────────┘
```

### Free Tier Capacity at 50 KB/photo

| Host | Free Storage | Capacity | Days @ 750 photos/day |
|------|-------------|----------|----------------------|
| Railway MySQL | 1 GB | ~20,000 photos | ~26 days |
| PlanetScale | 1 GB | ~20,000 photos | ~26 days |

### Migration Path to Cloud Storage

When free tier storage is exhausted, migration is a **single schema change on two tables**:

```sql
-- Step 1: Add URL column
ALTER TABLE response_media  ADD COLUMN file_url TEXT AFTER media_type;
ALTER TABLE occurrence_media ADD COLUMN file_url TEXT AFTER media_type;

-- Step 2: Migrate existing BLOBs to Cloudflare R2 (background job)

-- Step 3: Drop BLOB column
ALTER TABLE response_media   DROP COLUMN image_data;
ALTER TABLE occurrence_media DROP COLUMN image_data;
```

All other 27 tables are completely unaffected.

---

## MySQL-Specific Notes

### Character Set
Always create your database with `utf8mb4` for full multilingual support:
```sql
CREATE DATABASE pairs_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### Boolean Fields
MySQL has no native `BOOLEAN` type. Use `TINYINT(1)` where `1 = true` and `0 = false`.

### JSON Support
The `audit_logs` table uses MySQL's `JSON` column type, available from **MySQL 5.7.8+**. Ensure your MySQL version meets this minimum.

### MEDIUMBLOB Limits
`MEDIUMBLOB` supports up to 16 MB per value. With 50 KB compressed photos this is never a concern, but `max_allowed_packet` on your MySQL server must be set to at least `5M` to accept uploads:
```
[mysqld]
max_allowed_packet = 5M
```

### Storage Engine
All tables use `ENGINE=InnoDB` for transaction support and foreign key enforcement. Never use `MyISAM` for this schema.

---

## Indexes & Performance

Critical indexes beyond primary keys:

```sql
-- GPS breadcrumbs — most queried for live map
CREATE INDEX idx_breadcrumbs_user_time
    ON gps_breadcrumbs (user_id, recorded_at);

-- Audit logs — queried by table and record
CREATE INDEX idx_audit_table_record
    ON audit_logs (table_name, record_id);

-- Auth sessions — token lookup on every API call
CREATE INDEX idx_session_token
    ON auth_sessions (token_hash(64));

-- Patrol sessions — filtered by site and status constantly
CREATE INDEX idx_session_site_status
    ON patrol_sessions (site_id, status);

-- Incidents — open incident monitoring
CREATE INDEX idx_incidents_status_site
    ON incidents (status, site_id);

-- Notifications — retry job polls FAILED rows
CREATE INDEX idx_notifications_status
    ON notifications (status, created_at);
```

---

*Patrol and Incident Reporting System — Database Schema Reference*  
*MySQL Edition | v1.0 | April 2026*  
*Prepared for internal team use*

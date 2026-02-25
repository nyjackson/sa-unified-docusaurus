# Database Schema: Users (Coordinators) Table
**Context:** Employee (coordinator) directory. Used to map text-based names from HHAX CSV reports to clean IDs (`coordinator_id`) in the `clients` table.

**Update Policy:** Currently updated manually or via a separate script (not part of the automatic HHAX synchronization).

1. General Table Structure

| **Column Name** | **Type** | **Description** | **Usage in Sync** |
| --- | --- | --- | --- |
| `id` | SERIAL (PK) | Unique Employee ID. | Recorded in `clients.coordinator_id`. |
| `full_name` | VARCHAR | Clean name (no suffixes or codes). | UI display. |
| `display_name` | VARCHAR | "Raw" name from HHAX (e.g., "Name REG #123"). | **Primary Mapping Key.** |
| `internal_code` | VARCHAR | Internal employee number (e.g., "408"). | Secondary validation. |
| `department` | VARCHAR | Department (REG, CDP, CDPAP, etc.). | Distribution logic (Future). |
| `email` | VARCHAR | Employee email. | Notifications / Login. |
| `role` | VARCHAR | Role (usually 'coordinator'). | RBAC (Future). |
| `is_active` | BOOLEAN | Activity flag (true/false). | Mapping filter (only active users). |
| `created_at` | TIMESTAMP | Date record was created. | Audit. |

## Implementation Notes

- **The Mapping Strategy:** When the HHAX CSV is imported, the script looks at the "Coordinator" column. It performs a case-insensitive search against `display_name`. If a match is found, it pulls the `id` and attaches it to the client record.
- **Case Sensitivity:** It is highly recommended to use `ILIKE` or `LOWER()` on both sides during the mapping process to avoid issues with inconsistent CSV exports.
- **Status Filter:** Always ensure that `is_active = true` is part of your mapping query to prevent assigning clients to employees who have left the agency.
# Database Schema: Clients Table (V3 Architecture)
1. Table Structure: `public.clients`

| **Column Name** | **Type** | **Description** | **Source Priority** |
| --- | --- | --- | --- |
| **Identifiers** |  |  |  |
| `id` | SERIAL (PK) | Internal database primary key. | System |
| `admission_id` | VARCHAR | Unique Patient ID from HHAX (Sync Anchor). | HHAX |
| `cin_number` | VARCHAR | Medicaid ID (CIN). Essential for eMedNY API calls. | HHAX / eMedNY |
| **Flat Fields (Read Model)** |  | *Optimized for searching, sorting, and UI tables.* |  |
| `first_name` | VARCHAR | Patient's first name. | HHAX > eMedNY |
| `last_name` | VARCHAR | Patient's last name. | HHAX > eMedNY |
| `phone` | VARCHAR | Contact phone number. | HHAX |
| `language` | VARCHAR | Primary language. | HHAX |
| `agency_status` | VARCHAR | Internal status (ACTIVE, HOLD, DISCHARGED). | HHAX |
| `coordinator_id` | INT | Foreign Key to the `users` table. | HHAX (mapping) |
| `eligibility_status` | VARCHAR | Insurance status (ACTIVE/INACTIVE). | eMedNY |
| `anniversary_date` | DATE | Insurance anniversary date. | eMedNY |
| `plan_name` | VARCHAR | Primary plan name (MLTC). | eMedNY |
| `plan_code` | VARCHAR | Primary plan code. | eMedNY |
| `sec_plan_name` | VARCHAR | Secondary plan name. | eMedNY |
| **Sync Logic (V3)** |  | *Fields managing the reconciliation process.* |  |
| `sync_status` | VARCHAR | `synced` (clean) or `pending` (requires approval). | System |
| `hhax_hash` | VARCHAR | MD5 hash of `hhax_json`. Detects CSV changes. | System |
| `emedny_hash` | VARCHAR | MD5 hash of `emedny_json`. Detects API changes. | System |
| `hhax_updated_at` | TIMESTAMP | Last update timestamp from CSV import. | System |
| `emedny_checked_at` | TIMESTAMP | Last verification timestamp via API. | System |
| **JSON Storage** |  | *The data silos (see Section 2 for details).* |  |
| `hhax_json` | JSONB | **Source 1:** Raw data from HHAX. | HHAX |
| `emedny_json` | JSONB | **Source 2:** Raw data from eMedNY. | eMedNY |
| `current_data` | JSONB | **Result:** The Merged Business Object for the UI. | Merge(Src1, Src2) |
| `incoming_data` | JSONB | **Staging:** Change preview for `pending` status. | New Data |

## 2. Deep Dive: The JSON Fields

In the V3 architecture, we strictly segregate sources to prevent "data bleeding." We no longer store mixed data in the raw source fields.

### 🟢 A. `hhax_json` (Source 1: Identity & Operations)

Stores data retrieved exclusively from the HHAX CSV report.

- **Responsibility:** Identity, contact info, coordinator mapping, agency status.

**Database Example:**
```
{
"cin": "TB29139C",
"phone": "3473993856",
"patient": {
"last_name": "YU",
"first_name": "QIU"
},
"language": "Chinese",
"admission_id": "SAU-880075228",
"agency_status": "ACTIVE",
"coordinator_id": 408,
"emergency_contact": {
"name": "JIA TANG HE",
"phone": null,
"relation": "Son"
}
}
```
### 🔵 B. `emedny_json` (Source 2: Insurance & Billing)

Stores data retrieved exclusively from the eMedNY API response.

- **Responsibility:** Medicaid status, Recert/Anniv dates, Managed Care Plans (MLTC), official Address, Medicare details.

```json
{
  "meta": {
    "checked_at": "2026-01-06T19:39:13.653Z",
    "date_of_service": "01/06/2026"
  },
  "address": {
    "zip": "11229",
    "city": "BROOKLYN",
    "state": "NY"
  },
  "patient": {
    "dob": "06/26/1943", 
    "gender": "F",
    "medicaid_id": "TB29139C"
  },
  "coverage": {
    "status": "ACTIVE",
    "anniversary_date": "2026-01-01"
  },
  "plan_primary": {
    "name": "ELDERSERVE HEALTH INC MLTCP",
    "code": "EH"
  }
}
```

### 🟣 C. `current_data` (The Business Object)

This is the result of the `mergeData(hhax_json, emedny_json)` function. This JSON is what the frontend consumes for the client profile.

**Merge Rules:**

1. **Identity:** Names are pulled from `hhax_json` (to match the agency's legal records).
2. **Coverage/Dates/Plans:** Strictly pulled from `emedny_json`.
3. **Demographics (DOB/Gender):** Pulled from `emedny_json` (as HHAX data is often incomplete).
4. **Address:** Pulled from `emedny_json` (considered the official billing address).

### 🟠 D. `incoming_data` (Staging Area)

- **When `sync_status = 'synced'`:** Field is `NULL`.
- **When `sync_status = 'pending'`:** Contains a **Full Preview** object.
    - This is a *pre-merged* object (New Data + Existing Data from the other source).
    - It allows the Admin to see the complete picture in the UI comparison modal.

---

## 3. Core Workflows

### HHAX Import Process (Upsert)

1. Parse CSV row.
2. Calculate `newHash` from the raw data.
3. Compare with `hhax_hash` in the database.
4. If the hash differs: Generate `incoming_data` (New HHAX + Existing eMedNY) and set status to `pending`.
5. **Exception:** If the patient has no CIN (New Client), save immediately as `synced`.

### eMedNY Check Process (Upsert)

1. Request data from API.
2. Structure the response.
3. Calculate `newHash`.
4. If the hash differs: Generate `incoming_data` (New eMedNY + Existing HHAX) and set status to `pending`.

### Approve Action

1. Admin clicks "Approve."
2. Backend identifies the `_source` in `incoming_data`.
3. **If HHAX:** Only the HHAX portion is extracted and saved to `hhax_json`.
4. **If eMedNY:** Only the eMedNY portion is extracted and saved to `emedny_json`.
5. `current_data` is recalculated, and flat fields are updated.
6. Status is set to `synced`.
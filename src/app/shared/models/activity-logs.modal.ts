/* =========================================================================
   activity-logs.types.ts
   All TypeScript interfaces for the Activity Logs feature.
   Shape mirrors the exact backend contract provided.
   ========================================================================= */

export type EntityType       = 'project' | 'task';
export type ActionType       = 'created' | 'updated' | 'deleted';
export type SortOrder        = 'newest' | 'oldest';
export type EntityTypeFilter = 'all' | EntityType;
export type ActionTypeFilter = 'all' | ActionType;

// ─── Sub-shapes ──────────────────────────────────────────────────────────────

export interface ActivityUser {
  _id:   string;
  name:  string;
  email: string;
}

export interface ActivityProject {
  _id:    string;
  name:   string;
  status: string;
}

export interface ActivityTask {
  _id:      string;
  title:    string;
  status:   string;
  priority: string;
}

export interface ActivityChange {
  field:    string;
  oldValue: string | null;
  newValue: string | null;
}

// ─── Root shape (one entry from activityLogs[]) ──────────────────────────────

export interface ActivityLog {
  _id:        string;
  project:    ActivityProject | null;
  task:       ActivityTask    | null;
  user:       ActivityUser;
  entityType: EntityType;
  action:     ActionType;
  changes:    ActivityChange[];
  createdAt:  string; // ISO 8601
}

// ─── Backend response wrapper ─────────────────────────────────────────────────

export interface ActivityLogsResponse {
  activityLogs: ActivityLog[];
}

// ─── UI-level filter state ─────────────────────────────────────────────────────

export interface FilterState {
  search:     string;
  entityType: EntityTypeFilter;
  action:     ActionTypeFilter;
  projectId:  string | null;
  taskId:     string | null;
  sortOrder:  SortOrder;
}

import { AppService } from './../../../core/services/app';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ActivityChange, ActivityLog } from '../../models/activity-logs.modal';
import { TitleCasePipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-activity-log-card',
  imports: [TitleCasePipe, TranslatePipe],
  templateUrl: './activity-log-card.html',
  styleUrl: './activity-log-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogCard {
  readonly appService = inject(AppService);
  readonly translate = inject(TranslateService);
  /* ── Input ─────────────────────────────────────────────────────────────── */

  readonly log = input.required<ActivityLog>();

  /* ── Local UI state ────────────────────────────────────────────────────── */

  readonly showAllChanges = signal(false);

  readonly visibleChanges = computed((): ActivityChange[] => {
    const changes = this.log().changes ?? [];
    if (this.showAllChanges() || changes.length <= 3) return changes;
    return changes.slice(0, 3);
  });

  readonly hiddenCount = computed((): number => {
    const len = this.log().changes?.length ?? 0;
    return len > 3 ? len - 3 : 0;
  });

  /* ── Actions ───────────────────────────────────────────────────────────── */

  toggleChanges(): void {
    this.showAllChanges.update((v) => !v);
  }

  /* ── Date formatting ───────────────────────────────────────────────────── */

  formatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = Math.round((today.getTime() - target.getTime()) / 86_400_000);

    if (diff === 0) return `Today · ${time}`;
    if (diff === 1) return `Yesterday · ${time}`;
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${time}`;
  }

  /* ── User avatar ───────────────────────────────────────────────────────── */

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0] ?? '')
      .join('')
      .toUpperCase();
  }

  getUserAvatarClass(userId: string): string {
    const palette = [
      'bg-violet-500 text-white',
      'bg-blue-500 text-white',
      'bg-emerald-500 text-white',
      'bg-amber-500 text-white',
      'bg-rose-500 text-white',
      'bg-cyan-600 text-white',
    ];
    const idx = userId ? userId.charCodeAt(userId.length - 1) % palette.length : 0;
    return palette[idx];
  }

  /* ── Action → visual mapping ───────────────────────────────────────────── */

  /** Left border accent class */
  getCardBorderClass(action: string): string {
    const map: Record<string, string> = {
      created: 'border-l-emerald-500 dark:border-l-emerald-400',
      updated: 'border-l-amber-500 dark:border-l-amber-400',
      deleted: 'border-l-red-500 dark:border-l-red-400',
    };
    return map[action] ?? 'border-l-gray-300';
  }

  /** Pill badge around "Project Created" / "Task Updated" etc. */
  getActionBadgeClass(action: string): string {
    const map: Record<string, string> = {
      created: [
        'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        'dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-900/60',
      ].join(' '),
      updated: [
        'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
        'dark:bg-amber-950/60 dark:text-amber-400 dark:ring-amber-900/60',
      ].join(' '),
      deleted: [
        'bg-red-50 text-red-700 ring-1 ring-red-200',
        'dark:bg-red-950/60 dark:text-red-400 dark:ring-red-900/60',
      ].join(' '),
    };
    return map[action] ?? '';
  }

  /** Icon-wrapper background behind the entity icon */
  getEntityIconBgClass(entityType: string): string {
    const map: Record<string, string> = {
      project: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
      task: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    };
    return map[entityType] ?? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
  }

  /** Icon accent color for use on text */
  getActionIconClass(action: string): string {
    const map: Record<string, string> = {
      created: 'text-emerald-500 dark:text-emerald-400',
      updated: 'text-amber-500 dark:text-amber-400',
      deleted: 'text-red-500 dark:text-red-400',
    };
    return map[action] ?? 'text-gray-400';
  }

  /* ── Readable labels ───────────────────────────────────────────────────── */

  getActionLabel(action: string): string {
    return action.charAt(0).toUpperCase() + action.slice(1);
  }

  getEntityLabel(entityType: string): string {
    return entityType.charAt(0).toUpperCase() + entityType.slice(1);
  }

  /** camelCase / snake_case → "Human Readable Label" */
  formatFieldName(field: string): string {
    const OVERRIDES: Record<string, string> = {
      dueDate: 'Due Date',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      assignedTo: 'Assigned To',
      projectName: 'Project Name',
    };
    if (OVERRIDES[field]) return OVERRIDES[field];
    // camelCase → words
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  }

  /** Format a raw value for display (e.g. ISO dates → readable strings) */
  formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    // Date
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    // snake_case / kebab-case -> Title Case
    if (typeof value === 'string') {
      return value
        .replace(/[_-]+/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    return String(value);
  }

  /* ── Value-type detection for smart badges ─────────────────────────────── */

  private readonly STATUS_VALUES = new Set([
    'pending',
    'in_progress',
    'completed',
    'cancelled',
    'active',
    'archived',
    'suspended',
    'on_hold',
  ]);
  private readonly PRIORITY_VALUES = new Set(['low', 'medium', 'high', 'urgent', 'critical']);

  isStatusValue(v: string | null): boolean {
    if (typeof v !== 'string') {
      return false;
    }

    return this.STATUS_VALUES.has(v.toLowerCase().replaceAll(' ', '_'));
  }
  isPriorityValue(v: string | null): boolean {
    if (typeof v !== 'string') {
      return false;
    }
    return !!v && this.PRIORITY_VALUES.has(v.toLowerCase());
  }

  /* ── Badge class builders ──────────────────────────────────────────────── */

  readonly VALUE_BASE = 'inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full';

  getStatusBadgeClass(value: string | null): string {
    if (!value)
      return `${this.VALUE_BASE} bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400`;
    const key = value.toLowerCase().replace(/ /g, '_');
    const COLOR: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      in_progress: 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
      completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
      cancelled: 'bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400',
      active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
      archived: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
      suspended: 'bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
      on_hold: 'bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
    };
    return `${this.VALUE_BASE} ${COLOR[key] ?? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`;
  }

  getPriorityBadgeClass(value: string | null): string {
    if (!value)
      return `${this.VALUE_BASE} bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400`;
    const COLOR: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      medium: 'bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
      high: 'bg-orange-50 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
      urgent: 'bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400',
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300',
    };
    return `${this.VALUE_BASE} ${COLOR[value.toLowerCase()] ?? 'bg-gray-100 text-gray-500'}`;
  }

  getChangeBadgeClass(value: string | null): string {
    if (!value) return '';
    if (this.isStatusValue(value)) return this.getStatusBadgeClass(value);
    if (this.isPriorityValue(value)) return this.getPriorityBadgeClass(value);
    return '';
  }

  /** True when the value should render as a colored badge (not plain text) */
  shouldRenderBadge(value: string | null): boolean {
    return this.isStatusValue(value) || this.isPriorityValue(value);
  }
}

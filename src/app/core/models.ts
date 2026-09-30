export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface TaskStatusMeta {
  readonly value: TaskStatus;
  readonly label: string;
  readonly icon: string;
}

export const TASK_STATUSES: readonly TaskStatusMeta[] = [
  { value: 'todo', label: 'To Do', icon: 'radio_button_unchecked' },
  { value: 'in-progress', label: 'In Progress', icon: 'play_circle' },
  { value: 'review', label: 'In Review', icon: 'rate_review' },
  { value: 'done', label: 'Done', icon: 'check_circle' },
];

export interface Task {
  id: number;
  title: string;
  description: string;
  /** ISO date string (yyyy-MM-dd) or null when unset */
  startDate: string | null;
  endDate: string | null;
  assigneeId: number | null;
  status: TaskStatus;
}

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  phone: string;
  address: string;
  email: string;
  officeLocation: string;
  department: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  icon: string;
  memberIds: number[];
}

export function fullName(person: Person): string {
  return `${person.firstName} ${person.lastName}`;
}

export function initials(person: Person): string {
  return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
}

/** Stable avatar hue bucket so each person keeps their color across views. */
export function avatarHue(person: Person): number {
  return person.id % 6;
}

import { computed, effect, Injectable, signal } from '@angular/core';

import { Task, TaskStatus, TASK_STATUSES } from './models';
import { SEED_TASKS } from './seed-data';
import { readFromStorage, writeToStorage } from './storage';

const STORAGE_KEY = 'rubyflow.tasks.v1';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly tasksSignal = signal<Task[]>(readFromStorage(STORAGE_KEY, SEED_TASKS));

  readonly tasks = this.tasksSignal.asReadonly();
  readonly count = computed(() => this.tasks().length);

  /** Tasks grouped by status, preserving the order of the backing list. */
  readonly byStatus = computed(() => {
    const groups: Record<TaskStatus, Task[]> = {
      'todo': [],
      'in-progress': [],
      'review': [],
      'done': [],
    };
    for (const task of this.tasks()) {
      groups[task.status].push(task);
    }
    return groups;
  });

  constructor() {
    effect(() => writeToStorage(STORAGE_KEY, this.tasksSignal()));
  }

  add(input: Omit<Task, 'id'>): Task {
    const task: Task = { ...input, id: this.nextId() };
    this.tasksSignal.update((tasks) => [task, ...tasks]);
    return task;
  }

  update(task: Task): void {
    this.tasksSignal.update((tasks) => tasks.map((t) => (t.id === task.id ? task : t)));
  }

  remove(id: number): void {
    this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  /** Clears the assignee on every task owned by the removed person. */
  unassignPerson(personId: number): void {
    this.tasksSignal.update((tasks) =>
      tasks.map((t) => (t.assigneeId === personId ? { ...t, assigneeId: null } : t)),
    );
  }

  /**
   * Moves a task to a status column, inserting it at `toIndex` within that
   * column while keeping a single ordered task list as the source of truth.
   */
  move(taskId: number, toStatus: TaskStatus, toIndex: number): void {
    this.tasksSignal.update((tasks) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        return tasks;
      }
      const rest = tasks.filter((t) => t.id !== taskId);
      const moved: Task = { ...task, status: toStatus };

      const columnPositions = rest.reduce<number[]>((acc, t, i) => {
        if (t.status === toStatus) {
          acc.push(i);
        }
        return acc;
      }, []);

      const insertAt =
        toIndex < columnPositions.length
          ? columnPositions[toIndex]
          : columnPositions.length > 0
            ? columnPositions[columnPositions.length - 1] + 1
            : rest.length;

      return [...rest.slice(0, insertAt), moved, ...rest.slice(insertAt)];
    });
  }

  private nextId(): number {
    return this.tasks().reduce((max, t) => Math.max(max, t.id), 99) + 1;
  }
}

import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { Project } from './models';
import { PeopleStore } from './people-store';
import { SEED_PROJECTS } from './seed-data';
import { readFromStorage, writeToStorage } from './storage';

const STORAGE_KEY = 'rubyflow.projects.v1';

@Injectable({ providedIn: 'root' })
export class ProjectStore {
  private readonly peopleStore = inject(PeopleStore);
  private readonly projectsSignal = signal<Project[]>(
    readFromStorage(STORAGE_KEY, SEED_PROJECTS),
  );

  readonly projects = this.projectsSignal.asReadonly();
  readonly count = computed(() => this.projects().length);

  /** People not yet assigned to any project. */
  readonly unassigned = computed(() => {
    const assigned = new Set(this.projects().flatMap((p) => p.memberIds));
    return this.peopleStore.people().filter((person) => !assigned.has(person.id));
  });

  constructor() {
    effect(() => writeToStorage(STORAGE_KEY, this.projectsSignal()));
  }

  /**
   * Assigns a person to a project (or back to the unassigned pool when
   * `toProjectId` is null). A person belongs to at most one project.
   */
  move(personId: number, toProjectId: number | null): void {
    this.projectsSignal.update((projects) =>
      projects.map((project) => {
        const without = project.memberIds.filter((id) => id !== personId);
        if (project.id === toProjectId) {
          return { ...project, memberIds: [...without, personId] };
        }
        return without.length === project.memberIds.length ? project : { ...project, memberIds: without };
      }),
    );
  }

  /** Drops a removed person from every project roster. */
  removeMember(personId: number): void {
    this.move(personId, null);
  }
}

import { computed, effect, Injectable, signal } from '@angular/core';

import { Person } from './models';
import { SEED_PEOPLE } from './seed-data';
import { readFromStorage, writeToStorage } from './storage';

const STORAGE_KEY = 'rubyflow.people.v1';

@Injectable({ providedIn: 'root' })
export class PeopleStore {
  private readonly peopleSignal = signal<Person[]>(readFromStorage(STORAGE_KEY, SEED_PEOPLE));

  readonly people = this.peopleSignal.asReadonly();
  readonly count = computed(() => this.people().length);
  readonly byId = computed(() => new Map(this.people().map((p) => [p.id, p])));

  constructor() {
    effect(() => writeToStorage(STORAGE_KEY, this.peopleSignal()));
  }

  add(input: Omit<Person, 'id'>): Person {
    const person: Person = { ...input, id: this.nextId() };
    this.peopleSignal.update((people) => [...people, person]);
    return person;
  }

  update(person: Person): void {
    this.peopleSignal.update((people) => people.map((p) => (p.id === person.id ? person : p)));
  }

  remove(id: number): void {
    this.peopleSignal.update((people) => people.filter((p) => p.id !== id));
  }

  private nextId(): number {
    return this.people().reduce((max, p) => Math.max(max, p.id), 0) + 1;
  }
}

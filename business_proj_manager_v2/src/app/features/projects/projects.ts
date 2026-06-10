import { Component, computed, inject } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

import { avatarHue, fullName, initials, Person } from '../../core/models';
import { PeopleStore } from '../../core/people-store';
import { ProjectStore } from '../../core/project-store';

@Component({
  selector: 'app-projects',
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, MatIconModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  private readonly peopleStore = inject(PeopleStore);

  protected readonly projectStore = inject(ProjectStore);
  protected readonly fullName = fullName;
  protected readonly initials = initials;
  protected readonly avatarHue = avatarHue;

  /** Drop-list data for the unassigned pool; typed to match project ids. */
  protected readonly poolId: number | null = null;

  protected readonly rosters = computed(() => {
    const byId = this.peopleStore.byId();
    return this.projectStore.projects().map((project) => ({
      ...project,
      dropData: project.id as number | null,
      members: project.memberIds
        .map((id) => byId.get(id))
        .filter((person): person is Person => person !== undefined),
    }));
  });

  protected drop(event: CdkDragDrop<number | null>): void {
    const person = event.item.data as Person;
    this.projectStore.move(person.id, event.container.data);
  }
}

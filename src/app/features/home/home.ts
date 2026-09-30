import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PeopleStore } from '../../core/people-store';
import { ProjectStore } from '../../core/project-store';
import { TaskStore } from '../../core/task-store';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly taskStore = inject(TaskStore);
  private readonly peopleStore = inject(PeopleStore);
  private readonly projectStore = inject(ProjectStore);

  protected readonly stats = computed(() => {
    const byStatus = this.taskStore.byStatus();
    return [
      { label: 'Open tasks', value: byStatus['todo'].length + byStatus['in-progress'].length, icon: 'pending_actions', link: '/board' },
      { label: 'In review', value: byStatus['review'].length, icon: 'rate_review', link: '/board' },
      { label: 'Completed', value: byStatus['done'].length, icon: 'task_alt', link: '/board' },
      { label: 'Team members', value: this.peopleStore.count(), icon: 'group', link: '/people' },
      { label: 'Projects', value: this.projectStore.count(), icon: 'workspaces', link: '/projects' },
    ];
  });
}

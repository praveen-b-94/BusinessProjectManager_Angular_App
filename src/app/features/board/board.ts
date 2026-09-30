import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { avatarHue, fullName, initials, Task, TaskStatus, TASK_STATUSES } from '../../core/models';
import { PeopleStore } from '../../core/people-store';
import { TaskStore } from '../../core/task-store';
import { TaskDialog, TaskDialogResult } from './task-dialog';

@Component({
  selector: 'app-board',
  imports: [DatePipe, CdkDropListGroup, CdkDropList, CdkDrag, MatButtonModule, MatIconModule],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private readonly dialog = inject(MatDialog);
  private readonly taskStore = inject(TaskStore);
  private readonly peopleStore = inject(PeopleStore);

  protected readonly fullName = fullName;
  protected readonly initials = initials;
  protected readonly avatarHue = avatarHue;

  protected readonly columns = computed(() => {
    const groups = this.taskStore.byStatus();
    return TASK_STATUSES.map((status) => ({ ...status, tasks: groups[status.value] }));
  });

  protected assignee(task: Task) {
    return task.assigneeId !== null ? (this.peopleStore.byId().get(task.assigneeId) ?? null) : null;
  }

  protected drop(event: CdkDragDrop<TaskStatus>): void {
    const task = event.item.data as Task;
    this.taskStore.move(task.id, event.container.data, event.currentIndex);
  }

  protected openTaskDialog(task?: Task): void {
    this.dialog
      .open(TaskDialog, { data: { task: task ?? null }, width: '520px' })
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        if (result.action === 'save') {
          if (task) {
            this.taskStore.update({ ...result.value, id: task.id });
          } else {
            this.taskStore.add(result.value);
          }
        } else if (result.action === 'delete' && task) {
          this.taskStore.remove(task.id);
        }
      });
  }
}

import { Component, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { fullName, Task, TaskStatus, TASK_STATUSES } from '../../core/models';
import { PeopleStore } from '../../core/people-store';

export interface TaskDialogData {
  task: Task | null;
}

export type TaskDialogResult =
  | { action: 'save'; value: Omit<Task, 'id'> }
  | { action: 'delete' };

/** Validates that the end date is not before the start date. */
function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value as Date | null;
  const end = group.get('endDate')?.value as Date | null;
  return start && end && end < start ? { dateRange: true } : null;
}

function toIsoDate(value: Date | null): string | null {
  if (!value) {
    return null;
  }
  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 10);
}

@Component({
  selector: 'app-task-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.scss',
})
export class TaskDialog {
  private readonly dialogRef = inject<MatDialogRef<TaskDialog, TaskDialogResult>>(MatDialogRef);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly data = inject<TaskDialogData>(MAT_DIALOG_DATA);
  protected readonly peopleStore = inject(PeopleStore);
  protected readonly statuses = TASK_STATUSES;
  protected readonly fullName = fullName;

  protected readonly form = this.fb.group(
    {
      title: this.fb.control(this.data.task?.title ?? '', [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: this.fb.control(this.data.task?.description ?? ''),
      startDate: this.fb.control<Date | null>(
        this.data.task?.startDate ? new Date(this.data.task.startDate) : null,
      ),
      endDate: this.fb.control<Date | null>(
        this.data.task?.endDate ? new Date(this.data.task.endDate) : null,
      ),
      assigneeId: this.fb.control<number | null>(this.data.task?.assigneeId ?? null),
      status: this.fb.control<TaskStatus>(this.data.task?.status ?? 'todo'),
    },
    { validators: dateRangeValidator },
  );

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.dialogRef.close({
      action: 'save',
      value: {
        title: raw.title.trim(),
        description: raw.description.trim(),
        startDate: toIsoDate(raw.startDate),
        endDate: toIsoDate(raw.endDate),
        assigneeId: raw.assigneeId,
        status: raw.status,
      },
    });
  }

  protected delete(): void {
    this.dialogRef.close({ action: 'delete' });
  }
}

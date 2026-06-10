import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { avatarHue, fullName, initials, Person } from '../../core/models';
import { PeopleStore } from '../../core/people-store';
import { ProjectStore } from '../../core/project-store';
import { TaskStore } from '../../core/task-store';
import { ConfirmDialog, ConfirmDialogData } from '../../shared/confirm-dialog';
import { PersonDialog } from './person-dialog';

@Component({
  selector: 'app-people',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './people.html',
  styleUrl: './people.scss',
})
export class People {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly taskStore = inject(TaskStore);
  private readonly projectStore = inject(ProjectStore);

  protected readonly peopleStore = inject(PeopleStore);
  protected readonly fullName = fullName;
  protected readonly initials = initials;
  protected readonly avatarHue = avatarHue;

  protected openPersonDialog(person?: Person): void {
    this.dialog
      .open(PersonDialog, { data: { person: person ?? null }, width: '560px' })
      .afterClosed()
      .subscribe((value: Omit<Person, 'id'> | undefined) => {
        if (!value) {
          return;
        }
        if (person) {
          this.peopleStore.update({ ...value, id: person.id });
        } else {
          const added = this.peopleStore.add(value);
          this.snackBar.open(`${fullName(added)} joined the team.`, undefined, { duration: 3000 });
        }
      });
  }

  protected removePerson(person: Person): void {
    const data: ConfirmDialogData = {
      title: `Remove ${fullName(person)}?`,
      message: 'Their tasks become unassigned and they leave any project they belong to.',
      confirmLabel: 'Remove',
    };
    this.dialog
      .open(ConfirmDialog, { data })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (!confirmed) {
          return;
        }
        this.peopleStore.remove(person.id);
        this.taskStore.unassignPerson(person.id);
        this.projectStore.removeMember(person.id);
        this.snackBar.open(`${fullName(person)} was removed.`, undefined, { duration: 3000 });
      });
  }
}

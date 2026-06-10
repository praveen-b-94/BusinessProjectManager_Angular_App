import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Person } from '../../core/models';

export interface PersonDialogData {
  person: Person | null;
}

const PHONE_PATTERN = /^[0-9()+\-\s.]{7,}$/;

@Component({
  selector: 'app-person-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './person-dialog.html',
  styleUrl: './person-dialog.scss',
})
export class PersonDialog {
  private readonly dialogRef = inject<MatDialogRef<PersonDialog, Omit<Person, 'id'>>>(MatDialogRef);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly data = inject<PersonDialogData>(MAT_DIALOG_DATA);

  protected readonly form = this.fb.group({
    firstName: this.fb.control(this.data.person?.firstName ?? '', Validators.required),
    lastName: this.fb.control(this.data.person?.lastName ?? '', Validators.required),
    jobTitle: this.fb.control(this.data.person?.jobTitle ?? '', Validators.required),
    email: this.fb.control(this.data.person?.email ?? '', [Validators.required, Validators.email]),
    phone: this.fb.control(this.data.person?.phone ?? '', Validators.pattern(PHONE_PATTERN)),
    address: this.fb.control(this.data.person?.address ?? ''),
    officeLocation: this.fb.control(this.data.person?.officeLocation ?? ''),
    department: this.fb.control(this.data.person?.department ?? ''),
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.dialogRef.close({
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      jobTitle: raw.jobTitle.trim(),
      email: raw.email.trim(),
      phone: raw.phone.trim(),
      address: raw.address.trim(),
      officeLocation: raw.officeLocation.trim(),
      department: raw.department.trim(),
    });
  }
}

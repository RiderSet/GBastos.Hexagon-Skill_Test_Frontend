// src/app/features/dashboard/components/inline-editor.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inline-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div (click)="enableEdit()" class="inline-editor">
      <ng-container *ngIf="!editing; else editTemplate">
        {{ value || placeholder }}
      </ng-container>
      <ng-template #editTemplate>
        <input
          type="text"
          [(ngModel)]="editValue"
          (blur)="save()"
          (keydown.enter)="save()"
          (keydown.escape)="cancel()"
          class="inline-input"
          autofocus
        />
      </ng-template>
    </div>
  `,
  styles: [`
    .inline-editor {
      min-width: 50px;
      cursor: pointer;
      padding: 4px 6px;
      display: inline-block;
    }
    .inline-input {
      width: 100%;
      box-sizing: border-box;
      padding: 2px 4px;
    }
  `]
})
export class InlineEditor {
  @Input() value: string = '';
  @Input() placeholder: string = 'Clique para editar';
  @Output() valueChange = new EventEmitter<string>();

  editing: boolean = false;
  editValue: string = '';

  enableEdit() {
    this.editing = true;
    this.editValue = this.value;
  }

  save() {
    if (this.editValue !== this.value) {
      this.value = this.editValue;
      this.valueChange.emit(this.value);
    }
    this.editing = false;
  }

  cancel() {
    this.editing = false;
    this.editValue = this.value; // descarta alterações
  }
}
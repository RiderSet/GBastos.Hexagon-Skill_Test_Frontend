// src/app/features/dashboard/components/table-grid.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-table-grid',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  template: `
<table class="material-table">

  <thead>
    <tr cdkDropList (cdkDropListDropped)="drop($event)">
      <th>Imagem</th>
      <th *ngFor="let col of columns" cdkDrag>
        {{ col.header }}
      </th>
      <th>Ações</th>
    </tr>

    <tr class="filters">
      <th></th>
      <th *ngFor="let col of columns">
        <input (input)="filter(col.field,$event)" placeholder="Filtrar..." />
      </th>
      <th></th>
    </tr>
  </thead>

  <tbody>
    <tr *ngFor="let row of data"
        [class.selected]="isSelected(row)"
        (click)="selectRow(row)">

      <!-- Primeira célula: imagem -->
      <td class="image-cell">
        <img [src]="row.image" class="avatar" *ngIf="row.image">
      </td>

      <!-- Demais células: colunas -->
      <td *ngFor="let col of columns">
        {{ getValue(row, col.field) }}
      </td>

      <!-- Ações -->
      <td class="actions">
        <button type="button" (click)="edit.emit(row); $event.stopPropagation()">Editar</button>
        <button type="button" (click)="remove.emit(row); $event.stopPropagation()">Excluir</button>
      </td>
    </tr>
  </tbody>

</table>
`
})
export class TableGridComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();
  @Output() selected = new EventEmitter<any>();   // novo output

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  filter(field: string, event: any) { /* ... */ }

  isSelected(row: any): boolean {
    return this._selectedRow === row;
  }

  private _selectedRow: any;

  selectRow(row: any) {
    this._selectedRow = row;
    this.selected.emit(row);
  }

  getValue(row: any, field: string): any {
    return row[field];
  }
}
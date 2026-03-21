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
      <th class="checkbox">
        <input type="checkbox" (change)="toggleAll($event)">
      </th>

      <th *ngFor="let col of columns" cdkDrag>
        {{ col.header }}
      </th>

      <th>Ações</th>
    </tr>

    <tr class="filters">
      <th></th>

      <th *ngFor="let col of columns">
        <input
          (input)="filter(col.field,$event)"
          placeholder="Filtrar..."
        />
      </th>

      <th></th>
    </tr>

  </thead>

  <tbody>

    <tr *ngFor="let row of data"
        [class.selected]="isSelected(row)"
        (click)="toggleRow(row)">

      <td class="checkbox">
        <input
          type="checkbox"
          [checked]="isSelected(row)"
          (click)="$event.stopPropagation()"
          (change)="toggleRow(row)">
      </td>

      <td *ngFor="let col of columns">
        {{ row[col.field] }}
      </td>

      <td class="actions">
        <button (click)="edit.emit(row); $event.stopPropagation()">Editar</button>
        <button (click)="delete.emit(row); $event.stopPropagation()">Excluir</button>
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
  @Output() delete = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() filterChange = new EventEmitter<any>();

  selected: any[] = [];
  filters: any = {};

  toggleRow(row: any) {
    const index = this.selected.indexOf(row);

    if (index >= 0)
      this.selected.splice(index, 1);
    else
      this.selected.push(row);

    this.selectionChange.emit(this.selected);
  }

  toggleAll(event: any) {
    this.selected = event.target.checked ? [...this.data] : [];
    this.selectionChange.emit(this.selected);
  }

  isSelected(row: any) {
    return this.selected.includes(row);
  }

  filter(field: string, event: any) {
    this.filters[field] = event.target.value;
    this.filterChange.emit(this.filters);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}
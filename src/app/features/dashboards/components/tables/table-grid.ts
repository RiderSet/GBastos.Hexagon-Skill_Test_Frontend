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
    <tr *ngFor="let row of items"
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
        <button type="button" (click)="update.emit(row); $event.stopPropagation()">Alterar</button>
        <button type="button" (click)="remove.emit(row); $event.stopPropagation()">Excluir</button>
      </td>
    </tr>
  </tbody>

</table>
`,
  styleUrls: ['./table-grid.scss']
})
export class TableGridComponent {
  @Input() items: any[] = [];
  @Input() columns: any[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();
  @Output() rowSelected = new EventEmitter<any>();

  selectRow(row: any): void {
    this.rowSelected.emit(row);
  }

  isSelected(row: any): boolean {
    return false; // ajuste conforme sua lógica de seleção
  }

  getValue(row: any, field: string): any {
    return row[field];
  }

  filter(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    console.log(`Filtrar ${field} por ${value}`);
    // implementar lógica de filtro se necessário
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}
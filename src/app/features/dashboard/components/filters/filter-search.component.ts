// src/app/features/dashboard/components/filter-search.component.ts
import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-filter-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <input
        type="text"
        [(ngModel)]="search"
        (ngModelChange)="onSearch($event)"
        placeholder="Buscar..."
        class="search-input"
      />
    </div>
  `,
  styles: [`
    .search-container {
      margin-bottom: 10px;
    }

    .search-input {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
      outline: none;
    }

    .search-input:focus {
      border-color: #1976d2;
    }
  `]
})
export class FilterSearchComponent implements OnDestroy {

  @Output() searchChange = new EventEmitter<string>();

  search: string = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => this.searchChange.emit(value));
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
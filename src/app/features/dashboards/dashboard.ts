import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  editForm: FormGroup;
  items = [
    { nome: 'João', cidade: 'Rio', estado: 'RJ' },
    { nome: 'Maria', cidade: 'SP', estado: 'SP' }
  ];

  constructor() {
    this.editForm = this.fb.group({
      cidade: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  edit(item: any) {
    this.editForm.patchValue({ cidade: item.cidade, estado: item.estado });
  }

  save() {
    if (this.editForm.invalid) return;
    console.log('Form salvo', this.editForm.value);
  }
}
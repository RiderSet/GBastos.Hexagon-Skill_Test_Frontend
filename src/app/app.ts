import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 👈 IMPORTANTE

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // 👈 AQUI
  template: `<router-outlet></router-outlet>`
})
export class App {}
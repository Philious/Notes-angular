import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div>Test</div>
    <router-outlet />
  `,
  styles: ''
})
export class AppComponent {
  title = 'notes-angular';
}

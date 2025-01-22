import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { NoteService } from '../services/notes.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  styles: ''
})

export class AppComponent {
  constructor(userService: UserService, noteService: NoteService) { }
}

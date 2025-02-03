import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { NoteService } from '../services/notes.service';
import { ContextMenuService } from '../services/contextMenu.service';
import { DialogService } from '../services/dialogService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
})

export class AppComponent {
  constructor(
    userService: UserService,
    noteService: NoteService,
    dialogService: DialogService
  ) { }

}

import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login.page';
import { NotesPageComponent } from './pages/notes.page';
import { authGuard } from '../guards/auth.guard';
import { NoteService } from '../services/notes.service';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', title: 'Login', component: LoginPageComponent },
  {
    path: 'notes',
    title: 'Notes',
    component: NotesPageComponent,
    providers: [NoteService],
    canActivate: [authGuard],
  },
];

import { Routes } from '@angular/router';
import { LoginPage } from './pages/login.page';
import { NotesPage } from './pages/notes.page';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'notes', component: NotesPage },
];

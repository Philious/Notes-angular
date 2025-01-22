import { Routes } from '@angular/router';
import { CheckTokenPage } from './pages/checkToken.page';
import { LoginPage } from './pages/login.page';
import { NotesPage } from './pages/notes.page';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'notes', component: NotesPage },
  { path: '**', component: CheckTokenPage },
];

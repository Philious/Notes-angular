import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { InputLayoutComponent } from '../components/action/input.layout.component';
import { IconButtonComponent } from '../components/action/iconButton.component';
import { ButtonStyleEnum, IconEnum, InputState } from '../../helpers/enum';
import { UserService } from '../../services/user.service';
import { NoteService } from '../../services/notes.service';

export enum PageState {
  Login,
  NewUser,
  Forgot
}

@Component({
  selector: 'login',
  imports: [InputLayoutComponent, IconButtonComponent, ReactiveFormsModule, NgIf],
  template: `
    <div class="login-view">
      <div class="title">Notes</div>
      <form class="form" [formGroup]="profileForm" (ngSubmit)="onSubmit()">
        <input-layout [inputId]="'email'" [label]="'Email'" class="email" [state]="emailFieldState" [helpText]="emailFieldHelpText"> 
          <input id="email" type="text" formControlName="email" autocomplete="on" base-input />
        </input-layout>
        {{passwordFieldHelpText}}
        <input-layout [inputId]="'password'" [label]="'Password'"  class="password" [state]="passwordFieldState" [helpText]="passwordFieldHelpText"> 
          <input id="password" type="text" formControlName="password" base-input />
        </input-layout>
        <icon-button [icon]="IconEnum.Right" [buttonStyle]="ButtonStyleEnum.Filled" [type]="'submit'" class="action-btn"/>
        <div class="buttons">
          <button *ngIf="pageState != PageState.Login" class="vertical back" (click)="updateState(PageState.Login)" btn text-btn>Login</button>
          <button *ngIf="pageState != PageState.NewUser" class="vertical new" (click)="updateState(PageState.NewUser)" btn text-btn>New User</button>
          <button *ngIf="pageState != PageState.Forgot" class="vertical forgot" (click)="updateState(PageState.Forgot)" btn text-btn>Forgot\npassword</button>
        </div>
      </form>
    </div>
  `,
  styles: `
    .login-view {
      box-sizing: border-box;
      display: grid;
      gap: 1rem 0;
      place-content: center;
      width: 100vw;
      height: 100vh;
      padding: 2rem;
      max-width: 20rem;
      margin: auto;
      grid-template-rows: 1fr repeat(3, min-content) 1fr min-content;
      grid-template-columns: 1fr 3.5rem;
      place-items: center start;
      
      .title { grid-area: 2 / 1 / 3 / 2 }
      .email { grid-area: 3 / 1 / 4 / 2; }
      .password { grid-area: 4 / 1 / 5 / 2; }
      .action-btn { grid-area: 4 / 3 / 5 / 2; }
      .buttons { grid-area: 6 / 1 / 7 / 3; }
      .update-email-btn { transform: translateY(calc(-100% - .75rem)) }
    }
    .form { display: contents; }
    .action-btn {
      align-self: end;
      justify-self: end;
    }
  .buttons {
    display: grid;
    grid-template-columns: repeat(2, 3rem);
    position: relative;
    height: 6rem;
    width: 6rem;
    justify-content: flex-start;
    transform: scale(-1);
    overflow: hidden;
    transform-style: preserve-3d;
    perspective: 40rem;
  }
  .vertical {
    position: absolute;
    writing-mode: vertical-rl;
    transform-origin: top;
    text-align: left;
    height: 6rem;
    top: 0;
    white-space: pre;
    &.back,
    &.new {
      right: -.75rem;
    }
    &.forgot { right: 2.25rem; }
  }
  `
})

export class LoginPage {

  IconEnum = IconEnum;
  InputState = InputState;
  ButtonStyleEnum = ButtonStyleEnum;
  PageState = PageState;

  pageState = PageState.Login;

  emailFieldState = InputState.Default;
  emailFieldHelpText = '';

  passwordFieldState = InputState.Default;
  passwordFieldHelpText = '';


  helpText = (errors: ValidationErrors | null): string => {
    const key = Object.keys(errors ?? [])?.[0];
    if (typeof key === 'string') {
      return {
        required: 'Field is required.',
        email: 'Entry needs to be a valid email.',
        minlength: 'Entry needs to be atleast 6 charcters long.'
      }?.[key] ?? '';
    } else return ''
  }

  userService = inject(UserService);

  profileForm = new FormGroup({
    email: new FormControl('conny@carneval.com', [Validators.required, Validators.email]),
    password: new FormControl('12345†', [Validators.required, Validators.minLength(6)]),
  });

  updateState(state: PageState) {
    this.pageState = state;
  }

  onSubmit(): void {
    const email = this.profileForm.value.email ?? '';
    const pass = this.profileForm.value.password ?? '';

    if (this.profileForm.valid || (this.profileForm.controls.email.valid && this.pageState === PageState.Forgot)) {
      if (this.pageState === PageState.Login) {
        this.userService.login(email, pass);
      } else if (this.pageState === PageState.NewUser) {
        this.userService.createUser(email, pass)
      } else {
        this.userService.updatePassword(email)
      }
    } else {
      this.emailFieldState = this.profileForm.controls.email.valid ? InputState.Default : InputState.Error;
      this.emailFieldHelpText = this.helpText(this.profileForm.controls.email.errors);
      this.passwordFieldState = this.profileForm.controls.password.valid ? InputState.Default : InputState.Error;
      this.passwordFieldHelpText = this.helpText(this.profileForm.controls.password.errors);
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLayoutComponent } from '../components/action/input-layout.component';
import { IconEnum } from '../../helpers/enum';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { ApiService } from '../../services/api.service';

export enum PageState {
  Login = 'login',
  NewUser = 'new',
  Forgot = 'forgot',
}

@Component({
  selector: 'login',
  imports: [InputLayoutComponent, IconButtonComponent, ReactiveFormsModule],
  template: `
    <div class="login-view">
      <div
        class="title"
        [attr.current-title]="title.current"
        [attr.previous-title]="title.previous"
        [class.animate]="animationDelay()"
      >
        {{ title.current }}
      </div>
      <form class="form" [class]="pageState()" [formGroup]="profileForm" (ngSubmit)="submit()">
        <input-layout
          class="email"
          [helpText]="helpText(profileForm.controls.email)"
          [inputId]="'email'"
          [label]="'Email'"
        >
          <input
            autocomplete="on"
            formControlName="email"
            id="email"
            input-base
            input-field
            type="text"
          />
        </input-layout>
        @if (pageState() !== PageState.Forgot) {
          <input-layout
            animate.leave="leave"
            class="password"
            [helpText]="helpText(profileForm.controls.password)"
            [inputId]="'password'"
            [label]="'Password'"
          >
            <input
              formControlName="password"
              id="password"
              input-base
              input-field
              type="password"
            />
          </input-layout>
        }
        <icn-btn
          class="login-btn fill"
          type="submit"
          [ariaLabel]="'submit'"
          [icon]="IconEnum.Right"
        />
        @if (formError()) {
          <div class="form-error">{{ formError() }}</div>
        }
      </form>
      <div class="buttons">
        @if (pageState() !== PageState.Login) {
          <button
            animate.enter="enter"
            animate.leave="leave"
            aria-label="Back"
            btn
            class="vertical back"
            text-btn
            (click)="updateState(PageState.Login)"
          >
            Back
          </button>
        }
        @if (pageState() === PageState.Login) {
          <button
            animate.enter="enter"
            animate.leave="leave"
            aria-label="New User"
            btn
            class="vertical new"
            text-btn
            (click)="updateState(PageState.NewUser)"
          >
            New User
          </button>
        }
        @if (pageState() === PageState.Login) {
          <button
            animate.enter="enter"
            animate.leave="leave"
            aria-label="Forgot password"
            btn
            class="vertical forgot"
            text-btn
            (click)="updateState(PageState.Forgot)"
          >
            Forgot password
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    .login-view {
      border: none;
      background-color: transparent;
      box-sizing: border-box;
      display: grid;
      gap: 1.5rem 0;
      place-content: center;
      width: 100vw;
      height: 100vh;
      padding: 2rem;
      max-width: 20rem;
      margin: auto;
      grid-template-rows: 1fr auto repeat(2, minmax(3.5rem, min-content)) 1fr 4.5rem;
      grid-template-columns: 1fr 3.5rem;
      place-items: center start;
      translate: 0 0;
      .title {
        grid-area: 2 / 1 / 3 / 2;
        position: relative;
        &:before {
          content: attr(current-title);
          color: var(--white);
          position: absolute;
          inset: 0;
          opacity: 0;
          white-space: nowrap;
        }
        &:after {
          content: attr(previous-title);
          color: var(--white);
          position: absolute;
          inset: 0;
          opacity: 0;
          white-space: nowrap;
        }
        &.animate {
          color: transparent;
          &:before {
            animation: rollin 0.5s;
          }
          &:after {
            animation: rollout 0.5s;
          }
        }
      }
      .email {
        grid-area: 3 / 1 / 4 / 2;
      }
      .password {
        grid-area: 4 / 1 / 5 / 2;
        translate: 0 0;
        opacity: 1;
        transition:
          opacity 0.25s,
          translate 0.25s;
        &.leave {
          translate: 0 -1rem;
          opacity: 0;
        }
        @starting-style {
          translate: 0 -1rem;
          opacity: 0;
        }
      }
      .login-btn {
        grid-area: 4 / 3 / 5 / 2;
        place-self: start end;
        transition: translate 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .buttons {
        grid-area: 6 / 1 / 7 / 3;
        justify-content: start;
        display: grid;
        width: 9.25rem;
        height: 5rem;
        position: relative;
        transform-origin: left bottom;
        transform: translateY(2rem) rotate(-90deg) translateY(100%);
        transform-style: preserve-3d;
        perspective: 40rem;
      }
    }
    .form {
      display: contents;
      &.new .login-btn,
      &.login .login-btn {
        translate: 0 1.25rem;
      }
      &.forgot .login-btn {
        translate: 0 -3.625rem;
      }
    }
    .login-btn {
      align-self: end;
      justify-self: end;
    }
    .form-error {
      color: var(--error);
      font-size: var(--txt-mid);
      grid-area: 5 / 1 / 6 / 3;
      place-self: start center;
    }
    .vertical {
      position: absolute;
      height: 2.25rem;
      width: fit-content;
      white-space: pre;
      padding-left: 2rem;
      transform-origin: left center;
      rotate: y 0deg;
      background-color: var(--n-200);
      box-shadow:
        1px 0 2px hsla(0, 0%, 0%, 0.2),
        2px 0 4px hsla(0, 0%, 0%, 0.1),
        4px 0 8px hsla(0, 0%, 0%, 0.06);
      &.enter {
        animation: foldin 0.5s cubic-bezier(0, 0.55, 0.45, 1);
      }
      &.leave {
        animation: foldout 0.5s cubic-bezier(0.55, 0, 1, 0.45);
      }
      &.new,
      &.back {
        top: 0;
      }
      &.forgot {
        top: 2.75rem;
      }
    }
    @keyframes rollout {
      from {
        translate: 0 0;
        opacity: 1;
      }
      to {
        translate: 0 100%;
        opacity: 0;
      }
    }
    @keyframes rollin {
      from {
        translate: 0 -100%;
        opacity: 0;
      }
      to {
        translate: 0 0;
        opacity: 1;
      }
    }
    @keyframes foldin {
      from {
        background: linear-gradient(270deg, var(--n-600), var(--n-200) 75%) right center / 400% 100%;
        rotate: y 90deg;
        background-position: 100% 0%;
      }
      to {
        background: linear-gradient(270deg, var(--n-600), var(--n-200) 75%) right center / 400% 100%;
        rotate: y 0deg;
        background-position: 0% 0%;
      }
    }
    @keyframes foldout {
      from {
        background: linear-gradient(270deg, var(--n-200), black 75%) right center / 400% 100%;
        rotate: y 0deg;
      }
      to {
        color: var(--n-200);
        background: linear-gradient(270deg, var(--n-200), black 75%) right center / 400% 100%;
        rotate: y -90deg;
      }
    }
  `,
})
export class LoginPageComponent {
  private apiService = inject(ApiService);

  protected readonly IconEnum = IconEnum;
  protected readonly PageState = PageState;
  protected title = { current: 'Notes', previous: '' };

  protected profileForm = new FormGroup({
    email: new FormControl('conny@carneval.com', [Validators.required, Validators.email]),
    password: new FormControl('123456', [Validators.required, Validators.minLength(6)]),
  });

  protected pageState = signal(PageState.Login);
  protected animationDelay = signal(false);
  protected formError = signal<string | null>(null);

  protected helpText = (control: FormControl): string => {
    const key = Object.keys(control.errors ?? [])?.[0];
    if (typeof key === 'string' && control.touched) {
      return (
        {
          required: 'Field is required.',
          email: 'Entry needs to be a valid email.',
          minlength: 'Entry needs to be atleast 6 charcters long.',
        }?.[key] ?? ''
      );
    } else return '';
  };

  updateState(state: PageState) {
    this.pageState.set(state);
    this.animationDelay.set(true);
    setTimeout(() => this.animationDelay.set(false), 500);
    this.title.previous = this.title.current;
    if (PageState.Forgot === state) this.title.current = 'Forgot Password';
    else if (PageState.NewUser === state) this.title.current = 'New User';
    else this.title.current = 'Notes';
  }

  async submit(): Promise<void> {
    this.profileForm.updateValueAndValidity();
    let response = true;
    if (this.profileForm.valid) {
      const raw = this.profileForm.getRawValue();
      if (this.pageState() === PageState.Login) {
        response = await this.apiService.login(raw.email!, raw.password!);
      } else if (this.pageState() === PageState.NewUser) {
        response = await this.apiService.createUser(raw.email!, raw.password!);
      }
    }
    if (!response) this.formError.set('No way Jose, try again');
  }
}

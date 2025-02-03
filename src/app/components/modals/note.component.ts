import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IconButtonComponent } from "../action/iconButton.component";
import { ButtonStyleEnum, IconEnum } from "../../../helpers/enum";
import { FormsModule } from "@angular/forms";
import { ActiveNoteService } from "../../../services/activeNote.service";

@Component({
  selector: 'note',
  imports: [IconButtonComponent, FormsModule],
  template: `
    <div class="title-area">
      <input
        class="title"
        autofocus
        [(ngModel)]="title"
        input
      />
    </div>
    <div class="date">
      <span>Created: {{ createdDate }}</span>
      <span>Updated: {{ updatedDate }}</span>
    </div>
    <div class="text-area-container">
      <textarea
        class="text-area"
        [(ngModel)]="content"
        input
      ></textarea>
    </div>
    <div class="toolbar">
      <div class="toolbar-left-section">
        <icon-button
          [icon]="IconEnum.Left"
          [buttonStyle]="ButtonStyleEnum.Border"
          (onClick)="activeNoteService.cancel(title, content)"
        />
        <icon-button
          [icon]="IconEnum.Check"
          [buttonStyle]="ButtonStyleEnum.Border"
          (onClick)="activeNoteService.save(title, content)"
        />
      </div>
      <div class="toolbar-right-section">
        <icon-button
          [icon]="IconEnum.Remove"
          [buttonStyle]="ButtonStyleEnum.Border"
          (onClick)="activeNoteService.delete()"
        />
      </div>
    </div>
  `,
  styles: `
  :host {
    grid-area: var(--note-area);
    background-color: var(--bg);
    color: var(--clr);
    position: fixed;
    inset: 0 0 0 var(--note-width);
    display: grid;
    grid-template-rows: auto 1.5rem 1fr;
  }
  .toolbar {
    box-sizing: border-box;
    display: flex;
    height: 3rem;
    align-items: center;
    padding: 0 .5rem;
    justify-content: space-between;
    border-top: 0.0625rem solid var(--border);
  }
  .toolbar-left-section,
  .toolbar-right-section {
    display: flex;
    gap: .5rem;
  }
  .title {
    box-sizing: border-box;
    font-size: 1rem;
    height: 3rem;
    padding: 0 0.75rem;
    background-color: transparent;
    border: none;
    width: 100%;
  }
  .date {
    font-size: 0.625rem;
    height: 1.5rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--n-500);
    padding: 0 1rem;
    justify-content: space-between;
    align-items: center;
    display: flex;
    margin: auto 0;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 1rem;
      right: 1rem;
      height: 0.0625rem;
      background-color: var(--border);
    }
  }
  .text-area-container {
    margin: 0 .25rem;
  }
  .text-area {
    box-sizing: border-box;
    border: none;
    background: none;
    line-height: 1.5;
    font-size: 0.875rem;
    width: 100%;
    height: 100%;
    padding: 1rem .75rem;
    white-space-collapse: break-spaces;
    overflow-y: auto;
    resize: none;
  }
  `
})

export class NoteComponent {

  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  @Input() title = '';
  @Input() content = '';

  @Output() close = new EventEmitter<void>();

  createdDate = '';
  updatedDate = '';

  constructor(public activeNoteService: ActiveNoteService) { }


}
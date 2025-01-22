import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Note } from "../../helpers/types";

@Component({
  selector: 'list-item',
  imports: [],
  template: `
    <button
      class="list-item"
      (click)="selectNote()"
      base-input
    >
      <div class="list-item-header">
        {{ note.title }}
      </div>
      <div class="list-item-content">
        {{ note.content }}
      </div>
      <div class="list-item-date">
        Updated: {{ updatedAt }}
      </div>
    </button>
  `,
  styles: `
    :host { display: contents; }
    .list-item {
      cursor: pointer;
      background-color: transparent;
      border: none;
      display: grid;
      gap: .325rem;
      line-height: 1.375;
      padding: 1rem;
      place-content: start start;
      text-align: left;
      width: 100%;
      height: min-content;
      position: relative;
      transition: background-color .15s;
      &:hover {
        background-color: hsla(0, 0%, 100%, .1);
      }
    }
    .list-item-header {
      font-size: var(--list-item-font-size);
      font-weight: 700;
    }
    .list-item-content {
      color: hsl(0, 0%, 64%);
      font-size: var(--list-item-font-size);
      font-weight: 500;
      line-height: var(--list-item-line-height);
      max-height: calc(var(--list-item-line-height) * 4);
      overflow: hidden;
      white-space-collapse: break-spaces;
      position: relative;
      &:after {
        content: "...";
        display: block;
        letter-spacing: .125rem;
        position: absolute;
        padding-left: .5rem;
        height: var(--list-item-line-height);
        width: 100%;
        background: #000;
        top: calc(var(--list-item-line-height) * 3);
        right: 0;
      }
    }
    .list-item-date {
      margin-top: .5rem;
      font-size: .625rem;
      font-weight: 600;
      color: var(--n-400);
    }
  `
})

export class ListItem implements OnInit {
  updatedAt: string = ''
  @Input() note!: Note;
  @Output() onClick = new EventEmitter<Note>();

  ngOnInit(): void {
    this.updatedAt = new Date(this.note.updatedAt).toLocaleDateString(
      'sv-se',
      { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    )
  }

  selectNote = () => {
    this.onClick.emit(this.note);
  }
};

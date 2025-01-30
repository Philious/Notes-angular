import { Component, ElementRef, OnDestroy, Renderer2, ViewChild } from "@angular/core";
import { IconButtonComponent } from "./action/iconButton.component";
import { ButtonStyleEnum, IconEnum } from "../../helpers/enum";
import { ListItem } from "./noteListItem";
import { NoteService } from "../../services/notes.service";
import { Note } from "../../helpers/types";
import { ContextMenuService } from "../../services/contextMenu.service";
import { ActiveNoteService } from "../../services/activeNote.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'note-list',
  imports: [IconButtonComponent, ListItem],
  template: `
    
    @if (notes.length) { 
      <ul class="list">
        @for (note of notes; track note.id) {
          @if (note.updatedAt) { 
          <li class="list-item-container">
            <list-item [note]="note" (onClick)="activeNoteService.open(note)" />
          </li>
          }
        }
      </ul>
    }

    <div class="list-header">
      <label class="header">Notes</label>
      <div class="list-options" >
      <icon-button 
        #letterSizeButton
        [icon]="IconEnum.LetterSize"
        [buttonStyle]="ButtonStyleEnum.Border"
        (click)="letterSizeMenu()"
      ></icon-button>
        <icon-button
          [icon]="IconEnum.Add"
          [buttonStyle]="ButtonStyleEnum.Border"
          (onClick)="activeNoteService.open()"
        />
      </div>
    </div>
  `,
  styles: `
    @use 'media-size.mixins' as media;
    :host {
      position: relative;
      grid-area: var(--list-area);
      max-width: var(--note-list-width);
      max-height: 100%;
      overflow-y: auto;
      box-shadow: 1px 0 0 var(--n-300);
      flex: 1;
      display: flex;
      @include media.tabletUp {
        grid-template-rows: var(--toolbar-height) 1fr;
      }
    }
    .list-header {
      background-color: var(--black);
      box-sizing: border-box;
      position: absolute;
      top: 0;
      align-items: center;
      display: flex;
      place-self: center start;
      gap: .5rem;
      padding: 0 .5rem 0 1rem;
      justify-content: space-between;
      width: 100%;
      height: var(--list-header-height);
      box-sizing: border-box;
      border-bottom: 0.0625rem solid var(--n-400);
    }
    .header {
      text-transform: uppercase;
      font-size: .75rem;
      font-weight: 700;
    }
    .list-options {
      display: flex;
      gap: .5rem;
    }
    .to-notes-btn {
      gap: .125rem;
    }
    .list {
      background-color: var(--black);
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow-x: hidden;
      overflow-y:auto;
      list-style: none;
      padding: 0 0 3rem 0;
      margin: 3rem 0 0 0;
      scroll-snap-type: y mandatory;
    }
    .list-item-container {
      scroll-snap-align: start;
      &:not(:last-child) {
        box-shadow: 0 1px 0 var(--n-300);
      }
      &:active {
        &,
        .list-item-content:after {
          background-color: var(--n-100);
        }
      }
    }
  `
})

export class NoteListComponent implements OnDestroy {
  @ViewChild('letterSizeButton', { static: false, read: ElementRef }) private letterSizeBtn!: ElementRef;
  private destroy$ = new Subject<void>();

  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  notes: Note[] = [];
  showActiveNote = false;

  constructor(
    noteService: NoteService,
    public activeNoteService: ActiveNoteService,
    private menuService: ContextMenuService,
    private renderer: Renderer2,
  ) {
    noteService.activeNote$
      .pipe(takeUntil(this.destroy$))
      .subscribe(active => {
        this.showActiveNote = !!active
      });
    noteService.notes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notes => {
        this.notes = notes
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateAppFontSize(size: number) {
    this.renderer.setProperty(document.documentElement, 'style', `--app-font-size: ${size}px`);
    this.menuService.close()
  }

  letterSizeMenu(): void {
    if (this.letterSizeBtn?.nativeElement) {
      this.menuService.open([
        { id: 'id1', label: 'Large', action: () => this.updateAppFontSize(22) },
        { id: 'id2', label: 'Normal', action: () => this.updateAppFontSize(16) },
        { id: 'id3', label: 'Small', action: () => this.updateAppFontSize(12) }
      ], this.letterSizeBtn.nativeElement)
    }
  }

}
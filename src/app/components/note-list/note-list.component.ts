import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';
import { Note } from '../../models/note.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
  notes: Note[] = [];

  constructor(
    private noteService: NoteService, 
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.notes = data;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        if (err.status === 401) {
          this.logout();
        }
      }
    });
  }

  deleteNote(id: string | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(id).subscribe({
        next: () => this.loadNotes(),
        error: (err) => console.error(err)
      });
    }
  }

  editNote(note: Note): void {
    this.router.navigate(['/notes', 'edit'], { state: { note } });
  }

  createNote(): void {
    this.router.navigate(['/notes', 'new']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

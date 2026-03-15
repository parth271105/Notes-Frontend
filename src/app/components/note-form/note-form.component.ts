import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {
  note: Note = { title: '', content: '', category: 'General' };
  isEditMode = false;
  error = '';

  constructor(
    private noteService: NoteService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['note']) {
      this.note = { ...navigation.extras.state['note'] };
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.isEditMode && this.note._id) {
      this.noteService.updateNote(this.note._id, this.note).subscribe({
        next: () => this.router.navigate(['/notes']),
        error: (err) => this.error = err.error?.message || 'Failed to update note'
      });
    } else {
      this.noteService.addNote(this.note).subscribe({
        next: () => this.router.navigate(['/notes']),
        error: (err) => this.error = err.error?.message || 'Failed to create note'
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/notes']);
  }
}

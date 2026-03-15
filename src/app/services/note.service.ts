import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = 'http://localhost:5000/api/notes';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}?t=${new Date().getTime()}`, { headers: this.getHeaders() });
  }

  addNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note, { headers: this.getHeaders() });
  }

  updateNote(id: string, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note, { headers: this.getHeaders() });
  }

  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

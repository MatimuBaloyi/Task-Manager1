import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5210/tasks';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  markAsCompleted(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, {});
  }

  // Add these new methods
  updateTask(task: Task): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${task.id}`, task);
  }

  softDeleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/soft-delete/${id}`);
  }

  restoreTask(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/restore/${id}`, {});
  }
}
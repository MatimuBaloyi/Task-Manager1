import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-list',
  template: `
    <div *ngFor="let task of tasks" class="task-item">
      <span [class.completed]="task.isCompleted">
        {{ task.title }} ({{ task.priority }})
      </span>
      <button (click)="completeTask(task.id)" 
              [disabled]="task.isCompleted">
        {{ task.isCompleted ? 'Completed' : 'Mark Complete' }}
      </button>
    </div>
  `,
  styles: [`
    .completed { text-decoration: line-through; }
    .task-item { margin: 8px 0; }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get('/tasks').subscribe({
      next: (res: any) => this.tasks = res,
      error: (err) => console.error('Failed to load tasks:', err)
    });
  }

  completeTask(id: number) {
    this.http.put(`/tasks/${id}`, {}).subscribe({
      next: () => this.loadTasks(), // Refresh list after completion
      error: (err) => console.error('Failed to complete task:', err)
    });
  }
}
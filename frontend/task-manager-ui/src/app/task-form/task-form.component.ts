// src/app/task-form/task-form.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../task.model';
import { HttpClient } from '@angular/common/http';
import { TaskRefreshService } from '../task-refresh.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<void>();
  taskForm: FormGroup;
  priorities = ['High', 'Medium', 'Low'];
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private taskRefresh: TaskRefreshService) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      priority: ['Medium', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Task = {
        title: this.taskForm.value.title,
        priority: this.taskForm.value.priority,
        isCompleted: false
      };
  this.http.post('/tasks', newTask).subscribe({
        next: () => {
          this.taskForm.reset({ priority: 'Medium' });
          this.taskAdded.emit();
          this.taskRefresh.trigger();
          this.showMessage('Task created successfully!', 'success');
        },
        error: () => {
          this.showMessage('Failed to add task (backend error)', 'error');
        }
      });
    }
  }

  // No need for generateId when using backend

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 2000);
  }
}
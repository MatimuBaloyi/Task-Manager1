// src/app/task-form/task-form.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../task.model';

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

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      priority: ['Medium', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const allTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
      const newTask: Task = {
        id: this.generateId(allTasks),
        title: this.taskForm.value.title,
        priority: this.taskForm.value.priority,
        isCompleted: false,
        deleted: false
      };
      allTasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      this.taskForm.reset({ priority: 'Medium' });
      this.taskAdded.emit();
      this.showMessage('Task created successfully!', 'success');
    }
  }

  generateId(tasks: Task[]): number {
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.id || 0)) + 1 : 1;
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 2000);
  }
}
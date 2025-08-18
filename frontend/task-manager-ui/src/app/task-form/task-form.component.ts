import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
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
  showSuccess = false;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      priority: ['Medium', Validators.required],
      dueDate: [null]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Task = {
        title: this.taskForm.value.title,
        priority: this.taskForm.value.priority,
        dueDate: this.taskForm.value.dueDate,
        isCompleted: false
      };

      this.taskService.createTask(newTask).subscribe({
        next: () => {
          this.taskForm.reset({ priority: 'Medium', dueDate: null });
          this.showSuccess = true;
          this.taskAdded.emit();
          setTimeout(() => this.showSuccess = false, 3000);
        },
        error: (err) => {
          console.error('Error creating task:', err);
        }
      });
    }
  }
}
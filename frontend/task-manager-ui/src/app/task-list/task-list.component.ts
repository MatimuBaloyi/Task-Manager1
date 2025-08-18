import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  priorityFilter: string = 'All';
  completionFilter: string = 'All';
  showDeleted: boolean = false;
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesPriority = this.priorityFilter === 'All' || task.priority === this.priorityFilter;
      const matchesCompletion = this.completionFilter === 'All' || 
                              (this.completionFilter === 'Completed' && task.isCompleted) || 
                              (this.completionFilter === 'Pending' && !task.isCompleted);
      const matchesDeleted = this.showDeleted ? task.isDeleted : !task.isDeleted;
      return matchesPriority && matchesCompletion && matchesDeleted;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  markAsCompleted(id: number): void {
    if (confirm('Are you sure you want to mark this task as completed?')) {
      this.taskService.markAsCompleted(id).subscribe(() => {
        this.loadTasks();
        alert('Task marked as completed!');
      });
    }
  }

  // Add these new methods
startEdit(task: Task): void {
  this.editingTask = { 
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : null
  };
}

saveEdit(): void {
  if (this.editingTask) {
    // Convert date string back to Date object before saving
    const taskToSave = {
      ...this.editingTask,
      dueDate: this.editingTask.dueDate ? new Date(this.editingTask.dueDate) : null
    };

    this.taskService.updateTask(taskToSave).subscribe({
      next: () => {
        this.loadTasks();
        this.editingTask = null;
        alert('Task updated successfully!');
      },
      error: (err) => {
        console.error('Error updating task:', err);
        alert('Failed to update task. Please try again.');
      }
    });
  }
}

  cancelEdit(): void {
    this.editingTask = null;
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.softDeleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
          alert('Task moved to trash!');
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          alert('Failed to delete task. Please try again.');
        }
      });
    }
  }

  restoreTask(id: number): void {
    this.taskService.restoreTask(id).subscribe({
      next: () => {
        this.loadTasks();
        alert('Task restored successfully!');
      },
      error: (err) => {
        console.error('Error restoring task:', err);
        alert('Failed to restore task. Please try again.');
      }
    });
  }

  toggleShowDeleted(): void {
    this.showDeleted = !this.showDeleted;
    this.applyFilters();
  }
}
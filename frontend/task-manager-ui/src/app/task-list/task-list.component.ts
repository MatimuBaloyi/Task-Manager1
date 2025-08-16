// src/app/task-list/task-list.component.ts
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
      return matchesPriority && matchesCompletion;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  markAsCompleted(id: number): void {
    this.taskService.markAsCompleted(id).subscribe(() => {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        task.isCompleted = true;
      }
      this.applyFilters();
    });
  }
}
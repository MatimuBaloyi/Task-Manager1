// src/app/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  deletedTasks: Task[] = [];
  showRecycleBin: boolean = false;
  priorityFilter: string = 'All';
  completionFilter: string = 'All';
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor() { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const allTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    this.tasks = allTasks.filter(t => !t.deleted);
    this.deletedTasks = allTasks.filter(t => t.deleted);
    this.applyFilters();
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
    const allTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = allTasks.find(t => t.id === id);
    if (task) {
      task.isCompleted = true;
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      this.loadTasks();
      this.showMessage('Task marked as completed!', 'success');
    }
  }

  deleteTask(id: number): void {
    const allTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = allTasks.find(t => t.id === id);
    if (task) {
      task.deleted = true;
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      this.loadTasks();
      this.showMessage('Task moved to recycle bin.', 'success');
    }
  }

  restoreTask(id: number): void {
    const allTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = allTasks.find(t => t.id === id);
    if (task) {
      task.deleted = false;
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      this.loadTasks();
      this.showMessage('Task restored!', 'success');
    }
  }

  toggleRecycleBin(): void {
    this.showRecycleBin = !this.showRecycleBin;
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
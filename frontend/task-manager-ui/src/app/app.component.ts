import { Component, ViewChild } from '@angular/core';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskFormComponent, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(TaskListComponent) taskListComponent!: TaskListComponent;

  onTaskAdded() {
    if (this.taskListComponent) {
      this.taskListComponent.loadTasks();
    }
  }
}
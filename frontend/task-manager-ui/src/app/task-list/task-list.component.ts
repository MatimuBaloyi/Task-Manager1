import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-task-list',
	standalone: true,
		imports: [CommonModule, FormsModule],
	template: `
		<div class="filter-bar">
			<label>Show:
				<select [(ngModel)]="filter" (change)="applyFilter()">
					<option value="all">All</option>
					<option value="completed">Completed</option>
					<option value="pending">Pending</option>
				</select>
			</label>
			<button (click)="showRecycleBin = !showRecycleBin">{{ showRecycleBin ? 'Back to Tasks' : 'Recycle Bin' }}</button>
		</div>

		<div *ngIf="!showRecycleBin" class="task-list-card">
			<div *ngFor="let task of filteredTasks" class="task-item">
				<span [class.completed]="task.isCompleted">
					{{ task.title }} ({{ task.priority }})
				</span>
				<div class="task-actions">
					<button class="complete" (click)="completeTask(task.id)" [disabled]="task.isCompleted">
						{{ task.isCompleted ? 'Completed' : 'Mark Complete' }}
					</button>
					<button class="delete" (click)="deleteTask(task.id)">Delete</button>
				</div>
			</div>
			<div *ngIf="filteredTasks.length === 0" class="no-tasks">No tasks found.</div>
		</div>

		<div *ngIf="showRecycleBin" class="recycle-bin-card">
			<div class="recycle-bin-title">Recycle Bin</div>
			<div *ngFor="let task of deletedTasks" class="task-item">
				<span>{{ task.title }} ({{ task.priority }})</span>
				<div class="task-actions">
					<button class="restore" (click)="restoreTask(task.id)">Restore</button>
					<button class="permanent" (click)="deletePermanently(task.id)">Delete Permanently</button>
				</div>
			</div>
			<div *ngIf="deletedTasks.length === 0" class="recycle-bin-empty">Recycle bin is empty.</div>
		</div>
    `,
	styles: [`
		.completed { text-decoration: line-through; }
		.task-item { margin: 8px 0; }
		select { margin-left: 8px; }
		button { margin-left: 4px; }
		.filter-bar {
			display: flex;
			align-items: center;
			gap: 18px;
			margin-bottom: 24px;
			padding: 16px 24px;
			background: #f8fafc;
			border-radius: 12px;
			box-shadow: 0 1.5px 8px 0 rgba(60,72,88,0.06);
			border: 1.5px solid #e9ecef;
		}
		.filter-bar label {
			font-weight: 600;
			color: #22223b;
		}
		.filter-bar select {
			padding: 7px 16px;
			border-radius: 6px;
			border: 1.5px solid #cfd8dc;
			background: #fff;
			font-size: 1rem;
			margin-left: 8px;
		}
		.filter-bar button {
			padding: 8px 18px;
			background: linear-gradient(90deg, #7b61ff 0%, #43c6ac 100%);
			color: #fff;
			border: none;
			border-radius: 6px;
			font-size: 1rem;
			font-weight: 600;
			cursor: pointer;
			box-shadow: 0 1.5px 6px 0 rgba(123,97,255,0.08);
			transition: background 0.2s, box-shadow 0.2s;
		}
		.filter-bar button:hover {
			background: linear-gradient(90deg, #43c6ac 0%, #7b61ff 100%);
		}
		.task-list-card, .recycle-bin-card {
			background: #fff;
			border-radius: 14px;
			box-shadow: 0 2px 12px 0 rgba(60,72,88,0.10);
			border: 1.5px solid #e9ecef;
			padding: 24px 32px;
			margin-bottom: 24px;
		}
		.task-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 16px 0;
			border-bottom: 1px solid #f0f0f0;
		}
		.task-item:last-child {
			border-bottom: none;
		}
		.completed {
			text-decoration: line-through;
			color: #b0b0b0;
		}
		.task-actions button {
			margin-left: 8px;
			padding: 7px 16px;
			border-radius: 6px;
			border: none;
			font-size: 1rem;
			font-weight: 500;
			cursor: pointer;
			background: #f0f0f0;
			color: #333;
			transition: background 0.2s;
		}
		.task-actions button.complete {
			background: linear-gradient(90deg, #43c6ac 0%, #7b61ff 100%);
			color: #fff;
		}
		.task-actions button.delete {
			background: linear-gradient(90deg, #ff5858 0%, #f09819 100%);
			color: #fff;
		}
		.task-actions button.restore {
			background: linear-gradient(90deg, #43c6ac 0%, #7b61ff 100%);
			color: #fff;
		}
		.task-actions button.permanent {
			background: #e74c3c;
			color: #fff;
		}
		.no-tasks, .recycle-bin-empty {
			color: #b0b0b0;
			font-size: 1.1em;
			font-weight: 500;
			text-align: center;
			margin-top: 16px;
		}
		.recycle-bin-title {
			font-weight: 700;
			font-size: 1.2em;
			margin-bottom: 12px;
		}
	`]
})
export class TaskListComponent implements OnInit {
	tasks: any[] = [];
	filteredTasks: any[] = [];
	deletedTasks: any[] = [];
	filter: string = 'all';
	showRecycleBin = false;

	ngOnInit() {
		this.loadTasks();
	}

	loadTasks() {
		const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
		this.tasks = allTasks.filter((t: any) => !t.deleted);
		this.deletedTasks = allTasks.filter((t: any) => t.deleted);
		this.applyFilter();
	}

	applyFilter() {
		if (this.filter === 'completed') {
			this.filteredTasks = this.tasks.filter((t: any) => t.isCompleted);
		} else if (this.filter === 'pending') {
			this.filteredTasks = this.tasks.filter((t: any) => !t.isCompleted);
		} else {
			this.filteredTasks = [...this.tasks];
		}
	}

	completeTask(id: number) {
		const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
		const task = allTasks.find((t: any) => t.id === id);
		if (task) {
			task.isCompleted = true;
			localStorage.setItem('tasks', JSON.stringify(allTasks));
			this.loadTasks();
		}
	}

	deleteTask(id: number) {
		const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
		const task = allTasks.find((t: any) => t.id === id);
		if (task) {
			task.deleted = true;
			localStorage.setItem('tasks', JSON.stringify(allTasks));
			this.loadTasks();
		}
	}

	restoreTask(id: number) {
		const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
		const task = allTasks.find((t: any) => t.id === id);
		if (task) {
			task.deleted = false;
			localStorage.setItem('tasks', JSON.stringify(allTasks));
			this.loadTasks();
		}
	}

	deletePermanently(id: number) {
		let allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
		allTasks = allTasks.filter((t: any) => t.id !== id);
		localStorage.setItem('tasks', JSON.stringify(allTasks));
		this.loadTasks();
	}
}

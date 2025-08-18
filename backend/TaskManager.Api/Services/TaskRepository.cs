using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public class TaskRepository
    {
        private readonly List<TaskItem> _tasks = new();
        private int _nextId = 1;

        public IEnumerable<TaskItem> GetAll() => _tasks.Where(t => !t.IsDeleted);

        public TaskItem? GetById(int id) => _tasks.FirstOrDefault(t => t.Id == id && !t.IsDeleted);

        public TaskItem Add(TaskItem task)
        {
            task.Id = _nextId++;
            _tasks.Add(task);
            return task;
        }

        public bool MarkCompleted(int id)
        {
            var task = GetById(id);
            if (task == null) return false;

            task.IsCompleted = true;
            return true;
        }

        // Add these new methods
        public bool Update(TaskItem updatedTask)
        {
            var task = GetById(updatedTask.Id);
            if (task == null) return false;

            task.Title = updatedTask.Title;
            task.Priority = updatedTask.Priority;
            task.DueDate = updatedTask.DueDate;
            return true;
        }

        public bool SoftDelete(int id)
        {
            var task = GetById(id);
            if (task == null) return false;

            task.IsDeleted = true;
            return true;
        }

        public bool Restore(int id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id && t.IsDeleted);
            if (task == null) return false;

            task.IsDeleted = false;
            return true;
        }
    }
}
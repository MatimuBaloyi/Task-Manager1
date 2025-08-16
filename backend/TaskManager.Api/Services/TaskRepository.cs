using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public class TaskRepository
    {
        private readonly List<TaskItem> _tasks = new();
        private int _nextId = 1;

        public IEnumerable<TaskItem> GetAll() => _tasks;

        public TaskItem? GetById(int id) => _tasks.FirstOrDefault(t => t.Id == id);

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
    }
}

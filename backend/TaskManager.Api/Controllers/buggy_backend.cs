using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("[controller]")] 
    public class TasksController : ControllerBase
    {
        private static List<TaskItem> tasks = new();
        private static int nextId = 1;

        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> GetTasks() 
            => Ok(tasks);

        [HttpPost]
        public IActionResult AddTask([FromBody] TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Title))
                return BadRequest("Title cannot be empty.");

            if (!new[] { "High", "Medium", "Low" }.Contains(task.Priority))
                return BadRequest("Priority must be High, Medium, or Low.");

            task.Id = nextId++;
            task.IsCompleted = false;
            tasks.Add(task);
            return CreatedAtAction(nameof(GetTasks), task);
        }

        [HttpPut("{id}")]
        public IActionResult CompleteTask(int id)
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();
            
            task.IsCompleted = true;
            return NoContent();
        }
    }

    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Priority { get; set; } = "Low";
        public bool IsCompleted { get; set; }
    }
}
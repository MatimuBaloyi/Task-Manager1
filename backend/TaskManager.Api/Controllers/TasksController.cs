using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("tasks")]
    public class TasksController : ControllerBase
    {
        private readonly TaskRepository _repo;

        public TasksController(TaskRepository repo)
        {
            _repo = repo;
        }

        // GET /tasks
        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> GetAll()
        {
            return Ok(_repo.GetAll());
        }

        // POST /tasks
        [HttpPost]
        public ActionResult<TaskItem> Create([FromBody] TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Title))
                return BadRequest("Title cannot be empty.");

            if (!(new[] { "High", "Medium", "Low" }.Contains(task.Priority)))
                return BadRequest("Priority must be High, Medium, or Low.");

            var created = _repo.Add(task);
            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
        }

        // PUT /tasks/{id}
        [HttpPut("{id}")]
        public IActionResult MarkCompleted(int id)
        {
            var success = _repo.MarkCompleted(id);
            if (!success) return NotFound("Task not found.");

            return NoContent();
        }
    }
}

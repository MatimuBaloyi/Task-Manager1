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

        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> GetAll()
        {
            return Ok(_repo.GetAll());
        }

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

        [HttpPut("{id}")]
        public IActionResult MarkCompleted(int id)
        {
            var success = _repo.MarkCompleted(id);
            if (!success) return NotFound("Task not found.");
            return NoContent();
        }

        // Add these new endpoints
        [HttpPut("update/{id}")]
        public IActionResult UpdateTask(int id, [FromBody] TaskItem task)
        {
            if (id != task.Id)
                return BadRequest("ID mismatch");

            var success = _repo.Update(task);
            if (!success) return NotFound("Task not found.");
            return NoContent();
        }

        [HttpDelete("soft-delete/{id}")]
        public IActionResult SoftDelete(int id)
        {
            var success = _repo.SoftDelete(id);
            if (!success) return NotFound("Task not found.");
            return NoContent();
        }

        [HttpPut("restore/{id}")]
        public IActionResult Restore(int id)
        {
            var success = _repo.Restore(id);
            if (!success) return NotFound("Task not found or not deleted.");
            return NoContent();
        }
    }
}
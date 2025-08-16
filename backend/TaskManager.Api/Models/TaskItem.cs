namespace TaskManager.Api.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Priority { get; set; } = "Low"; // High, Medium, Low
        public bool IsCompleted { get; set; } = false;
    }
}

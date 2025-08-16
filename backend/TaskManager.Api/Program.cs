using TaskManager.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();          // Needed for controllers
builder.Services.AddEndpointsApiExplorer(); // Needed for Swagger
builder.Services.AddSwaggerGen();           // Swagger generator
builder.Services.AddSingleton<TaskRepository>(); // In-memory repo

// Add CORS services to the container
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Angular dev server
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();       // Swagger middleware
    app.UseSwaggerUI();     // Swagger UI at /swagger
    
    // In development, we'll disable HTTPS redirection to avoid warnings
    // since our Angular app is running on HTTP in development
}
else
{
    // In production, enforce HTTPS
    app.UseHttpsRedirection();
}
app.UseRouting();

app.UseCors("AngularApp"); // Use the named policy

app.UseAuthorization();

app.MapControllers();

app.Run();
using Application.Interfaces;
using Infrastructure.Repositories;

// Program.cs wires up the web server: services first, then the HTTP request pipeline.
var builder = WebApplication.CreateBuilder(args);

// Controllers are C# classes that group related HTTP endpoints.
builder.Services.AddControllers();

// OpenAPI generates API documentation that tools and humans can inspect.
builder.Services.AddOpenApi();

// This lets the Vite frontend call the API during local development.
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:5174")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Register the CRM repository as a singleton so the in-memory data survives
// for as long as the API process is running.
builder.Services.AddSingleton<ICrmAccountRepository, InMemoryCrmAccountRepository>();

// Register tenant administration data the same way while the database layer is still forming.
builder.Services.AddSingleton<IAdministrationRepository, InMemoryAdministrationRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // In development, expose OpenAPI so API routes can be inspected by tools.
    app.MapOpenApi();
}

// These middleware calls run in order for every HTTP request.
app.UseHttpsRedirection();
app.UseCors("LocalFrontend");
app.MapControllers();

app.Run();

// This partial class lets automated tests start the API in memory later.
public partial class Program;

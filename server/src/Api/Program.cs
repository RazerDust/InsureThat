using Application.Interfaces;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

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

// The connection string tells Entity Framework where PostgreSQL is running.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Missing ConnectionStrings:DefaultConnection in appsettings.json.");

// DbContext is the main Entity Framework class that reads and writes database rows.
builder.Services.AddDbContext<InsureThatDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// Register database repositories. Scoped means each web request gets a clean repository instance.
builder.Services.AddScoped<ICrmAccountRepository, CrmAccountRepository>();
builder.Services.AddScoped<IAdministrationRepository, AdministrationRepository>();

var app = builder.Build();

// During local development this creates the database schema from the C# model
// and loads demo data when the database is empty.
await using (var scope = app.Services.CreateAsyncScope())
{
    var database = scope.ServiceProvider.GetRequiredService<InsureThatDbContext>();

    if (app.Configuration.GetValue("Database:EnsureCreatedOnStartup", true))
    {
        await database.Database.EnsureCreatedAsync();
    }

    if (app.Configuration.GetValue("Database:SeedDemoData", true))
    {
        await DatabaseSeeder.SeedAsync(database);
    }
}

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

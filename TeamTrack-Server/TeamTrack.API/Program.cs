using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using System.Text;
using TeamTrack.Core.IRepositories;
using TeamTrack.Core.IServices;
using TeamTrack.Core;
using TeamTrack.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});

// הוספת DataContext עם Sensitive Data Logging
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
           .EnableSensitiveDataLogging();
});

// הוספת Mapping
builder.Services.AddAutoMapper(typeof(MappingProfile));

// הוספת Jwt 
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
    };

    // הוספת טיפול במקרה של טעות באימות
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                // אם ה-token פג תוקף
                context.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        }
    };
});

// הוספת IRepositoryManager
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();

// הוספת Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMeetingService, MeetingService>();

// הוספת Controllers
builder.Services.AddControllers();

// הוספת הגדרת CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:3001")  // הכתובת של הלקוח שלך
               .AllowAnyMethod()                    // אפשר כל שיטה (GET, POST וכו')
               .AllowAnyHeader();                   // אפשר כל כותרת
    });
});

var app = builder.Build();

// הפעלת CORS לפני ה-UseRouting
app.UseCors("AllowSpecificOrigin");

// רק אם אתה עובד עם פרודקשן, כדאי להוסיף
app.UseHttpsRedirection();

// אפשר Swagger רק בסביבת פיתוח
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseAuthentication(); // הפעלת אימות JWT
app.UseAuthorization();  // הפעלת הרשאות
app.MapControllers();

app.Run();

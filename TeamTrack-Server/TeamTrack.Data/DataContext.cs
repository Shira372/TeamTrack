using Microsoft.EntityFrameworkCore;
using TeamTrack.Core.Entities;

namespace TeamTrack.Data
{
    public class DataContext : DbContext
    {
        // הוספת DbSet לכל ישות
        public DbSet<User> Users { get; set; }
        public DbSet<Meeting> Meetings { get; set; }

        // בנאי חדש שמקבל DbContextOptions<DataContext> 
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=invitation_db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // קשר רבים-לרבים בין Meeting ל-User
            modelBuilder.Entity<Meeting>()
                .HasMany(m => m.Users) // ישיבה מקושרת למספר משתמשים
                .WithMany(u => u.Meetings) // כל משתמש מקושר למספר ישיבות
                .UsingEntity(j => j.ToTable("MeetingUser")); // קובעים את שם טבלת הקשר

            // קשר של אחד-לרבים בין Meeting ל-User (המשתמש שיצר את הישיבה)
            modelBuilder.Entity<Meeting>()
                .HasOne(m => m.CreatedByUser) // ישיבה מקושרת למשתמש שיצר אותה
                .WithMany(u => u.MeetingsUserCreate) // כל משתמש יכול ליצור מספר ישיבות
                .HasForeignKey(m => m.CreatedByUserId) // מזהה המשתמש שיצר את הישיבה
                .OnDelete(DeleteBehavior.SetNull); // במקרה של מחיקת המשתמש, לא למחוק את הישיבות הקשורות, אלא להגדיר את CreatedByUserId כ-null
        }
    }
}

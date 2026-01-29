using JiraLite.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace JiraLite.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Project> Projects => Set<Project>();
        public DbSet<Issue> Issues => Set<Issue>();
    }

}

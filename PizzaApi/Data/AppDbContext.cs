using Microsoft.EntityFrameworkCore;
using PizzaApi.Models;

namespace PizzaApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Pizza> Pizzas { get; set; }
}
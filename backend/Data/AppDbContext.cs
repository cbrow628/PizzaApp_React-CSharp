using Microsoft.EntityFrameworkCore;
using PizzaApi.Models;

namespace PizzaApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Pizza> Pizzas { get; set; }
    public DbSet<Topping> Toppings { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Account> Accounts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Decimal precision for money columns
        modelBuilder.Entity<Order>().Property(o => o.Total).HasPrecision(18, 2);
        modelBuilder.Entity<OrderItem>().Property(oi => oi.UnitPrice).HasPrecision(18, 2);
        modelBuilder.Entity<Pizza>().Property(p => p.Price).HasPrecision(18, 2);
        modelBuilder.Entity<Topping>().Property(t => t.Price).HasPrecision(18, 2);

        // Many-to-many: Pizza <-> Topping (EF auto-creates PizzaToppings join table)
        modelBuilder.Entity<Pizza>()
            .HasMany(p => p.Toppings)
            .WithMany(t => t.Pizzas)
            .UsingEntity("PizzaToppings");

        // OrderItem -> Pizza is optional (null for Create Your Own)
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Pizza)
            .WithMany()
            .HasForeignKey(oi => oi.PizzaId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        // Order -> Account
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Account)
            .WithMany(a => a.Orders)
            .HasForeignKey(o => o.AccountId)
            .OnDelete(DeleteBehavior.Restrict);

        // Seed toppings — prices match TOPPING_OFFSETS in Menu.jsx
        modelBuilder.Entity<Topping>().HasData(
            // Sauces — no upcharge
            new Topping { Id = 1,  Name = "Tomato",        Category = ToppingCategory.Sauce,   Price = 0.00m, IsAvailable = true },
            new Topping { Id = 2,  Name = "BBQ",           Category = ToppingCategory.Sauce,   Price = 0.00m, IsAvailable = true },
            new Topping { Id = 3,  Name = "Alfredo",       Category = ToppingCategory.Sauce,   Price = 0.00m, IsAvailable = true },
            new Topping { Id = 4,  Name = "Buffalo",       Category = ToppingCategory.Sauce,   Price = 0.00m, IsAvailable = true },
            new Topping { Id = 5,  Name = "Garlic Butter", Category = ToppingCategory.Sauce,   Price = 0.00m, IsAvailable = true },
            new Topping { Id = 6,  Name = "Pesto",         Category = ToppingCategory.Sauce,   Price = 0.00m, IsAvailable = true },

            // Cheese — +$0.75
            new Topping { Id = 7,  Name = "Mozzarella",   Category = ToppingCategory.Cheese,  Price = 0.75m, IsAvailable = true },
            new Topping { Id = 8,  Name = "Parmesan",     Category = ToppingCategory.Cheese,  Price = 0.75m, IsAvailable = true },
            new Topping { Id = 9,  Name = "Feta",         Category = ToppingCategory.Cheese,  Price = 0.75m, IsAvailable = true },
            new Topping { Id = 10, Name = "Cheddar",      Category = ToppingCategory.Cheese,  Price = 0.75m, IsAvailable = true },
            new Topping { Id = 11, Name = "Ricotta",      Category = ToppingCategory.Cheese,  Price = 0.75m, IsAvailable = true },

            // Meat — +$1.00
            new Topping { Id = 12, Name = "Pepperoni",       Category = ToppingCategory.Meat,    Price = 1.00m, IsAvailable = true },
            new Topping { Id = 13, Name = "Italian Sausage", Category = ToppingCategory.Meat,    Price = 1.00m, IsAvailable = true },
            new Topping { Id = 14, Name = "Bacon",           Category = ToppingCategory.Meat,    Price = 1.00m, IsAvailable = true },
            new Topping { Id = 15, Name = "Canadian Bacon",  Category = ToppingCategory.Meat,    Price = 1.00m, IsAvailable = true },
            new Topping { Id = 16, Name = "Ham",             Category = ToppingCategory.Meat,    Price = 1.00m, IsAvailable = true },
            new Topping { Id = 17, Name = "Chicken",         Category = ToppingCategory.Meat,    Price = 1.00m, IsAvailable = true },

            // Veggies — +$0.50
            new Topping { Id = 18, Name = "Mushrooms",    Category = ToppingCategory.Veggies,  Price = 0.50m, IsAvailable = true },
            new Topping { Id = 19, Name = "Bell Peppers", Category = ToppingCategory.Veggies,  Price = 0.50m, IsAvailable = true },
            new Topping { Id = 20, Name = "Red Onions",   Category = ToppingCategory.Veggies,  Price = 0.50m, IsAvailable = true },
            new Topping { Id = 21, Name = "Black Olives", Category = ToppingCategory.Veggies,  Price = 0.50m, IsAvailable = true },
            new Topping { Id = 22, Name = "Jalapeños",    Category = ToppingCategory.Veggies,  Price = 0.50m, IsAvailable = true },

            // Drizzles — +$0.50
            new Topping { Id = 23, Name = "Hot Sauce",  Category = ToppingCategory.Drizzle,  Price = 0.50m, IsAvailable = true },
            new Topping { Id = 24, Name = "Honey",      Category = ToppingCategory.Drizzle,  Price = 0.50m, IsAvailable = true },
            new Topping { Id = 25, Name = "Hot Honey",  Category = ToppingCategory.Drizzle,  Price = 0.50m, IsAvailable = true },
            new Topping { Id = 26, Name = "Balsamic",   Category = ToppingCategory.Drizzle,  Price = 0.50m, IsAvailable = true }
        );
    }
}

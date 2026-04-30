using Microsoft.EntityFrameworkCore;
using PizzaApi.Data;
using PizzaApi.Models;

namespace PizzaApi.Services;

public class PizzaService : IPizzaService
{
    private readonly AppDbContext _context;

    public PizzaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Pizza>> GetAllAsync()
    {
        return await _context.Pizzas.ToListAsync();
    }

    public async Task<Pizza?> GetByIdAsync(int id)
    {
        return await _context.Pizzas.FindAsync(id);
    }

    public async Task<Pizza> CreateAsync(Pizza pizza)
    {
        _context.Pizzas.Add(pizza);
        await _context.SaveChangesAsync();
        return pizza;
    }

    public async Task<bool> UpdateAsync(int id, Pizza updated)
    {
        var pizza = await _context.Pizzas.FindAsync(id);
        if (pizza is null)
            return false;

        pizza.Name = updated.Name;
        pizza.Description = updated.Description;
        pizza.Price = updated.Price;
        pizza.Size = updated.Size;
        pizza.IsAvailable = updated.IsAvailable;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var pizza = await _context.Pizzas.FindAsync(id);
        if (pizza is null)
            return false;

        _context.Pizzas.Remove(pizza);
        await _context.SaveChangesAsync();
        return true;
    }
}
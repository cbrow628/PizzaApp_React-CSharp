using Microsoft.EntityFrameworkCore;
using PizzaApi.Data;
using PizzaApi.Models;

namespace PizzaApi.Services;

public class ToppingService : IToppingService
{
    private readonly AppDbContext _context;

    public ToppingService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Topping>> GetAllAsync()
    {
        return await _context.Toppings.Where(t => t.IsAvailable).ToListAsync();
    }

    public async Task<IEnumerable<Topping>> GetByCategoryAsync(ToppingCategory category)
    {
        return await _context.Toppings
            .Where(t => t.Category == category && t.IsAvailable)
            .ToListAsync();
    }

    public async Task<Topping?> GetByIdAsync(int id)
    {
        return await _context.Toppings.FindAsync(id);
    }

    public async Task<Topping> CreateAsync(Topping topping)
    {
        _context.Toppings.Add(topping);
        await _context.SaveChangesAsync();
        return topping;
    }

    public async Task<bool> UpdateAsync(int id, Topping updated)
    {
        var topping = await _context.Toppings.FindAsync(id);
        if (topping is null) return false;

        topping.Name        = updated.Name;
        topping.Category    = updated.Category;
        topping.Price       = updated.Price;
        topping.IsAvailable = updated.IsAvailable;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var topping = await _context.Toppings.FindAsync(id);
        if (topping is null) return false;

        _context.Toppings.Remove(topping);
        await _context.SaveChangesAsync();
        return true;
    }
}

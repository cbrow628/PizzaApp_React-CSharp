using PizzaApi.Models;

namespace PizzaApi.Services;

public interface IPizzaService
{
    Task<IEnumerable<Pizza>> GetAllAsync();
    Task<Pizza?> GetByIdAsync(int id);
    Task<Pizza> CreateAsync(Pizza pizza);
    Task<bool> UpdateAsync(int id, Pizza updated);
    Task<bool> DeleteAsync(int id);
}
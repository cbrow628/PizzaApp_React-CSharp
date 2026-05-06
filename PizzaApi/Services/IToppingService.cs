using PizzaApi.Models;

namespace PizzaApi.Services;

public interface IToppingService
{
    Task<IEnumerable<Topping>> GetAllAsync();
    Task<IEnumerable<Topping>> GetByCategoryAsync(ToppingCategory category);
    Task<Topping?> GetByIdAsync(int id);
    Task<Topping> CreateAsync(Topping topping);
    Task<bool> UpdateAsync(int id, Topping updated);
    Task<bool> DeleteAsync(int id);
}

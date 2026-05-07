using PizzaApi.Models.Dtos;

namespace PizzaApi.Services;

public interface IAccountService
{
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto?> UpdateAsync(int id, UpdateAccountRequest req);
    Task<bool> DeleteAsync(int id);
}

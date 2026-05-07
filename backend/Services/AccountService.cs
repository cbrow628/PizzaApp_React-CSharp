using Microsoft.EntityFrameworkCore;
using PizzaApi.Data;
using PizzaApi.Models.Dtos;

namespace PizzaApi.Services;

public class AccountService : IAccountService
{
    private readonly AppDbContext _db;

    public AccountService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var account = await _db.Accounts.FindAsync(id);
        if (account is null) return null;
        return new UserDto(account.Id, account.Name, account.Email, account.PhoneNumber, account.Address);
    }

    public async Task<UserDto?> UpdateAsync(int id, UpdateAccountRequest req)
    {
        var account = await _db.Accounts.FindAsync(id);
        if (account is null) return null;

        if (req.Email is not null && req.Email != account.Email)
        {
            var emailTaken = await _db.Accounts.AnyAsync(a => a.Email == req.Email && a.Id != id && !a.IsGuest);
            if (emailTaken) return null;
        }

        account.Name = req.Name;
        account.PhoneNumber = req.Phone;
        account.Address = req.Address;
        if (req.Email is not null)
            account.Email = req.Email;

        await _db.SaveChangesAsync();
        return new UserDto(account.Id, account.Name, account.Email, account.PhoneNumber, account.Address);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var account = await _db.Accounts.FindAsync(id);
        if (account is null) return false;

        _db.Accounts.Remove(account);
        await _db.SaveChangesAsync();
        return true;
    }
}

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PizzaApi.Data;
using PizzaApi.Models;
using PizzaApi.Models.Dtos;

namespace PizzaApi.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest req)
    {
        var account = new Account
        {
            Name = req.Name,
            PhoneNumber = req.Phone,
            Email = req.Email,
            Address = req.Address,
            PasswordHash = HashPassword(req.Password),
            IsGuest = false,
        };
        _db.Accounts.Add(account);
        await _db.SaveChangesAsync();
        return BuildResponse(account);
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest req)
    {
        var account = await _db.Accounts
            .FirstOrDefaultAsync(a => a.Email == req.Email && !a.IsGuest);

        if (account?.PasswordHash is null || !VerifyPassword(req.Password, account.PasswordHash))
            return null;

        return BuildResponse(account);
    }

    private AuthResponse BuildResponse(Account account)
    {
        var token = GenerateToken(account);
        var user = new UserDto(account.Id, account.Name, account.Email, account.PhoneNumber, account.Address);
        return new AuthResponse(token, user);
    }

    private string GenerateToken(Account account)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, account.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, account.Email ?? string.Empty),
        };
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(16);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
            password, salt, 100_000, HashAlgorithmName.SHA256, 32);
        return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
    }

    private static bool VerifyPassword(string password, string stored)
    {
        var parts = stored.Split(':');
        if (parts.Length != 2) return false;
        byte[] salt = Convert.FromBase64String(parts[0]);
        byte[] expected = Convert.FromBase64String(parts[1]);
        byte[] actual = Rfc2898DeriveBytes.Pbkdf2(
            password, salt, 100_000, HashAlgorithmName.SHA256, 32);
        return CryptographicOperations.FixedTimeEquals(actual, expected);
    }
}

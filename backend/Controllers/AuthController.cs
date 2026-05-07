using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PizzaApi.Data;
using PizzaApi.Models.Dtos;
using PizzaApi.Services;

namespace PizzaApi.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly AppDbContext _db;

    public AuthController(IAuthService auth, AppDbContext db)
    {
        _auth = auth;
        _db = db;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        var emailTaken = await _db.Accounts.AnyAsync(a => a.Email == req.Email && !a.IsGuest);
        if (emailTaken)
            return Conflict(new { detail = "An account with that email already exists." });

        var response = await _auth.RegisterAsync(req);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var response = await _auth.LoginAsync(req);
        if (response is null)
            return Unauthorized(new { detail = "Invalid email or password." });

        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var idClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idClaim, out var id))
            return Unauthorized();

        var account = await _db.Accounts.FindAsync(id);
        if (account is null)
            return Unauthorized();

        return Ok(new UserDto(account.Id, account.Name, account.Email, account.PhoneNumber, account.Address));
    }
}

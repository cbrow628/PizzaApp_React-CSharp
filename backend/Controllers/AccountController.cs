using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PizzaApi.Models.Dtos;
using PizzaApi.Services;

namespace PizzaApi.Controllers;

[ApiController]
[Route("account")]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accounts;

    public AccountController(IAccountService accounts)
    {
        _accounts = accounts;
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        if (!IsCurrentUser(id)) return Forbid();

        var account = await _accounts.GetByIdAsync(id);
        if (account is null) return NotFound();

        return Ok(account);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateAccountRequest req)
    {
        if (!IsCurrentUser(id)) return Forbid();

        var updated = await _accounts.UpdateAsync(id, req);
        if (updated is null)
            return Conflict(new { detail = "An account with that email already exists." });

        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!IsCurrentUser(id)) return Forbid();

        var deleted = await _accounts.DeleteAsync(id);
        if (!deleted) return NotFound();

        return NoContent();
    }

    private bool IsCurrentUser(int id)
    {
        var idClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return int.TryParse(idClaim, out var callerId) && callerId == id;
    }
}

using Microsoft.AspNetCore.Mvc;
using PizzaApi.Models;
using PizzaApi.Services;

namespace PizzaApi.Controllers;

[ApiController]
[Route("topping")]
public class ToppingController : ControllerBase
{
    private readonly IToppingService _toppingService;

    public ToppingController(IToppingService toppingService)
    {
        _toppingService = toppingService;
    }

    // GET /topping
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Topping>>> GetAll()
    {
        return Ok(await _toppingService.GetAllAsync());
    }

    // GET /topping/category/{category}
    [HttpGet("category/{category}")]
    public async Task<ActionResult<IEnumerable<Topping>>> GetByCategory(ToppingCategory category)
    {
        return Ok(await _toppingService.GetByCategoryAsync(category));
    }

    // GET /topping/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Topping>> GetById(int id)
    {
        var topping = await _toppingService.GetByIdAsync(id);
        if (topping is null)
            return NotFound();

        return Ok(topping);
    }

    // POST /topping
    [HttpPost]
    public async Task<ActionResult<Topping>> Create(Topping topping)
    {
        var created = await _toppingService.CreateAsync(topping);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /topping/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Topping updated)
    {
        var success = await _toppingService.UpdateAsync(id, updated);
        if (!success)
            return NotFound();

        return NoContent();
    }

    // DELETE /topping/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _toppingService.DeleteAsync(id);
        if (!success)
            return NotFound();

        return NoContent();
    }
}

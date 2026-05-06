using Microsoft.AspNetCore.Mvc;
using PizzaApi.Models;
using PizzaApi.Models.Dtos;
using PizzaApi.Services;

namespace PizzaApi.Controllers;

[ApiController]
[Route("order")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    // POST /order
    [HttpPost]
    public async Task<ActionResult<OrderResponse>> PlaceOrder(PlaceOrderRequest request)
    {
        if (request.AccountId is null)
        {
            if (string.IsNullOrWhiteSpace(request.GuestName))
                return BadRequest("GuestName is required for guest orders.");
            if (string.IsNullOrWhiteSpace(request.GuestPhone))
                return BadRequest("GuestPhone is required for guest orders.");
            if (string.IsNullOrWhiteSpace(request.GuestAddress))
                return BadRequest("GuestAddress is required for guest orders.");
        }

        if (request.Items is null || request.Items.Count == 0)
            return BadRequest("Order must contain at least one item.");

        try
        {
            var order = await _orderService.PlaceOrderAsync(request);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // GET /order/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponse>> GetOrder(int id)
    {
        var order = await _orderService.GetOrderAsync(id);
        if (order is null)
            return NotFound();

        return Ok(order);
    }

    // GET /order/account/{accountId}
    [HttpGet("account/{accountId}")]
    public async Task<ActionResult<IEnumerable<OrderResponse>>> GetByAccount(int accountId)
    {
        var orders = await _orderService.GetOrdersByAccountAsync(accountId);
        return Ok(orders);
    }

    // PATCH /order/{id}/status
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatus status)
    {
        var success = await _orderService.UpdateStatusAsync(id, status);
        if (!success)
            return NotFound();

        return NoContent();
    }
}

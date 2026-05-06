using Microsoft.EntityFrameworkCore;
using PizzaApi.Data;
using PizzaApi.Models;
using PizzaApi.Models.Dtos;

namespace PizzaApi.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<OrderResponse> PlaceOrderAsync(PlaceOrderRequest request)
    {
        Account account;

        if (request.AccountId.HasValue)
        {
            account = await _context.Accounts.FindAsync(request.AccountId.Value)
                ?? throw new InvalidOperationException("Account not found.");
        }
        else
        {
            // Create a guest account for this order
            account = new Account
            {
                IsGuest    = true,
                Name       = request.GuestName    ?? string.Empty,
                PhoneNumber = request.GuestPhone  ?? string.Empty,
                Email      = request.GuestEmail,
                Address    = request.GuestAddress ?? string.Empty,
            };
            _context.Accounts.Add(account);
        }

        var items = request.Items.Select(i => new OrderItem
        {
            PizzaId             = i.PizzaId,
            Name                = i.Name,
            Size                = i.Size,
            Quantity            = i.Quantity,
            UnitPrice           = i.UnitPrice,
            SpecialInstructions = i.SpecialInstructions,
        }).ToList();

        var order = new Order
        {
            Account  = account,
            Status   = OrderStatus.Pending,
            PlacedAt = DateTime.UtcNow,
            Total    = items.Sum(i => i.UnitPrice * i.Quantity),
            Items    = items,
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return ToResponse(order);
    }

    public async Task<OrderResponse?> GetOrderAsync(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Account)
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        return order is null ? null : ToResponse(order);
    }

    public async Task<IEnumerable<OrderResponse>> GetOrdersByAccountAsync(int accountId)
    {
        var orders = await _context.Orders
            .Include(o => o.Account)
            .Include(o => o.Items)
            .Where(o => o.AccountId == accountId)
            .OrderByDescending(o => o.PlacedAt)
            .ToListAsync();

        return orders.Select(ToResponse);
    }

    public async Task<bool> UpdateStatusAsync(int id, OrderStatus status)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order is null) return false;

        order.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }

    private static OrderResponse ToResponse(Order order) => new()
    {
        Id              = order.Id,
        Status          = order.Status.ToString(),
        PlacedAt        = order.PlacedAt,
        Total           = order.Total,
        CustomerName    = order.Account.Name,
        CustomerPhone   = order.Account.PhoneNumber,
        CustomerEmail   = order.Account.Email,
        CustomerAddress = order.Account.Address,
        Items           = order.Items.Select(i => new OrderItemResponse
        {
            Id                  = i.Id,
            PizzaId             = i.PizzaId,
            Name                = i.Name,
            Size                = i.Size,
            Quantity            = i.Quantity,
            UnitPrice           = i.UnitPrice,
            SpecialInstructions = i.SpecialInstructions,
        }).ToList(),
    };
}

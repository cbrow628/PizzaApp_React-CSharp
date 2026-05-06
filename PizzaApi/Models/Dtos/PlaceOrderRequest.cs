namespace PizzaApi.Models.Dtos;

public class PlaceOrderRequest
{
    // For registered accounts supply AccountId; for guests leave it null
    public int? AccountId { get; set; }

    // Guest fields — required when AccountId is null
    public string? GuestName { get; set; }
    public string? GuestPhone { get; set; }
    public string? GuestEmail { get; set; }
    public string? GuestAddress { get; set; }

    public List<OrderItemRequest> Items { get; set; } = [];
}

public class OrderItemRequest
{
    // Null for Create Your Own pizzas
    public int? PizzaId { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public decimal UnitPrice { get; set; }
    public string? SpecialInstructions { get; set; }
}

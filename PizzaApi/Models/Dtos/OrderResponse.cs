namespace PizzaApi.Models.Dtos;

public class OrderResponse
{
    public int Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime PlacedAt { get; set; }
    public decimal Total { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public string CustomerAddress { get; set; } = string.Empty;
    public List<OrderItemResponse> Items { get; set; } = [];
}

public class OrderItemResponse
{
    public int Id { get; set; }
    public int? PizzaId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal => UnitPrice * Quantity;
    public string? SpecialInstructions { get; set; }
}

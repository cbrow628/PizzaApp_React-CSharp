namespace PizzaApi.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    // Null for Create Your Own pizzas
    public int? PizzaId { get; set; }
    public Pizza? Pizza { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public decimal UnitPrice { get; set; }
    public string? SpecialInstructions { get; set; }
}

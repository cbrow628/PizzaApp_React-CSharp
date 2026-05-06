namespace PizzaApi.Models;

public class Topping
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ToppingCategory Category { get; set; }
    public decimal Price { get; set; }
    public bool IsAvailable { get; set; } = true;

    public List<Pizza> Pizzas { get; set; } = [];
}

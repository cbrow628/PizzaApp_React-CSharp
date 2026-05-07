namespace PizzaApi.Models.Dtos;

public record UpdateAccountRequest(string Name, string Phone, string Address, string? Email);

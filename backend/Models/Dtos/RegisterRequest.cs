namespace PizzaApi.Models.Dtos;

public record RegisterRequest(string Name, string Phone, string Email, string Address, string Password);

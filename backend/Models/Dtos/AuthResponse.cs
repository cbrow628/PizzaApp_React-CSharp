namespace PizzaApi.Models.Dtos;

public record UserDto(int Id, string Name, string? Email, string Phone, string Address);
public record AuthResponse(string Token, UserDto User);

using PizzaApi.Models;
using PizzaApi.Models.Dtos;

namespace PizzaApi.Services;

public interface IOrderService
{
    Task<OrderResponse> PlaceOrderAsync(PlaceOrderRequest request);
    Task<OrderResponse?> GetOrderAsync(int id);
    Task<IEnumerable<OrderResponse>> GetOrdersByAccountAsync(int accountId);
    Task<bool> UpdateStatusAsync(int id, OrderStatus status);
}

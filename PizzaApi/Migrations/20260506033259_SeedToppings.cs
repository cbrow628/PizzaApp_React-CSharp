using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PizzaApi.Migrations
{
    /// <inheritdoc />
    public partial class SeedToppings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Toppings",
                columns: new[] { "Id", "Category", "IsAvailable", "Name", "Price" },
                values: new object[,]
                {
                    { 1, 0, true, "Tomato", 0.00m },
                    { 2, 0, true, "BBQ", 0.00m },
                    { 3, 0, true, "Alfredo", 0.00m },
                    { 4, 0, true, "Buffalo", 0.00m },
                    { 5, 0, true, "Garlic Butter", 0.00m },
                    { 6, 0, true, "Pesto", 0.00m },
                    { 7, 1, true, "Mozzarella", 0.75m },
                    { 8, 1, true, "Parmesan", 0.75m },
                    { 9, 1, true, "Feta", 0.75m },
                    { 10, 1, true, "Cheddar", 0.75m },
                    { 11, 1, true, "Ricotta", 0.75m },
                    { 12, 2, true, "Pepperoni", 1.00m },
                    { 13, 2, true, "Italian Sausage", 1.00m },
                    { 14, 2, true, "Bacon", 1.00m },
                    { 15, 2, true, "Canadian Bacon", 1.00m },
                    { 16, 2, true, "Ham", 1.00m },
                    { 17, 2, true, "Chicken", 1.00m },
                    { 18, 3, true, "Mushrooms", 0.50m },
                    { 19, 3, true, "Bell Peppers", 0.50m },
                    { 20, 3, true, "Red Onions", 0.50m },
                    { 21, 3, true, "Black Olives", 0.50m },
                    { 22, 3, true, "Jalapeños", 0.50m },
                    { 23, 4, true, "Hot Sauce", 0.50m },
                    { 24, 4, true, "Honey", 0.50m },
                    { 25, 4, true, "Hot Honey", 0.50m },
                    { 26, 4, true, "Balsamic", 0.50m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "Id",
                keyValue: 26);
        }
    }
}

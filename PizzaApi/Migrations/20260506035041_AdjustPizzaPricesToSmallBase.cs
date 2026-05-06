using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PizzaApi.Migrations
{
    /// <inheritdoc />
    public partial class AdjustPizzaPricesToSmallBase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Prices were stored at Large size. Small is now the base, so subtract $3.00.
            migrationBuilder.Sql(@"
                UPDATE Pizzas
                SET Price = Price - 3.00,
                    Size  = 'Small'
                WHERE Id IN (2, 3, 4, 5, 6, 7, 8, 9)
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE Pizzas
                SET Price = Price + 3.00,
                    Size  = 'Large'
                WHERE Id IN (2, 3, 4, 5, 6, 7, 8, 9)
            ");
        }
    }
}

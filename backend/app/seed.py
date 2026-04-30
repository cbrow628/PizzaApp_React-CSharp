"""
Seed the database with initial data for Mac's Pizza.
Usage: python seed.py
"""
from database import SessionLocal
from models import MenuCategory, MenuItem, Topping

db = SessionLocal()

def seed():
    print("Seeding database for Mac's Pizza...")

    # ─── Categories ───────────────────────────────────────────────────────────
    pizzas_cat = MenuCategory(name="Pizzas", description="Hand-tossed and oven-baked to perfection", sort_order=1)
    sodas_cat = MenuCategory(name="Sodas", description="Ice cold drinks", sort_order=2)

    db.add_all([pizzas_cat, sodas_cat])
    db.flush()

    # ─── Pizzas ───────────────────────────────────────────────────────────────
    pizzas = [
        MenuItem(
            category_id=pizzas_cat.id,
            name="Cheese Pizza",
            description="Classic mozzarella on our house tomato sauce",
            base_price=10.99,
            is_customizable=True,
        ),
        MenuItem(
            category_id=pizzas_cat.id,
            name="Pepperoni Pizza",
            description="Loaded with classic pepperoni and mozzarella",
            base_price=12.99,
            is_customizable=True,
        ),
        MenuItem(
            category_id=pizzas_cat.id,
            name="Sausage Pizza",
            description="Italian sausage with mozzarella and tomato sauce",
            base_price=12.99,
            is_customizable=True,
        ),
        MenuItem(
            category_id=pizzas_cat.id,
            name="Veggie Pizza",
            description="Bell peppers, mushrooms, onions, and olives on tomato sauce",
            base_price=12.99,
            is_customizable=True,
        ),
        MenuItem(
            category_id=pizzas_cat.id,
            name="Meat Lovers Pizza",
            description="Pepperoni, sausage, bacon, and ham piled high",
            base_price=14.99,
            is_customizable=True,
        ),
        MenuItem(
            category_id=pizzas_cat.id,
            name="BBQ Chicken Pizza",
            description="Grilled chicken, red onions, and mozzarella on tangy BBQ sauce",
            base_price=13.99,
            is_customizable=True,
        ),
        MenuItem(
            category_id=pizzas_cat.id,
            name="Hawaiian Pizza",
            description="Ham and pineapple on tomato sauce with mozzarella",
            base_price=12.99,
            is_customizable=True,
        ),
        MenuItem(
            category_id=pizzas_cat.id,
            name="Buffalo Chicken Pizza",
            description="Spicy buffalo chicken, mozzarella, and a drizzle of ranch",
            base_price=13.99,
            is_customizable=True,
        ),
    ]

    # ─── Sodas ────────────────────────────────────────────────────────────────
    sodas = [
        MenuItem(
            category_id=sodas_cat.id,
            name="Coke",
            description="Classic Coca-Cola",
            base_price=2.49,
            is_customizable=False,
        ),
        MenuItem(
            category_id=sodas_cat.id,
            name="Diet Coke",
            description="Coca-Cola Zero Sugar",
            base_price=2.49,
            is_customizable=False,
        ),
        MenuItem(
            category_id=sodas_cat.id,
            name="Sprite",
            description="Crisp and refreshing lemon-lime",
            base_price=2.49,
            is_customizable=False,
        ),
        MenuItem(
            category_id=sodas_cat.id,
            name="Dr Pepper",
            description="23 flavors of deliciousness",
            base_price=2.49,
            is_customizable=False,
        ),
        MenuItem(
            category_id=sodas_cat.id,
            name="Root Beer",
            description="Classic frosty root beer",
            base_price=2.49,
            is_customizable=False,
        ),
        MenuItem(
            category_id=sodas_cat.id,
            name="Lemonade",
            description="Fresh-squeezed style lemonade",
            base_price=2.99,
            is_customizable=False,
        ),
    ]

    db.add_all(pizzas + sodas)

    # ─── Toppings ─────────────────────────────────────────────────────────────
    toppings = [
        # Meats
        Topping(name="Pepperoni", price=1.50, category="meat"),
        Topping(name="Italian Sausage", price=1.50, category="meat"),
        Topping(name="Bacon", price=1.50, category="meat"),
        Topping(name="Ham", price=1.50, category="meat"),
        Topping(name="Grilled Chicken", price=2.00, category="meat"),
        Topping(name="Beef", price=1.50, category="meat"),
        Topping(name="Anchovies", price=1.50, category="meat"),

        # Veggies
        Topping(name="Mushrooms", price=1.00, category="veggie"),
        Topping(name="Bell Peppers", price=1.00, category="veggie"),
        Topping(name="Red Onions", price=1.00, category="veggie"),
        Topping(name="Black Olives", price=1.00, category="veggie"),
        Topping(name="Jalapeños", price=1.00, category="veggie"),
        Topping(name="Banana Peppers", price=1.00, category="veggie"),
        Topping(name="Spinach", price=1.00, category="veggie"),
        Topping(name="Tomatoes", price=1.00, category="veggie"),
        Topping(name="Pineapple", price=1.00, category="veggie"),
        Topping(name="Roasted Garlic", price=1.00, category="veggie"),

        # Cheese
        Topping(name="Extra Mozzarella", price=1.00, category="cheese"),
        Topping(name="Parmesan", price=1.00, category="cheese"),
        Topping(name="Feta", price=1.25, category="cheese"),
        Topping(name="Cheddar", price=1.00, category="cheese"),
        Topping(name="Ricotta", price=1.25, category="cheese"),

        # Sauces (swaps or extras)
        Topping(name="Extra Tomato Sauce", price=0.00, category="sauce"),
        Topping(name="BBQ Sauce", price=0.50, category="sauce"),
        Topping(name="Alfredo Sauce", price=0.75, category="sauce"),
        Topping(name="Buffalo Sauce", price=0.50, category="sauce"),
        Topping(name="Garlic Butter", price=0.50, category="sauce"),
        Topping(name="Ranch", price=0.50, category="sauce"),
    ]

    db.add_all(toppings)
    db.commit()

    print("✅ Done! Seeded:")
    print(f"   - 2 categories (Pizzas, Sodas)")
    print(f"   - {len(pizzas)} pizzas")
    print(f"   - {len(sodas)} sodas")
    print(f"   - {len(toppings)} toppings")


if __name__ == "__main__":
    try:
        seed()
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()
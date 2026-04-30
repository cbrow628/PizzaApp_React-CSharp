from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
from database import get_db
from routers.auth import get_current_user_optional, get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


# ─── Helpers ──────────────────────────────────────────────────────────────────

def validate_order(order_in: schemas.OrderCreate):
    """Validate delivery fields and guest fields."""
    if order_in.order_type == schemas.OrderType.delivery:
        if not all([order_in.delivery_address, order_in.delivery_city, order_in.delivery_zip]):
            raise HTTPException(
                status_code=400,
                detail="Delivery orders require address, city, and zip code.",
            )


def validate_guest_info(order_in: schemas.OrderCreate, user: Optional[models.User]):
    """If no logged-in user, guest info is required."""
    if not user:
        if not all([order_in.guest_name, order_in.guest_email, order_in.guest_phone]):
            raise HTTPException(
                status_code=400,
                detail="Guest orders require name, email, and phone number.",
            )


def calculate_order_total(
    items_in: List[schemas.OrderItemIn],
    db: Session,
) -> tuple[float, List[dict]]:
    """
    Validates each item/topping exists and is available, then
    calculates total price.

    Returns (total_price, list of resolved item dicts).
    """
    total = 0.0
    resolved_items = []

    for item_in in items_in:
        menu_item = db.query(models.MenuItem).filter(
            models.MenuItem.id == item_in.menu_item_id,
            models.MenuItem.is_available == True,
        ).first()
        if not menu_item:
            raise HTTPException(
                status_code=400,
                detail=f"Menu item {item_in.menu_item_id} not found or unavailable.",
            )

        unit_price = menu_item.base_price

        resolved_toppings = []
        for topping_id in (item_in.topping_ids or []):
            topping = db.query(models.Topping).filter(
                models.Topping.id == topping_id,
                models.Topping.is_available == True,
            ).first()
            if not topping:
                raise HTTPException(
                    status_code=400,
                    detail=f"Topping {topping_id} not found or unavailable.",
                )
            unit_price += topping.price
            resolved_toppings.append(topping)

        total += unit_price * item_in.quantity
        resolved_items.append({
            "menu_item": menu_item,
            "quantity": item_in.quantity,
            "unit_price": unit_price,
            "special_instructions": item_in.special_instructions,
            "toppings": resolved_toppings,
        })

    return round(total, 2), resolved_items


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.post("/", response_model=schemas.OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    """
    Place a new order. Works for both authenticated users and guests.
    Cart lives on the client — this endpoint receives the full order payload.
    """
    validate_order(order_in)
    validate_guest_info(order_in, current_user)

    total_price, resolved_items = calculate_order_total(order_in.items, db)

    # Create the order
    order = models.Order(
        user_id=current_user.id if current_user else None,
        order_type=order_in.order_type,
        total_price=total_price,
        special_instructions=order_in.special_instructions,
        guest_name=order_in.guest_name if not current_user else None,
        guest_email=order_in.guest_email if not current_user else None,
        guest_phone=order_in.guest_phone if not current_user else None,
        delivery_address=order_in.delivery_address,
        delivery_city=order_in.delivery_city,
        delivery_zip=order_in.delivery_zip,
    )
    db.add(order)
    db.flush()  # get order.id before committing

    # Create order items + toppings
    for item_data in resolved_items:
        order_item = models.OrderItem(
            order_id=order.id,
            menu_item_id=item_data["menu_item"].id,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            special_instructions=item_data["special_instructions"],
        )
        db.add(order_item)
        db.flush()

        for topping in item_data["toppings"]:
            db.add(models.OrderItemTopping(
                order_item_id=order_item.id,
                topping_id=topping.id,
            ))

    db.commit()
    db.refresh(order)
    return order


@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    """
    Get order status/details. Authenticated users can only see their own orders.
    Guests can look up any order by ID (rely on obscurity of ID for now).
    """
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # If logged in, make sure the order belongs to them
    if current_user and order.user_id and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")

    return order


@router.get("/", response_model=List[schemas.OrderOut])
def get_my_orders(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get order history for the authenticated user."""
    return (
        db.query(models.Order)
        .filter(models.Order.user_id == current_user.id)
        .order_by(models.Order.created_at.desc())
        .all()
    )

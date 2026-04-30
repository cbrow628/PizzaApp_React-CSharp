from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import get_db

router = APIRouter(prefix="/menu", tags=["menu"])


# ─── Categories ───────────────────────────────────────────────────────────────

@router.get("/categories", response_model=List[schemas.MenuCategoryOut])
def get_categories(db: Session = Depends(get_db)):
    """Return all menu categories sorted by sort_order."""
    return (
        db.query(models.MenuCategory)
        .order_by(models.MenuCategory.sort_order)
        .all()
    )


# ─── Menu Items ───────────────────────────────────────────────────────────────

@router.get("/items", response_model=List[schemas.MenuItemOut])
def get_menu_items(
    category_id: int = None,
    db: Session = Depends(get_db),
):
    """Return all available menu items, optionally filtered by category."""
    query = db.query(models.MenuItem).filter(models.MenuItem.is_available == True)
    if category_id:
        query = query.filter(models.MenuItem.category_id == category_id)
    return query.all()


@router.get("/items/{item_id}", response_model=schemas.MenuItemOut)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    """Return a single menu item by ID."""
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


# ─── Toppings ─────────────────────────────────────────────────────────────────

@router.get("/toppings", response_model=List[schemas.ToppingOut])
def get_toppings(
    category: str = None,
    db: Session = Depends(get_db),
):
    """Return all available toppings, optionally filtered by category (meat, veggie, cheese, sauce)."""
    query = db.query(models.Topping).filter(models.Topping.is_available == True)
    if category:
        query = query.filter(models.Topping.category == category)
    return query.order_by(models.Topping.category, models.Topping.name).all()

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum
from datetime import datetime


# ─── Enums ────────────────────────────────────────────────────────────────────

class OrderType(str, Enum):
    delivery = "delivery"
    pickup = "pickup"


class OrderStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    preparing = "preparing"
    out_for_delivery = "out_for_delivery"
    ready_for_pickup = "ready_for_pickup"
    completed = "completed"
    cancelled = "cancelled"


# ─── User ─────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None


# ─── Menu Category ─────────────────────────────────────────────────────────────

class MenuCategoryOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    sort_order: int

    class Config:
        from_attributes = True


# ─── Menu Item ────────────────────────────────────────────────────────────────

class MenuItemOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    base_price: float
    image_url: Optional[str]
    is_available: bool
    is_customizable: bool
    category: MenuCategoryOut

    class Config:
        from_attributes = True


# ─── Topping ──────────────────────────────────────────────────────────────────

class ToppingOut(BaseModel):
    id: int
    name: str
    price: float
    category: Optional[str]
    is_available: bool

    class Config:
        from_attributes = True


# ─── Order ────────────────────────────────────────────────────────────────────

class OrderItemToppingIn(BaseModel):
    topping_id: int


class OrderItemIn(BaseModel):
    menu_item_id: int
    quantity: int
    topping_ids: Optional[List[int]] = []
    special_instructions: Optional[str] = None


class OrderCreate(BaseModel):
    order_type: OrderType
    items: List[OrderItemIn]
    special_instructions: Optional[str] = None

    # Guest fields (required if not authenticated)
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None

    # Delivery fields (required if order_type == delivery)
    delivery_address: Optional[str] = None
    delivery_city: Optional[str] = None
    delivery_zip: Optional[str] = None


class OrderItemToppingOut(BaseModel):
    topping: ToppingOut

    class Config:
        from_attributes = True


class OrderItemOut(BaseModel):
    id: int
    menu_item: MenuItemOut
    quantity: int
    unit_price: float
    special_instructions: Optional[str]
    toppings: List[OrderItemToppingOut]

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    order_type: OrderType
    status: OrderStatus
    total_price: float
    guest_name: Optional[str]
    guest_email: Optional[str]
    guest_phone: Optional[str]
    delivery_address: Optional[str]
    delivery_city: Optional[str]
    delivery_zip: Optional[str]
    special_instructions: Optional[str]
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True

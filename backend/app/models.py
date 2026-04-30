from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class OrderType(str, enum.Enum):
    delivery = "delivery"
    pickup = "pickup"


class OrderStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    preparing = "preparing"
    out_for_delivery = "out_for_delivery"
    ready_for_pickup = "ready_for_pickup"
    completed = "completed"
    cancelled = "cancelled"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    orders = relationship("Order", back_populates="user")


class MenuCategory(Base):
    __tablename__ = "menu_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    sort_order = Column(Integer, default=0)

    items = relationship("MenuItem", back_populates="category")


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("menu_categories.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    base_price = Column(Float, nullable=False)
    image_url = Column(String(500))
    is_available = Column(Boolean, default=True)
    is_customizable = Column(Boolean, default=False)  # True for pizzas
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("MenuCategory", back_populates="items")
    order_items = relationship("OrderItem", back_populates="menu_item")


class Topping(Base):
    __tablename__ = "toppings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False, default=0.0)
    category = Column(String(50))  # e.g. "meat", "veggie", "cheese", "sauce"
    is_available = Column(Boolean, default=True)

    order_item_toppings = relationship("OrderItemTopping", back_populates="topping")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # nullable for guests
    order_type = Column(Enum(OrderType), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    total_price = Column(Float, nullable=False)

    # Guest info (used when no account)
    guest_name = Column(String(200))
    guest_email = Column(String(255))
    guest_phone = Column(String(20))

    # Delivery fields
    delivery_address = Column(String(500))
    delivery_city = Column(String(100))
    delivery_zip = Column(String(20))

    special_instructions = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)  # snapshot at time of order
    special_instructions = Column(Text)

    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem", back_populates="order_items")
    toppings = relationship("OrderItemTopping", back_populates="order_item")


class OrderItemTopping(Base):
    __tablename__ = "order_item_toppings"

    id = Column(Integer, primary_key=True, index=True)
    order_item_id = Column(Integer, ForeignKey("order_items.id"), nullable=False)
    topping_id = Column(Integer, ForeignKey("toppings.id"), nullable=False)

    order_item = relationship("OrderItem", back_populates="toppings")
    topping = relationship("Topping", back_populates="order_item_toppings")

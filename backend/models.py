from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)

    bookings = relationship(
        "Booking",
        back_populates="customer",
        cascade="all, delete"
    )


class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    skill = Column(String, nullable=False)
    contactnumber = Column(String, nullable=True)
    experience = Column(Integer, nullable=False)

    bookings = relationship(
        "Booking",
        back_populates="worker",
        cascade="all, delete"
    )


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("workers.id"), nullable=False)
    service_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")

    customer = relationship("Customer", back_populates="bookings")
    worker = relationship("Worker", back_populates="bookings")
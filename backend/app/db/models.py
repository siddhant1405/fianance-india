from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Asset(Base):
    __tablename__ = 'assets'
    
    symbol = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False) # forex, stock, index, commodity
    exchange = Column(String, nullable=True)

class PriceHistory(Base):
    __tablename__ = 'price_history'
    
    id = Column(Integer, primary_key=True, index=True)
    asset_symbol = Column(String, ForeignKey('assets.symbol'), nullable=False, index=True)
    date = Column(DateTime, nullable=False, index=True)
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Float, nullable=True)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    
    watchlist = relationship("WatchlistItem", back_populates="user")
    preferences = relationship("ReportPreference", back_populates="user", uselist=False)

class WatchlistItem(Base):
    __tablename__ = 'watchlist_items'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    asset_symbol = Column(String, ForeignKey('assets.symbol'), nullable=False)
    
    user = relationship("User", back_populates="watchlist")
    asset = relationship("Asset")

class ReportPreference(Base):
    __tablename__ = 'report_preferences'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    is_enabled = Column(Boolean, default=True)
    delivery_time = Column(String, default="09:00") # HH:MM format
    last_sent_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="preferences")

class QueryHistory(Base):
    __tablename__ = 'query_history'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    asset_symbol = Column(String, ForeignKey('assets.symbol'), nullable=False)
    timeframe = Column(String, nullable=False)
    queried_at = Column(DateTime, default=datetime.utcnow)

-- Zentoura Database Schema
-- MySQL Database Schema for Travel Blog Platform

-- Create database
CREATE DATABASE IF NOT EXISTS zentoura_db;
USE zentoura_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  authorId INT NOT NULL,
  featuredImage VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- Translations table
CREATE TABLE IF NOT EXISTS translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blogId INT NOT NULL,
  language VARCHAR(10) NOT NULL,
  translatedTitle VARCHAR(255) NOT NULL,
  translatedContent TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (blogId) REFERENCES blogs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_blog_language (blogId, language)
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(200) NOT NULL,
  pricePerNight DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Places table
CREATE TABLE IF NOT EXISTS places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  country VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(200) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  hotelId INT NULL,
  placeId INT NULL,
  activityId INT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hotelId) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (placeId) REFERENCES places(id) ON DELETE CASCADE,
  FOREIGN KEY (activityId) REFERENCES activities(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_blogs_author ON blogs(authorId);
CREATE INDEX idx_blogs_language ON blogs(language);
CREATE INDEX idx_translations_blog ON translations(blogId);
CREATE INDEX idx_hotels_location ON hotels(location);
CREATE INDEX idx_hotels_price ON hotels(pricePerNight);
CREATE INDEX idx_hotels_rating ON hotels(rating);
CREATE INDEX idx_places_country ON places(country);
CREATE INDEX idx_activities_location ON activities(location);
CREATE INDEX idx_activities_price ON activities(price);
CREATE INDEX idx_reviews_hotel ON reviews(hotelId);
CREATE INDEX idx_reviews_place ON reviews(placeId);
CREATE INDEX idx_reviews_activity ON reviews(activityId);

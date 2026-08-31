-- Migration to add missing columns to hotels table
USE zentoura;

-- Add missing columns to hotels table
ALTER TABLE hotels 
ADD COLUMN IF NOT EXISTS startingPrice DECIMAL(10, 2) DEFAULT 0.00 AFTER rating,
ADD COLUMN IF NOT EXISTS images JSON AFTER image,
ADD COLUMN IF NOT EXISTS amenities JSON AFTER images;

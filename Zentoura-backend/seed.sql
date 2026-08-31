-- Zentoura Sample Seed Data
USE zentoura_db;

-- Insert sample users
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@zentoura.com', '$2a$10$YourHashedPasswordHere', 'admin'),
('John Doe', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'user'),
('Jane Smith', 'jane@example.com', '$2a$10$YourHashedPasswordHere', 'user');

-- Insert sample blogs
INSERT INTO blogs (title, content, language, authorId, featuredImage) VALUES
('Exploring the Swiss Alps', 'The Swiss Alps offer breathtaking views and incredible hiking trails. From the Matterhorn to Jungfrau, every peak tells a story...', 'en', 1, 'blog-swiss-alps.jpg'),
('Hidden Gems of Tokyo', 'Beyond the bustling streets of Shibuya and the historic temples, Tokyo has countless hidden gems waiting to be discovered...', 'en', 1, 'blog-tokyo.jpg'),
('Mediterranean Cuisine Journey', 'Join me on a culinary adventure through the Mediterranean, where fresh ingredients and ancient recipes create magic...', 'en', 1, 'blog-mediterranean.jpg');

-- Insert sample translations
INSERT INTO translations (blogId, language, translatedTitle, translatedContent) VALUES
(1, 'es', 'Explorando los Alpes Suizos', 'Los Alpes Suizos ofrecen vistas impresionantes y senderos increíbles...'),
(1, 'fr', 'Explorer les Alpes Suisses', 'Les Alpes suisses offrent des vues à couper le souffle...'),
(2, 'ja', '東京の隠れた名所', '渋谷の賑やかな通りや歴史的な寺院を超えて...');

-- Insert sample hotels
INSERT INTO hotels (name, description, location, pricePerNight, rating, image) VALUES
('Grand Hotel Zermatterhof', 'Luxury 5-star hotel with stunning Matterhorn views', 'Zermatt, Switzerland', 450.00, 4.8, 'hotel-zermatt.jpg'),
('Park Hyatt Tokyo', 'Iconic luxury hotel in Shinjuku with panoramic city views', 'Tokyo, Japan', 380.00, 4.7, 'hotel-tokyo.jpg'),
('Santorini Secret Suites', 'Boutique cave hotel with caldera views', 'Santorini, Greece', 320.00, 4.9, 'hotel-santorini.jpg'),
('The Ritz Paris', 'Historic luxury hotel in the heart of Paris', 'Paris, France', 850.00, 4.9, 'hotel-paris.jpg'),
('Burj Al Arab', 'Iconic 7-star luxury hotel on a private island', 'Dubai, UAE', 1200.00, 5.0, 'hotel-dubai.jpg');

-- Insert sample places
INSERT INTO places (name, country, description, image) VALUES
('Matterhorn', 'Switzerland', 'Iconic pyramid-shaped mountain in the Swiss Alps', 'place-matterhorn.jpg'),
('Mount Fuji', 'Japan', 'Sacred mountain and highest peak in Japan', 'place-fuji.jpg'),
('Santorini Caldera', 'Greece', 'Stunning volcanic caldera with white-washed villages', 'place-santorini.jpg'),
('Eiffel Tower', 'France', 'Iconic iron lattice tower in Paris', 'place-eiffel.jpg'),
('Machu Picchu', 'Peru', 'Ancient Incan citadel in the Andes Mountains', 'place-machu-picchu.jpg');

-- Insert sample activities
INSERT INTO activities (title, description, location, price, image) VALUES
('Paragliding over Interlaken', 'Soar above the Swiss Alps with professional instructors', 'Interlaken, Switzerland', 180.00, 'activity-paragliding.jpg'),
('Sushi Making Class', 'Learn to make authentic sushi from a master chef', 'Tokyo, Japan', 95.00, 'activity-sushi.jpg'),
('Sunset Sailing Tour', 'Private sailing tour around the caldera at sunset', 'Santorini, Greece', 120.00, 'activity-sailing.jpg'),
('Wine Tasting in Bordeaux', 'Visit prestigious châteaux and taste world-class wines', 'Bordeaux, France', 150.00, 'activity-wine.jpg'),
('Desert Safari', 'Thrilling dune bashing and traditional Bedouin dinner', 'Dubai, UAE', 85.00, 'activity-safari.jpg');

-- Insert sample reviews
INSERT INTO reviews (userId, hotelId, rating, comment) VALUES
(2, 1, 5, 'Absolutely stunning hotel with incredible service and views!'),
(3, 2, 5, 'The best hotel experience in Tokyo. Highly recommended!'),
(2, 3, 5, 'Perfect honeymoon destination. The sunset views are magical.');

INSERT INTO reviews (userId, placeId, rating, comment) VALUES
(2, 1, 5, 'Breathtaking mountain. A must-see in Switzerland!'),
(3, 2, 5, 'Climbed Mount Fuji at sunrise. Unforgettable experience!');

INSERT INTO reviews (userId, activityId, rating, comment) VALUES
(2, 1, 5, 'Paragliding was the highlight of our trip. Amazing views!'),
(3, 2, 5, 'Learned so much and the sushi was delicious!');

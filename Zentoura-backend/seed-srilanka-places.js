const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedSriLankanPlaces() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    console.log('Connected to database...');

    const places = [
        {
            name: 'Sigiriya Rock Fortress',
            location: 'Central Province, Sri Lanka',
            short_description: 'Ancient rock fortress and UNESCO World Heritage Site with stunning frescoes and panoramic views',
            full_description: 'Sigiriya, also known as Lion Rock, is an ancient rock fortress located in the northern Matale District. This archaeological wonder dates back to the 5th century AD and was built by King Kashyapa. The site is famous for its massive column of rock that rises nearly 200 meters above the surrounding plains, ancient frescoes of celestial maidens, the Mirror Wall with ancient graffiti, and the Lion Gate. The summit features the ruins of an ancient palace with breathtaking 360-degree views. It is one of Sri Lanka\'s eight UNESCO World Heritage Sites and a masterpiece of ancient urban planning.',
            rating: 4.8,
            latitude: 7.9571,
            longitude: 80.7603,
            image: 'sigiriya-rock.jpg'
        },
        {
            name: 'Temple of the Sacred Tooth Relic',
            location: 'Kandy, Central Province, Sri Lanka',
            short_description: 'Sacred Buddhist temple housing the relic of the tooth of Buddha in the royal palace complex',
            full_description: 'The Temple of the Sacred Tooth Relic, or Sri Dalada Maligawa, is a Buddhist temple in Kandy that houses the relic of the tooth of the Buddha. Since ancient times, the relic has played an important role in local politics and is believed to hold the rightful governance of the country. The temple is part of the royal palace complex of the former Kingdom of Kandy. The architecture showcases Kandyan style with gold-plated roofs, intricate wood carvings, and beautiful paintings. The daily rituals and annual Esala Perahera festival draw thousands of pilgrims and tourists. The temple complex is a UNESCO World Heritage Site and the most sacred place of worship in Buddhism for Sinhalese people.',
            rating: 4.9,
            latitude: 7.2935,
            longitude: 80.6410,
            image: 'temple-tooth-kandy.jpg'
        },
        {
            name: 'Galle Fort',
            location: 'Galle, Southern Province, Sri Lanka',
            short_description: 'Historic fortified city built by the Portuguese and fortified by the Dutch, now a UNESCO World Heritage Site',
            full_description: 'Galle Fort is a historical, archaeological and architectural heritage monument located in Galle on the southwestern coast. The fort was first built by the Portuguese in 1588 and extensively fortified by the Dutch during the 17th century. It is a fine example of a fortified city built by Europeans in South and Southeast Asia, showing the interaction between European architectural styles and South Asian traditions. The 36-hectare fort features cobblestone streets, Dutch colonial buildings, museums, boutique hotels, cafes, and shops. The iconic lighthouse, old Dutch churches, and the rampart walks offering stunning ocean views make it one of the best-preserved colonial fortresses in Asia. It was declared a UNESCO World Heritage Site in 1988.',
            rating: 4.7,
            latitude: 6.0261,
            longitude: 80.2168,
            image: 'galle-fort.jpg'
        },
        {
            name: 'Ella Rock',
            location: 'Ella, Uva Province, Sri Lanka',
            short_description: 'Popular hiking destination offering breathtaking views of tea plantations and the Ella Gap',
            full_description: 'Ella Rock is one of the most scenic hiking destinations in Sri Lanka, located in the charming hill country town of Ella. The approximately 8km round-trip hike takes you through lush tea plantations, local villages, and eucalyptus forests. The summit stands at 1,041 meters and offers magnificent panoramic views of the Ella Gap, Little Adam\'s Peak, and the surrounding valleys covered in tea estates. Early morning hikes are particularly rewarding as you can witness the sunrise and the mist lifting from the valleys. The moderately challenging trek is suitable for most fitness levels and provides an authentic experience of Sri Lanka\'s hill country beauty. Local guides are available to help navigate the sometimes confusing trail.',
            rating: 4.6,
            latitude: 6.8667,
            longitude: 81.0467,
            image: 'ella-rock.jpg'
        },
        {
            name: 'Nine Arch Bridge',
            location: 'Ella, Uva Province, Sri Lanka',
            short_description: 'Iconic colonial-era railway viaduct made entirely of stone and brick without any steel',
            full_description: 'The Nine Arch Bridge, also called the Bridge in the Sky, is one of the most photographed landmarks in Sri Lanka. Built during the British colonial period, this 91-meter-long and 24-meter-high viaduct is an architectural marvel constructed entirely from stone brickwork without using any steel. The bridge features nine arches and is surrounded by lush green tea plantations and dense jungle. The best time to visit is when the train passes through, creating a spectacular photo opportunity. Local legend says the bridge was built by the locals using primitive methods when the construction materials failed to arrive. The scenic walk from Ella town through tea estates to reach the bridge is an experience in itself.',
            rating: 4.8,
            latitude: 6.8719,
            longitude: 81.0586,
            image: 'nine-arch-bridge.jpg'
        },
        {
            name: 'Yala National Park',
            location: 'Southern Province and Uva Province, Sri Lanka',
            short_description: 'Sri Lanka\'s most famous wildlife sanctuary with the highest density of leopards in the world',
            full_description: 'Yala National Park is the most visited and second-largest national park in Sri Lanka. The park consists of five blocks, with Block 1 being the most popular. Yala is famous for having one of the highest leopard densities in the world, making it one of the best places to spot these elusive cats. Beyond leopards, the park is home to 44 varieties of mammals including elephants, sloth bears, spotted deer, crocodiles, and wild boar. With over 215 bird species, it\'s also a paradise for bird watchers. The diverse ecosystems range from monsoon forests to beaches and lagoons. Safari jeeps operate from dawn to dusk, offering thrilling wildlife encounters. The park plays a crucial role in elephant conservation and maintaining biodiversity.',
            rating: 4.7,
            latitude: 6.3725,
            longitude: 81.5207,
            image: 'yala-national-park.jpg'
        },
        {
            name: 'Adam\'s Peak (Sri Pada)',
            location: 'Central Province, Sri Lanka',
            short_description: 'Sacred mountain pilgrimage site with a footprint at the summit revered by multiple religions',
            full_description: 'Adam\'s Peak, known locally as Sri Pada (Sacred Footprint), is a 2,243-meter tall conical mountain in central Sri Lanka. The mountain is sacred to multiple religions: Buddhists believe the footprint at the summit belongs to Buddha, Hindus attribute it to Shiva, Muslims and Christians believe it to be Adam\'s footprint. The pilgrimage season runs from December to May when thousands climb the 5,500 steps, many starting at night to reach the summit for sunrise. The climb takes 3-5 hours and passes through beautiful forests and tea estates. At the peak, pilgrims ring the bell once for each visit. The sunrise view from the summit, with the perfect triangular shadow of the peak cast on the clouds, is truly spectacular and spiritual.',
            rating: 4.9,
            latitude: 6.8095,
            longitude: 80.4989,
            image: 'adams-peak.jpg'
        },
        {
            name: 'Dambulla Cave Temple',
            location: 'Dambulla, Central Province, Sri Lanka',
            short_description: 'Ancient Buddhist cave temple complex with magnificent rock paintings and 153 Buddha statues',
            full_description: 'The Dambulla Cave Temple, also known as the Golden Temple of Dambulla, is the largest and best-preserved cave temple complex in Sri Lanka. This UNESCO World Heritage Site dates back to the 1st century BCE and contains five separate caves. The temple houses 153 Buddha statues, three statues of Sri Lankan kings, and four statues of gods and goddesses. The caves are decorated with over 2,100 square meters of painted walls and ceilings, depicting scenes from Buddha\'s life and Sinhalese history. The most impressive is Cave 2 (Maharaja Viharaya), containing 56 statues and the most extensive area of paintings. The site sits 160 meters above the plains and offers stunning views. The golden Buddha statue at the entrance is a modern addition that has become an iconic landmark.',
            rating: 4.8,
            latitude: 7.8567,
            longitude: 80.6483,
            image: 'dambulla-cave-temple.jpg'
        },
        {
            name: 'Anuradhapura Ancient City',
            location: 'North Central Province, Sri Lanka',
            short_description: 'Ancient capital city and sacred Buddhist pilgrimage site with massive dagobas and the sacred Bodhi tree',
            full_description: 'Anuradhapura is one of the ancient capitals of Sri Lanka, famous for its well-preserved ruins of ancient Sinhala civilization. Founded in the 4th century BCE, it was the capital for over 1,400 years. The city is a UNESCO World Heritage Site and one of the oldest continuously inhabited cities in the world. Major attractions include the sacred Sri Maha Bodhi tree (grown from a cutting of the original tree under which Buddha attained enlightenment), massive dagobas (stupas) like Ruwanwelisaya and Jetavanaramaya (one of the tallest ancient structures in the world), ancient reservoirs, moonstones, and guard stones showcasing advanced hydraulic engineering and artistry. The site covers 40 square kilometers and remains an active pilgrimage destination, offering insights into Sri Lankan Buddhist culture, architecture, and history.',
            rating: 4.7,
            latitude: 8.3114,
            longitude: 80.4037,
            image: 'anuradhapura-city.jpg'
        },
        {
            name: 'Mirissa Beach',
            location: 'Mirissa, Southern Province, Sri Lanka',
            short_description: 'Pristine tropical beach paradise famous for whale watching, surfing, and stunning sunsets',
            full_description: 'Mirissa is a small town on the south coast of Sri Lanka, famous for its beautiful crescent-shaped beach with golden sand and swaying palm trees. The beach is consistently rated as one of the best beaches in Sri Lanka and is known for its laid-back atmosphere. Mirissa is the whale and dolphin watching capital of Sri Lanka, with boat tours operating from November to April offering opportunities to see blue whales, sperm whales, and spinner dolphins. The beach offers excellent swimming conditions, though waves can be strong during monsoon season. There are great surf spots for beginners and intermediate surfers. The beach is lined with restaurants, beach bars, and guesthouses. The sunset views from Parrot Rock are spectacular, and the nightlife is vibrant yet relaxed, making it popular with backpackers and beach lovers.',
            rating: 4.8,
            latitude: 5.9467,
            longitude: 80.4689,
            image: 'mirissa-beach.jpg'
        }
    ];

    try {
        for (const place of places) {
            const [result] = await connection.execute(
                `INSERT INTO places (name, location, short_description, full_description, rating, latitude, longitude, image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    place.name,
                    place.location,
                    place.short_description,
                    place.full_description,
                    place.rating,
                    place.latitude,
                    place.longitude,
                    place.image
                ]
            );
            console.log(`✓ Inserted: ${place.name}`);
        }

        console.log('\n✅ Successfully inserted all 10 Sri Lankan places!');
    } catch (error) {
        console.error('❌ Error inserting places:', error.message);
    } finally {
        await connection.end();
    }
}

seedSriLankanPlaces();

const { Blog, User } = require('../models');
const { connectDB, sequelize } = require('../config/db');

const blogs = [
    // Heritage
    {
        title: 'Sigiriya: The Magnificent Lion Rock of Sri Lanka',
        shortDescription: 'Explore the ancient rock fortress and city of Sigiriya, a UNESCO World Heritage site and an architectural marvel.',
        content: `Rising nearly 200 meters from the central plains, the rock fortress of Sigiriya is perhaps Sri Lanka's most dramatic sight. Built by King Kasyapa in the 5th century, it was a royal palace and later a Buddhist monastery.

The climb to the top is an adventure in itself, passing through the famous 'Mirror Wall' and the 'Lion's Paw' entrance. The view from the summit is unparalleled, offering a 360-degree panorama of the surrounding jungles and water gardens.`,
        category: 'Heritage',
        tags: ['History', 'Culture', 'UNESCO'],
        latitude: 7.9570,
        longitude: 80.7603,
        isFeatured: true,
        featuredImage: 'https://images.unsplash.com/photo-1588596388566-44b550a47d78?w=1200'
    },
    {
        title: 'Polonnaruwa: The Medieval Capital',
        shortDescription: 'Discover the well-preserved ruins of palaces, temples, and colossal statues in Sri Lanka\'s second ancient capital.',
        content: `Polonnaruwa remains one of the best planned archaeological relic cities in the country. The city was established by the Cholas and later became the capital of the Sinhalese kingdom in the 11th century.

Key highlights include the Gal Vihara, featuring four massive Buddha statues carved out of a single granite rock, and the Royal Palace of King Parakramabahu I. The archaeological museum provides deep insights into the sophisticated irrigation systems of the time.`,
        category: 'Heritage',
        tags: ['History', 'Ancient', 'Archaeology'],
        latitude: 7.9403,
        longitude: 81.0188,
        isFeatured: false,
        featuredImage: 'https://images.unsplash.com/photo-1544616782-881812afec95?w=1200'
    },
    // Nature
    {
        title: 'Ella: A Paradise for Nature Lovers',
        shortDescription: 'Discover the misty hills, tea plantations, and the iconic Nine Arch Bridge in the charming town of Ella.',
        content: `Ella is a small town in the Badulla District of Uva Province, Sri Lanka. It is approximately 200 kilometers east of Colombo and situated at an elevation of 1,041 meters above sea level.

One of the most popular attractions is the Nine Arch Bridge, a colonial-era railway bridge known for its architectural beauty and scenic location. Hiking enthusiasts will love Little Adam's Peak and Ella Rock, both offering stunning views of the Ella Gap.`,
        category: 'Nature',
        tags: ['Hiking', 'Tea Gardens', 'Photography'],
        latitude: 6.8724,
        longitude: 81.0470,
        isFeatured: true,
        featuredImage: 'https://images.unsplash.com/photo-1552423315-992383832d29?w=1200'
    },
    {
        title: 'Sinharaja: The Primeval Rainforest',
        shortDescription: 'Step into a world of vibrant green in Sri Lanka\'s last remaining primary tropical rainforest and UNESCO site.',
        content: `Sinharaja Forest Reserve is a national park and a biodiversity hotspot in Sri Lanka. It is of international significance and has been designated a Biosphere Reserve and World Heritage Site by UNESCO.

The hilly virgin rainforest is a treasure trove of endemic species, including trees, insects, amphibians, reptiles, birds, and mammals. Because of the dense vegetation, wildlife is not as easily seen as at dry-zone national parks like Yala, but the experience of being in a true primeval forest is unmatched.`,
        category: 'Nature',
        tags: ['Rainforest', 'Biodiversity', 'Trekking'],
        latitude: 6.3986,
        longitude: 80.4172,
        isFeatured: false,
        featuredImage: 'https://images.unsplash.com/photo-1596131397999-bb0133405788?w=1200'
    },
    // Beaches
    {
        title: 'Unawatuna: Sun, Sand and Turqoise Waters',
        shortDescription: 'Relax on one of Sri Lanka\'s most iconic beaches, known for its golden sands and vibrant nightlife.',
        content: `Unawatuna is a coastal town in Galle district of Sri Lanka. It is a major tourist attraction in Sri Lanka and known for its beach and corals.

The main Unawatuna beach is a horseshoe-shaped bay protected by a reef, making it safe for swimming throughout the year. For a quieter experience, head over to Jungle Beach, a hidden gem accessible by a short hike or boat ride.`,
        category: 'Beaches',
        tags: ['Beach', 'Sunset', 'Relaxation'],
        latitude: 6.0122,
        longitude: 80.2464,
        isFeatured: true,
        featuredImage: 'https://images.unsplash.com/photo-1578516102641-7297e55dd537?w=1200'
    },
    {
        title: 'Mirissa: Whales and Pristine Shores',
        shortDescription: 'Experience world-class whale watching and the famous Coconut Tree Hill in the tropical haven of Mirissa.',
        content: `Mirissa is a small town on the south coast of Sri Lanka. Mirissa's beach and nightlife make it a popular tourist destination. It is also a fishing port and one of the island's main whale and dolphin watching locations.

Coconut Tree Hill is perhaps the most photographed spot in Mirissa, offering a beautiful view of the ocean through swaying palms. The beach itself is perfect for surfing, swimming, or simply lounging with a coconut in hand.`,
        category: 'Beaches',
        tags: ['Whale Watching', 'Surfing', 'Tropical'],
        latitude: 5.9483,
        longitude: 80.4716,
        isFeatured: false,
        featuredImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200'
    },
    // Adventure
    {
        title: 'Adrenaline Rush in Kithulgala',
        shortDescription: 'Challenge yourself with white water rafting and canyoning in the adventure capital of Sri Lanka.',
        content: `Located on the banks of the Kelani River, Kithulgala is the premier destination for adventure seekers in Sri Lanka. It's most famous for being the filming location of the Oscar-winning movie "The Bridge on the River Kwai".

White water rafting here is an exhilarating experience, with rapids ranging from Grade 2 to 3. But the adventure doesn't stop there—you can also try canyoning, waterfall abseiling, and jungle trekking.`,
        category: 'Adventure',
        tags: ['Rafting', 'Rivers', 'Adrenaline'],
        latitude: 6.9922,
        longitude: 80.4131,
        isFeatured: false,
        featuredImage: 'https://images.unsplash.com/photo-1533719079249-03c6976663ed?w=1200'
    },
    {
        title: 'Adam\'s Peak: The Sacred Ascent',
        shortDescription: 'Join thousands of pilgrims on a midnight hike to the summit of Sri Pada for a breathtaking sunrise.',
        content: `Adam's Peak (Sri Pada) is a 2,243 m tall conical mountain located in central Sri Lanka. It is well known for the Sri Pada, i.e., "sacred footprint", a 1.8 m rock formation near the summit.

The hike involves over 5,000 stone steps and is traditionally done at night to reach the summit for sunrise. The shadow of the peak cast onto the clouds below is a spiritual and visual phenomenon that attracts travelers from all over the world.`,
        category: 'Adventure',
        tags: ['Hiking', 'Sacred', 'Sunrise'],
        latitude: 6.8096,
        longitude: 80.4994,
        isFeatured: true,
        featuredImage: 'https://images.unsplash.com/photo-1544616782-881812afec95?w=1200'
    },
    // Food & Culture
    {
        title: 'The Sacred Splendor of Kandy',
        shortDescription: 'Venture into the hill capital to witness the Temple of the Tooth and the vibrant Esala Perahera.',
        content: `Kandy, the last capital of the ancient kings, is a city that breathes culture and tradition. At its heart lies the Temple of the Sacred Tooth Relic (Sri Dalada Maligawa), one of the most venerated sites in the Buddhist world.

If you visit in August, you can witness the Esala Perahera, one of Asia's grandest festivals featuring decorated elephants, traditional dancers, and fire-breathers.`,
        category: 'Food & Culture',
        tags: ['Kandy', 'Temple', 'Festival'],
        latitude: 7.2906,
        longitude: 80.6337,
        isFeatured: true,
        featuredImage: 'https://images.unsplash.com/photo-1625736340270-440d820269f8?w=1200'
    },
    {
        title: ' Jaffna: A Fusion of Flavors',
        shortDescription: 'Explore the unique Northern culture and the fiery, aromatic spices of authentic Jaffna Tamil cuisine.',
        content: `Jaffna is the capital city of the Northern Province of Sri Lanka. It has a distinct identity, shaped by its history and the resilience of its people. The city is a vibrant tapestry of colorful kovils (temples) and colonial architecture.

The food in Jaffna is legendary, particularly the Jaffna Crab Curry and the variety of snacks available at local markets. The use of roasted curry powder and palmyra products gives the cuisine a unique flavor profile that is different from the rest of the island.`,
        category: 'Food & Culture',
        tags: ['Jaffna', 'Cuisine', 'Tamil Culture'],
        latitude: 9.6615,
        longitude: 80.0255,
        isFeatured: false,
        featuredImage: 'https://images.unsplash.com/photo-1582202058342-99933583ae19?w=1200'
    }
];

const seedBlogs = async () => {
    try {
        await connectDB();

        // Find or create a demo user (Admin)
        let admin = await User.findOne({ where: { role: 'admin' } });
        if (!admin) {
            admin = await User.create({
                name: 'Zentoura Admin',
                email: 'admin@zentoura.com',
                password: 'password123', // In a real app, hash this!
                role: 'admin'
            });
        }

        // Truncate existing blogs to ensure uniqueness and remove duplicates
        console.log('🧹 Cleaning up existing blogs...');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Blog.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('🌱 Seeding fresh, unique blogs...');
        for (const blogData of blogs) {
            await Blog.create({
                ...blogData,
                authorId: admin.id
            });
        }

        console.log(`✅ ${blogs.length} unique Sri Lanka Blogs seeded successfully`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding blogs:', error);
        process.exit(1);
    }
};

seedBlogs();

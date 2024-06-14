import { HttpService } from "@nestjs/axios"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { DiscoveryService, ServiceDto } from "nest-eureka"
import { HikeAgencyService } from "src/hike-agency/hike-agency.service"
import { HikeService } from "src/hike/hike.service"
import { HikeBookingCreatedEvent } from "src/kafka/core/hike-bookings/events"
import { HikeReviewCreatedEvent } from "src/kafka/core/hike-reviews/events"
import { KafkaService } from "src/kafka/kafka.service"
import { ComplementaryService, Hike, PlanStep } from "src/schemas/Hike.schema"
import { HikeAgency } from "src/schemas/HikeAgency.schema"
import { BookingStatus, BookingType, HikeBooking } from "src/schemas/HikeBooking.schema"
import { HikeReview } from "src/schemas/HikeReview.schema"

@Injectable()
export class SeederService {
  private hikeAgencies: {
    name: string
    description: string
    address: string
    phone: string
    contact_email: string
    rating: number
  }[] = [
    {
      name: "Algerian Travelers",
      description:
        "Algerian Travelers specializes in organizing both domestic and international travel experiences, catering to the adventurous spirit within every traveler. With a focus on creating unforgettable journeys, we curate trips that immerse you in the heart of Algeria's diverse landscapes and cultural tapestry. Whether you're seeking the bustling energy of city life or the tranquility of nature's embrace, Algerian Travelers is dedicated to crafting personalized itineraries that exceed your expectations. Embark on a voyage of discovery with us and unlock the treasures of Algeria's rich heritage, from ancient ruins to vibrant marketplaces, and everything in between.",
      address: "Algiers, Algiers",
      phone: "+213 21 23 45 67",
      contact_email: "info@algeriantravelers.dz",
      rating: 4.3
    },
    {
      name: "Sahara Voyages",
      description:
        "Sahara Voyages invites you to embark on a transcendent journey through the mesmerizing landscapes of the Sahara Desert. Our expertly crafted tours and travel packages offer an immersive experience that goes beyond mere sightseeing, allowing you to connect with the timeless allure of the desert's vast expanses and shifting dunes. From exhilarating camel treks to tranquil nights under a blanket of stars, Sahara Voyages promises an adventure of a lifetime that will leave you enchanted and inspired.",
      address: "Ghardaia, Ghardaia",
      phone: "+213 29 87 65 43",
      contact_email: "contact@saharavoyages.dz",
      rating: 4.5
    },
    {
      name: "Kabyle Adventures",
      description:
        "Kabyle Adventures beckons thrill-seekers and nature enthusiasts to explore the rugged beauty of the Kabylie region. With a passion for adventure and a commitment to sustainable tourism, we offer a range of exhilarating experiences that showcase the untamed wilderness and cultural heritage of this breathtaking landscape. Whether you're scaling majestic peaks, delving into hidden caves, or immersing yourself in the vibrant traditions of local communities, Kabyle Adventures promises an authentic journey that will leave you with memories to last a lifetime.",
      address: "Tizi Ouzou, Tizi Ouzou",
      phone: "+213 26 54 32 10",
      contact_email: "info@kabyleadventures.dz",
      rating: 4.2
    },
    {
      name: "Oran Tours",
      description:
        "Oran Tours invites you to discover the vibrant tapestry of history, culture, and natural beauty that defines the enchanting Oran region. Our guided tours and excursions offer a unique opportunity to delve into the rich heritage of this coastal gem, from its bustling markets and ancient monuments to its sun-kissed beaches and lively waterfront promenades. Whether you're a history buff, a foodie, or simply seeking a relaxing escape by the sea, Oran Tours has something for everyone.",
      address: "Oran, Oran",
      phone: "+213 41 98 76 54",
      contact_email: "contact@orantours.dz",
      rating: 4.0
    },
    {
      name: "Constantine Explorers",
      description:
        "Constantine Explorers invites you to uncover the hidden gems of Constantine, a city steeped in history and brimming with cultural treasures. Our guided tours offer a fascinating glimpse into the past, as you wander through ancient streets, marvel at architectural marvels, and immerse yourself in the vibrant rhythms of daily life. From the iconic bridges spanning the deep gorges to the bustling souks and aromatic cafes, Constantine Explorers promises an unforgettable journey into the heart and soul of this captivating city.",
      address: "Constantine, Constantine",
      phone: "+213 31 20 45 67",
      contact_email: "explore@constantineexplorers.dz",
      rating: 4.4
    },
    {
      name: "Algeria Trekking",
      description:
        "Algeria Trekking offers adventure enthusiasts the opportunity to embark on an epic journey across Algeria's diverse landscapes, from rugged mountains to sweeping deserts and everything in between. Our expert guides lead you off the beaten path, revealing hidden gems and breathtaking vistas that few have the privilege to see. Whether you're an experienced hiker or a novice explorer, Algeria Trekking caters to all levels of fitness and ambition, ensuring a truly immersive and unforgettable trekking experience.",
      address: "Batna, Batna",
      phone: "+213 33 45 67 89",
      contact_email: "info@algeriatrekking.dz",
      rating: 4.6
    },
    {
      name: "Sahara Excursions",
      description:
        "Sahara Excursions invites you to experience the magic of the Sahara Desert with our tailored excursions that promise to ignite your sense of wonder and adventure. From camel treks across golden dunes to camping under a blanket of stars, our expert guides ensure a safe and unforgettable journey through this timeless landscape. Whether you're seeking adrenaline-fueled thrills or serene moments of reflection, Sahara Excursions offers a range of experiences that capture the essence of the Sahara in all its awe-inspiring beauty.",
      address: "Tamanrasset, Tamanrasset",
      phone: "+213 55 67 89 12",
      contact_email: "contact@saharaexcursions.dz",
      rating: 4.7
    },
    {
      name: "Algerian Coastal Tours",
      description:
        "Algerian Coastal Tours invites you to discover the enchanting beauty of Algeria's Mediterranean coast with our meticulously crafted guided tours. From picturesque beaches and hidden coves to charming seaside villages and ancient ruins, our itineraries showcase the diverse landscapes and rich cultural heritage of this stunning region. Whether you're a sun worshipper, a history buff, or a nature lover, Algerian Coastal Tours offers a journey of exploration and discovery that will leave you spellbound.",
      address: "Bejaia, Bejaia",
      phone: "+213 32 67 89 01",
      contact_email: "info@algeriancoastaltours.dz",
      rating: 4.3
    },
    {
      name: "Atlas Adventures",
      description:
        "Atlas Adventures invites you to embark on a journey of discovery through the majestic Atlas Mountains and beyond. Our experienced guides lead you off the beaten path, revealing hidden valleys, traditional Berber villages, and breathtaking vistas that will leave you speechless. Whether you're trekking through remote wilderness or immersing yourself in local culture, Atlas Adventures promises an authentic and unforgettable adventure that will awaken your senses and expand your horizons.",
      address: "Boumerdes, Boumerdes",
      phone: "+213 27 89 01 23",
      contact_email: "contact@atlasadventures.dz",
      rating: 4.5
    },
    {
      name: "Algiers Cultural Tours",
      description:
        "Algiers Cultural Tours offers immersive experiences that delve deep into the vibrant culture and rich history of Algeria's capital city. From the winding alleyways of the Casbah to the elegant boulevards of the French Quarter, our expert guides lead you on a journey through time, revealing the stories and secrets that have shaped this dynamic metropolis. Whether you're exploring ancient landmarks, sampling local cuisine, or soaking up the atmosphere of bustling markets, Algiers Cultural Tours promises a captivating and enriching experience that will leave you with a newfound appreciation for this vibrant city.",
      address: "Algiers, Algiers",
      phone: "+213 21 67 89 01",
      contact_email: "info@algiersculturaltours.dz",
      rating: 4.2
    }
  ]

  private destinations: {
    destination: string
    title: string
    description: string
    kid_price: number
    adult_price: number
    total_limit: number
    complementary_services: ComplementaryService[]
    plan: PlanStep[]
  }[] = [
    {
      destination: "Ghazaouat, Tlemcen",
      title: "Exploring the Beauty of Ghazaouat",
      description: `Ghazaouet is renowned for its daily fresh seafood which include: Sardines, mackerels, and red snappers. Ghazaouet boasts with mountainous hills and close ports and beaches where locals can be seen diving and swimming near fishing boats. The Lighthouse of Nemours, as displayed is also known by the locals as "Deux Frères". The rock itself is climbable however, requires a 7-to-10 minute swim from the pier/port to reach whereas, a ladder attached to the rock will allow you to climb onto a staircase to then walk around the top of the lighthouse, in which often times locals dive and jump from 95 meters high.`,
      kid_price: 5000,
      adult_price: 10000,
      total_limit: 20,
      complementary_services: [
        { name: "Guided Tour", price: 2000, type: "documentation" },
        { name: "Traditional Cuisine", price: 3000, type: "food" },
        { name: "Cultural Workshops", price: 2500, type: "activities" }
      ],
      plan: [
        {
          title: "Dive into Ghazaouet's Culinary Delights",
          description:
            "Start your journey in Ghazaouet by immersing yourself in its vibrant culinary scene. Indulge in a seafood feast featuring the freshest catches of the day, including succulent sardines, flavorful mackerels, and tender red snappers. Let your taste buds savor the flavors of the Mediterranean as you dine like a local and experience the true essence of Ghazaouet's seaside charm."
        },
        {
          title: "Explore the Natural Wonders",
          description: `After satisfying your appetite, embark on an adventure to explore Ghazaouet's breathtaking natural beauty. Traverse the mountainous hills that surround the town, soaking in panoramic views of the rugged landscape and sparkling coastline. Head to the nearby ports and beaches, where you can witness locals diving and swimming amidst fishing boats, immersing yourself in the vibrant energy of coastal life.`
        },
        {
          title: "Conquer the Lighthouse of Nemours",
          description: `Finish your Ghazaouet adventure with an exhilarating climb to the top of the iconic Lighthouse of Nemours, affectionately known as "Deux Frères" by locals. Embark on a thrilling 7-to-10 minute swim from the pier/port to reach the rock, where a ladder awaits to guide you onto a staircase leading to the lighthouse's summit. Take in panoramic views from 95 meters high, and if you dare, join the locals in a daring dive or jump into the crystal-clear waters below. Conquer the heights and create unforgettable memories in Ghazaouet's most iconic landmark.`
        }
      ]
    },
    {
      destination: "Santa Cruz, Oran",
      title: "Experience Santa Cruz",
      description: `Step into the serene beauty and rich history of Santa Cruz in Oran, where every moment is a celebration of life's simple pleasures. Nestled along the picturesque coastline, Santa Cruz beckons with its pristine beaches and charming waterfront promenades. Explore ancient fortresses and colonial-era buildings that tell the story of Oran's storied past, or simply soak up the sun while savoring a delicious beach picnic. With its blend of cultural heritage and natural beauty, Santa Cruz offers a truly unforgettable experience that will leave you longing to return.`,
      kid_price: 5500,
      adult_price: 11000,
      total_limit: 20,
      complementary_services: [
        { name: "Historical Tour", price: 2500, type: "documentation" },
        { name: "Beach Picnic", price: 3500, type: "food" },
        { name: "Traditional Dance", price: 4000, type: "activities" },
        { name: "Insurance", price: 200, type: "insurance" }
      ],
      plan: [
        {
          title: "Unveil Santa Cruz's Historical Legacy",
          description:
            "Begin your journey in Santa Cruz by delving into its rich historical legacy. Explore ancient fortresses and colonial-era buildings that speak volumes about Oran's storied past. Let the city's vibrant streets and bustling markets transport you back in time, as you uncover the secrets of Santa Cruz's cultural heritage."
        },
        {
          title: "Relaxation amidst Coastal Splendor",
          description:
            "After a morning of exploration, unwind amidst Santa Cruz's serene coastal beauty. Lounge on pristine beaches and soak up the Mediterranean sun, or take a leisurely stroll along the waterfront promenades. Indulge in a delightful beach picnic, savoring the flavors of local cuisine while watching the sun dip below the horizon."
        },
        {
          title: "Embrace Traditional Dance and Farewell",
          description:
            "Conclude your Santa Cruz experience with an evening of cultural immersion. Witness traditional dance performances that showcase Oran's vibrant cultural tapestry, as local artists captivate you with their rhythmic movements and colorful costumes. Bid farewell to Santa Cruz with cherished memories of its historical charm and coastal allure."
        }
      ]
    },
    {
      destination: "Ain Taya, Algiers",
      title: "Discover Ain Taya",
      description: `Immerse yourself in the tranquil ambiance and coastal charm of Ain Taya in Algiers, a hidden gem waiting to be explored. Nestled along the azure waters of the Mediterranean, Ain Taya boasts pristine beaches, rugged cliffs, and panoramic views that will take your breath away. Indulge in a boat tour along the coast, savoring the salty breeze and the warm embrace of the sun. Dive into the vibrant underwater world with a snorkeling adventure, or simply relax on the sandy shores with a seafood dinner as the sun dips below the horizon. With its blend of natural beauty and cultural allure, Ain Taya promises a getaway like no other.`,
      kid_price: 4800,
      adult_price: 9600,
      total_limit: 20,
      complementary_services: [
        { name: "Guided Tour", price: 2000, type: "documentation" },
        { name: "Boat Tour", price: 3000, type: "activities" },
        { name: "Seafood Dinner", price: 2500, type: "food" },
        { name: "Craft Workshop", price: 2000, type: "activities" },
        { name: "Insurance", price: 200, type: "insurance" }
      ],
      plan: [
        {
          title: "Sail into Coastal Splendor",
          description:
            "Begin your journey in Ain Taya with a leisurely boat tour along its picturesque coastline. Glide through azure waters, taking in panoramic views of rugged cliffs and sandy beaches. Let the salty breeze invigorate your senses as you embark on a maritime adventure, exploring hidden coves and pristine bays."
        },
        {
          title: "Seafood Extravaganza and Craft Exploration",
          description:
            "After a morning on the water, indulge in a seafood extravaganza at a local seaside restaurant. Feast on fresh catches of the day, from succulent prawns to delicate fish, while savoring the flavors of coastal cuisine. Continue your cultural exploration with a hands-on craft workshop, where local artisans share their skills and traditions, allowing you to create your own masterpiece to cherish."
        },
        {
          title: "Seaside Relaxation and Farewell",
          description:
            "Conclude your Ain Taya experience with a day of seaside relaxation. Lounge on sandy shores and bask in the warm glow of the sun, letting the rhythmic sound of the waves lull you into a state of blissful tranquility. Bid farewell to Ain Taya with cherished memories of its coastal charm and cultural richness."
        }
      ]
    },
    {
      destination: "Annaba, Annaba",
      title: "Explore Annaba",
      description: `Uncover the historical treasures and scenic beauty of Annaba, a city steeped in history and culture. From ancient Roman ruins to bustling markets, Annaba offers a rich tapestry of experiences that will captivate your imagination. Sample local cuisine at traditional eateries, where fragrant spices and fresh ingredients come together to create culinary delights. Stroll through vibrant neighborhoods, where the rhythms of daily life blend seamlessly with echoes of the past. Whether you're exploring ancient landmarks or simply soaking up the atmosphere, Annaba promises an unforgettable journey into the heart of Algeria.`,
      kid_price: 5200,
      adult_price: 10400,
      total_limit: 20,
      complementary_services: [
        { name: "Historical Tour", price: 2000, type: "documentation" },
        { name: "Local Cuisine", price: 3000, type: "food" },
        { name: "Shopping Excursion", price: 1500, type: "activities" },
        { name: "Insurance", price: 200, type: "insurance" }
      ],
      plan: [
        {
          title: "Uncover Annaba's Historical Treasures",
          description:
            "Embark on a journey through time as you uncover the historical treasures of Annaba. Explore ancient ruins and archaeological sites that bear witness to the city's rich and storied past. Let the whispers of history guide you as you wander through labyrinthine streets, discovering hidden gems at every turn."
        },
        {
          title: "Savor the Flavors of Local Cuisine",
          description:
            "Treat your taste buds to an unforgettable culinary experience as you savor the flavors of local cuisine in Annaba. Indulge in traditional dishes bursting with fresh ingredients and bold spices, served with warm hospitality in charming eateries and bustling markets. Immerse yourself in the gastronomic delights of the region, from savory tagines to decadent pastries."
        },
        {
          title: "Immerse Yourself in Vibrant Markets",
          description:
            "Step into the heart of Annaba's vibrant markets and bazaars, where the pulse of the city beats strongest. Lose yourself in a maze of stalls overflowing with exotic spices, colorful textiles, and handcrafted treasures. Engage with local vendors and artisans, haggling for souvenirs to take home as cherished mementos of your time in Annaba."
        }
      ]
    },
    {
      destination: "Constantine, Constantine",
      title: "Discover Constantine",
      description: `Immerse yourself in the vibrant culture and ancient history of Constantine, a city that bridges the gap between past and present. Perched atop rugged cliffs overlooking the Rhumel River, Constantine is a treasure trove of architectural wonders and cultural heritage. Wander through the labyrinthine streets of the Casbah, where ancient mosques and bustling souks transport you to another time. Experience the warmth of Algerian hospitality as you savor local cuisine at traditional restaurants, or lose yourself in the mesmerizing rhythms of traditional music and dance. With its blend of ancient charm and modern vitality, Constantine promises an unforgettable adventure that will leave you enchanted.`,
      kid_price: 5300,
      adult_price: 10600,
      total_limit: 20,
      complementary_services: [
        { name: "City Tour", price: 2500, type: "documentation" },
        { name: "Cultural Performance", price: 3500, type: "activities" },
        { name: "Local Cuisine", price: 4000, type: "food" },
        { name: "Insurance", price: 200, type: "insurance" }
      ],
      plan: [
        {
          title: "Discover the Ancient Wonders of Constantine",
          description:
            "Embark on a journey through time as you discover the ancient wonders of Constantine. Explore the city's storied past through its remarkable architecture, from ancient Roman ruins to medieval fortresses. Let the echoes of history guide you as you wander through labyrinthine streets, uncovering hidden treasures at every turn."
        },
        {
          title: "Experience the Vibrant Culture",
          description:
            "Immerse yourself in the vibrant culture of Constantine as you explore its bustling streets and lively markets. Engage with friendly locals, who will welcome you with open arms and warm hospitality. Discover the city's rich artistic heritage through music, dance, and traditional crafts, as you create memories to last a lifetime."
        },
        {
          title: "Indulge in Culinary Delights",
          description:
            "Treat your taste buds to a feast of culinary delights as you sample the flavors of Constantine. Savor traditional dishes bursting with bold spices and fresh ingredients, served with pride in local eateries and family-owned restaurants. Immerse yourself in the gastronomic traditions of the region, from hearty couscous to fragrant tagines."
        }
      ]
    },
    {
      destination: "Port de Bejaia, Bejaia",
      title: "Port de Bejaia Adventure",
      description: `Embark on an adventure to explore the scenic beauty and maritime heritage of Port de Bejaia, a coastal paradise waiting to be discovered. Nestled along the rugged coastline of the Mediterranean, Port de Bejaia offers a stunning backdrop of azure waters, golden sands, and towering cliffs. Set sail on a guided boat excursion, navigating pristine coves and hidden caves as you soak up the sun and sea breeze. Indulge in a seafood lunch at a seaside restaurant, savoring the fresh flavors of the Mediterranean. With its blend of natural beauty and cultural allure, Port de Bejaia promises an unforgettable escape that will leave you longing for more.`,
      kid_price: 4900,
      adult_price: 9800,
      total_limit: 20,
      complementary_services: [
        { name: "Guided Tour", price: 2000, type: "documentation" },
        { name: "Boat Excursion", price: 3000, type: "activities" },
        { name: "Seafood Lunch", price: 2500, type: "food" },
        { name: "Beach Activities", price: 2000, type: "activities" },
        { name: "Insurance", price: 200, type: "insurance" }
      ],
      plan: [
        {
          title: "Explore Maritime Heritage",
          description:
            "Embark on a journey to explore the rich maritime heritage of Port de Bejaia. Discover ancient ports and bustling harbors that have played a vital role in the city's history. Learn about the traditions of seafaring communities and the importance of trade routes that have connected Bejaia to the wider world for centuries."
        },
        {
          title: "Indulge in Seafood Extravaganza",
          description:
            "Treat yourself to a seafood extravaganza as you sample the freshest catches of the day in Port de Bejaia. From succulent prawns to delicate fish, savor the flavors of the Mediterranean as you dine in charming seaside restaurants overlooking the azure waters. Immerse yourself in the culinary delights of the sea, served with warm hospitality and local flair."
        },
        {
          title: "Relaxation amidst Coastal Beauty",
          description:
            "Unwind amidst the stunning coastal beauty of Port de Bejaia as you spend a day lounging on pristine beaches and soaking up the Mediterranean sun. Take a refreshing dip in crystal-clear waters or stroll along sandy shores, letting the rhythmic sound of the waves soothe your soul. Indulge in moments of blissful tranquility, surrounded by the breathtaking scenery of Bejaia."
        }
      ]
    },
    {
      destination: "Tigzirt, Tizi Ouzou",
      title: "Tigzirt Exploration",
      description: `Embark on a journey to explore the captivating beauty and cultural heritage of Tigzirt, a hidden gem nestled along the rugged coastline of Tizi Ouzou. With its pristine beaches, quaint fishing villages, and ancient ruins, Tigzirt offers a glimpse into Algeria's rich history and natural splendor. Explore ancient landmarks dating back centuries, from Roman ruins to medieval fortresses, as you unravel the mysteries of this enchanting coastal town. Indulge in traditional cuisine at local eateries, where fresh seafood and aromatic spices tantalize your taste buds. Whether you're lounging on the beach or wandering through historic streets, Tigzirt promises an unforgettable adventure that will leave you spellbound.`,
      kid_price: 4700,
      adult_price: 9400,
      total_limit: 20,
      complementary_services: [
        { name: "Historical Tour", price: 2000, type: "documentation" },
        { name: "Traditional Cuisine", price: 3000, type: "food" },
        { name: "Local Workshop", price: 2500, type: "activities" },
        { name: "Insurance", price: 200, type: "insurance" }
      ],
      plan: [
        {
          title: "Discover Cultural Heritage",
          description:
            "Embark on a journey to discover the rich cultural heritage of Tigzirt as you explore its historic landmarks and architectural treasures. Wander through ancient streets lined with charming cafes and artisan shops, immersing yourself in the vibrant atmosphere of this coastal town. Learn about the traditions and customs of the local Berber community, who have called Tigzirt home for centuries."
        },
        {
          title: "Savor Traditional Cuisine",
          description:
            "Treat your taste buds to the flavors of traditional Berber cuisine as you dine in local eateries and family-owned restaurants. Savor hearty tagines, fragrant couscous, and delicate pastries, made with fresh ingredients and authentic spices. Immerse yourself in the culinary traditions of Tigzirt, where every dish tells a story of heritage and hospitality."
        },
        {
          title: "Relaxation amidst Coastal Splendor",
          description:
            "Unwind amidst the breathtaking coastal splendor of Tigzirt as you spend a day lounging on pristine beaches and exploring hidden coves. Dip your toes in the crystal-clear waters of the Mediterranean or take a leisurely stroll along sandy shores, soaking up the warm sunshine and gentle sea breeze. Indulge in moments of peace and serenity, surrounded by the natural beauty of Tigzirt."
        }
      ]
    },
    {
      destination: "Desert, Tamanrasset",
      title: "Tamanraset Desert Expedition",
      description: `Embark on an unforgettable journey into the heart of the Tamanraset Desert and experience the magic of the Sahara. From towering sand dunes to vast expanses of golden sands, the desert offers a landscape of unparalleled beauty and tranquility. Join us on a guided camel ride through the dunes, as you traverse ancient caravan routes and camp under the starlit sky. Experience the thrill of desert camping, as you gather around a crackling fire and share stories under the Milky Way. With its blend of adventure and serenity, the Tamanraset Desert promises an unforgettable experience that will stay with you long after your journey ends.`,
      kid_price: 6000,
      adult_price: 12000,
      total_limit: 20,
      complementary_services: [
        { name: "Guided Tour", price: 2000, type: "documentation" },
        { name: "Camel Ride", price: 3000, type: "activities" },
        { name: "Desert Camping", price: 4000, type: "activities" },
        { name: "Stargazing Experience", price: 2500, type: "activities" },
        { name: "Insurance", price: 200, type: "insurance" }
      ],
      plan: [
        {
          title: "Embark on Desert Adventure",
          description:
            "Begin your adventure with an exhilarating journey into the heart of the Tamanraset Desert. Traverse vast dunes and rugged landscapes as you journey deeper into this untamed wilderness. Feel the thrill of the open desert as you ride atop a majestic camel, following ancient trade routes and discovering hidden oases along the way."
        },
        {
          title: "Camp under Starlit Sky",
          description:
            "Experience the magic of the desert as you camp under a starlit sky, surrounded by the silence and stillness of the Sahara. Set up camp amidst towering dunes and rolling sands, where the only sounds are the whisper of the wind and the crackle of a campfire. Fall asleep beneath a blanket of stars, as the Milky Way stretches across the endless expanse of the night sky."
        },
        {
          title: "Witness Spectacular Sunrise",
          description:
            "Wake up to the breathtaking beauty of a Sahara sunrise, as golden light spills across the horizon and paints the desert in hues of orange and pink. Climb to the top of a nearby dune to watch the sun emerge from the endless sands, casting a warm glow over the desert landscape. Immerse yourself in the tranquility of the morning desert, as a new day dawns in Tamanraset."
        }
      ]
    },
    {
      destination: "Beaches, Skikda",
      title: "Skikda Beach Retreat",
      description: `Indulge in relaxation and rejuvenation amidst the pristine beaches of Skikda, where every moment is a celebration of sun, sea, and sand. Nestled along the picturesque coastline of the Mediterranean, Skikda offers an idyllic escape from the hustle and bustle of everyday life. Sink your toes into the soft sands and bask in the warm glow of the sun, as gentle waves lull you into a state of blissful tranquility. Join us for beachside yoga sessions, where the rhythmic sound of the waves provides the perfect backdrop for inner peace and reflection. With its blend of natural beauty and laid-back charm, Skikda promises a beach retreat like no other.`,
      kid_price: 5500,
      adult_price: 11000,
      total_limit: 20,
      complementary_services: [
        { name: "Guided Tour", price: 2000, type: "documentation" },
        { name: "Beachside Yoga", price: 2500, type: "activities" },
        { name: "Seafood Buffet", price: 3500, type: "food" },
        { name: "Sports Activities", price: 4000, type: "activities" },
        { name: "Insurance", price: 200, type: "insurance" }
      ],
      plan: [
        {
          title: "Relaxation on Pristine Beaches",
          description:
            "Indulge in ultimate relaxation as you spend your first day lounging on Skikda's pristine beaches. Sink your toes into soft sands and soak up the Mediterranean sun while listening to the soothing sound of waves crashing against the shore. Take a refreshing dip in crystal-clear waters or simply unwind with a good book under the shade of a palm tree."
        },
        {
          title: "Explore Coastal Delights",
          description:
            "Discover the coastal delights of Skikda as you embark on a day of exploration along its scenic shores. Take a leisurely stroll along the waterfront promenade, admiring panoramic views of the Mediterranean Sea. Visit local markets and bustling cafes, where you can sample fresh seafood and traditional Algerian delicacies while soaking in the vibrant atmosphere of this coastal gem."
        },
        {
          title: "Engage in Water Sports Adventure",
          description:
            "Get your adrenaline pumping with an exhilarating day of water sports adventure in Skikda. Dive into crystal-clear waters and explore vibrant underwater ecosystems teeming with marine life. Try your hand at thrilling water sports such as jet skiing, windsurfing, or parasailing, under the guidance of experienced instructors. Create unforgettable memories as you experience the thrill of Skikda's dynamic coastal playground."
        }
      ]
    },
    {
      destination: "Aqua Park, Mostaganem",
      title: "Mostaganem Aqua Park Adventure",
      description: `Dive into excitement and fun at Mostaganem's thrilling Aqua Park, where every splash is a thrill and every slide is an adventure. Nestled amidst lush greenery and sparkling pools, the Aqua Park offers a world of aquatic excitement for thrill-seekers of all ages. Zoom down twisting water slides, ride the waves in the wave pool, or simply relax and soak up the sun on the poolside. Indulge in poolside snacks and refreshing drinks as you take a break from the action, and don't forget to capture every moment of fun and laughter with family and friends. With its blend of adrenaline-pumping rides and laid-back leisure, the Mostaganem Aqua Park promises an unforgettable adventure that will leave you wanting more.`,
      kid_price: 4800,
      adult_price: 9600,
      total_limit: 20,
      complementary_services: [
        { name: "Guided Tour", price: 2000, type: "documentation" },
        { name: "Water Slide", price: 2000, type: "activities" },
        { name: "Wave Pool", price: 3000, type: "activities" },
        { name: "Poolside Snacks", price: 2500, type: "food" },
        { name: "Insurance", price: 200, type: "insurance" }
      ],
      plan: [
        {
          title: "Dive into Aqua Park Adventure",
          description:
            "Embark on an adventure to Mostaganem's thrilling Aqua Park, where excitement and fun await at every turn. Dive into crystal-clear pools and race down exhilarating water slides, feeling the rush of adrenaline as you splash and play. Immerse yourself in the park's exciting attractions, from wave pools to lazy rivers, for a day of endless aquatic thrills."
        },
        {
          title: "Relaxation by the Poolside",
          description:
            "Indulge in moments of relaxation by the poolside as you unwind after a day of aquatic adventure. Lounge on comfortable sunbeds and soak up the warm Mediterranean sun, sipping on refreshing drinks and enjoying poolside snacks. Take a leisurely dip in the pool or simply bask in the tranquil ambiance, surrounded by lush greenery and sparkling waters."
        },
        {
          title: "Farewell to Aqua Park",
          description:
            "Bid farewell to Mostaganem's Aqua Park with cherished memories of laughter and excitement. Take one last plunge into the refreshing waters or enjoy a final slide down your favorite water slide, reliving the thrill of the day's adventures. Leave the park with a smile on your face and a heart full of unforgettable moments, as you cherish the memories of your Aqua Park adventure."
        }
      ]
    }
  ]

  private departure_places: string[] = [
    "Algiers",
    "Tlemcen",
    "Constantine",
    "Oran",
    "Annaba",
    "Bejaia",
    "Tizi Ouzou",
    "Biskra",
    "Ghardaia",
    "Setif"
  ]
  private msUsers: ServiceDto
  constructor(
    @InjectModel(Hike.name) private hikeModel: Model<Hike>,
    @InjectModel(HikeAgency.name) private hikeAgencyModel: Model<HikeAgency>,
    @InjectModel(HikeBooking.name) private hikeBookingModel: Model<HikeBooking>,
    @InjectModel(HikeReview.name) private hikeReviewModel: Model<HikeReview>,
    private readonly httpService: HttpService,
    private readonly discoveryService: DiscoveryService,
    private readonly kafkaService: KafkaService
  ) {}

  onModuleInit() {
    //to make sure ms-users is read
    setTimeout(async () => {
      console.log("Executing Seeder Service")
      console.log("Initializing Hike Agencies")

      await Promise.all([
        this.hikeAgencyModel.deleteMany({}),
        this.hikeModel.deleteMany({}),
        this.hikeBookingModel.deleteMany({})
      ])
      this.msUsers = this.discoveryService.resolveHostname("ms-users")
      for (let i = 0; i < this.hikeAgencies.length; i++) {
        const t = await this.hikeAgencyModel.create({
          name: this.hikeAgencies[i].name,
          description: this.hikeAgencies[i].description,
          address: this.hikeAgencies[i].address,
          phone: this.hikeAgencies[i].phone,
          contact_email: this.hikeAgencies[i].contact_email,
          reviews_count: 10,
          photos: [
            `${HikeAgencyService.IMAGES_PATH}1.png`,
            `${HikeAgencyService.IMAGES_PATH}2.png`,
            `${HikeAgencyService.IMAGES_PATH}3.png`,
            `${HikeAgencyService.IMAGES_PATH}4.png`
          ],
          logo: `${HikeAgencyService.LOGOS_PATH}logo.png`,
          social_media: {},
          rating: this.hikeAgencies[i].rating,
          is_complete: true
        })
        await this.httpService.axiosRef
          .post(`http://ms-users:${this.msUsers.port}/user/internal`, {
            email: `hike${i}@agent.com`,
            password: "password",
            confirm_password: "password",
            role: "HIKE_AGENT",
            organization_id: t._id.toString(),
            first_name: `hike${i}`,
            last_name: "agent",
            address: "tlemcen",
            phone: "05533203",
            gender: "MALE",
            birth_date: "2002-07-08"
          })
          .then(() => {
            console.log(`User hike${i}@agent.com added`)
          })
          .catch(() => {
            console.log(`Error creating User hike${i}@agent.com`)
          })
      }

      console.log("Initializing Hikes")
      const agencies = await this.hikeAgencyModel.find().select("_id")
      agencies.forEach(async (agency) => {
        for (let i = 0; i < 10; i++) {
          const hike = await this.hikeModel.create({
            hike_agency: agency._id.toString(),
            title: this.destinations[i].title,
            description: this.destinations[i].description,
            departure_date: new Date().setDate(new Date().getDate() + 5),
            return_date: new Date().setDate(new Date().getDate() + 6 + i),
            duration: 1 + i,
            departure_place: this.departure_places[i],
            destination: this.destinations[i].destination,
            total_limit: 30,
            places_left: 10,
            adult_price: this.destinations[i].adult_price,
            kid_price: this.destinations[i].kid_price,
            photos:
              i % 3 == 0
                ? [
                    `${HikeService.IMAGES_PATH}3.png`,
                    `${HikeService.IMAGES_PATH}2.png`,
                    `${HikeService.IMAGES_PATH}4.png`,
                    `${HikeService.IMAGES_PATH}1.png`
                  ]
                : i % 3 == 1
                  ? [
                      `${HikeService.IMAGES_PATH}4.png`,
                      `${HikeService.IMAGES_PATH}3.png`,
                      `${HikeService.IMAGES_PATH}4.png`,
                      `${HikeService.IMAGES_PATH}1.png`
                    ]
                  : [
                      `${HikeService.IMAGES_PATH}2.png`,
                      `${HikeService.IMAGES_PATH}4.png`,
                      `${HikeService.IMAGES_PATH}3.png`,
                      `${HikeService.IMAGES_PATH}1.png`
                    ],
            complementary_services: this.destinations[i].complementary_services,
            plan: this.destinations[i].plan
          })

          for (let i = 1; i < 11; i++) {
            const b = await this.hikeBookingModel.create({
              hike: hike._id,
              hike_agency: hike.hike_agency,
              user_id: i,
              price: hike.adult_price + hike.kid_price + hike.complementary_services[0].price,
              booking_items: [
                {
                  full_name: "John adult",
                  phone: "05533203",
                  type: BookingType.ADULT,
                  status: BookingStatus.PENDING,
                  chosen_services: [],
                  price: hike.adult_price
                },
                {
                  full_name: "Jane kid",
                  phone: "055332033",
                  type: BookingType.KID,
                  status: BookingStatus.PENDING,
                  chosen_services: [hike.complementary_services[0].name],
                  price: hike.kid_price + hike.complementary_services[0].price
                }
              ]
            })

            this.kafkaService.sendHikeBookingEvent(
              new HikeBookingCreatedEvent({
                id: b._id,
                price: b.price + "",
                user_id: i,
                paid: b.paid,
                method: b.method,
                hike_id: hike._id,
                agency_id: agency._id,
                hike_agency_name: agency.name,
                hike_destination: hike.destination,
                hike_departure_date: hike.departure_date,
                booking_items: b.booking_items
              })
            )

            const review = await this.hikeReviewModel.create({
              hike: b.hike,
              agency: b.hike_agency,
              user_id: b.user_id,
              booking: b._id,
              rating: Math.floor(Math.random() * 5) + 1,
              comment: "Great experience! Highly recommended."
            })
            this.kafkaService.sendHikeReviewEvent(
              new HikeReviewCreatedEvent({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user_id: review.user_id,
                booking_id: review.booking,
                hike_id: review.hike,
                agency_id: review.agency,
                reviews_count: 100
              })
            )
          }
        }
      })
    }, 60000)
  }
}

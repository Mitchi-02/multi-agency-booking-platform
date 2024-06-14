import { HttpService } from "@nestjs/axios"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { DiscoveryService, ServiceDto } from "nest-eureka"
import { TravelAgencyService } from "src/travel-agency/travel-agency.service"
import { TravelService } from "src/travel/travel.service"
import {
  ComplementaryService,
  PlanStep,
  Travel,
  TravelRegion,
  TravelTransportationType
} from "src/schemas/Travel.schema"
import { TravelAgency } from "src/schemas/TravelAgency.schema"
import { BookingStatus, BookingType, TravelBooking } from "src/schemas/TravelBooking.schema"
import { TravelReview } from "src/schemas/TravelReview.schema"
import { KafkaService } from "src/kafka/kafka.service"
import { TravelBookingCreatedEvent } from "src/kafka/core/travel-bookings/events"
import { TravelReviewCreatedEvent } from "src/kafka/core/travel-reviews/events"

@Injectable()
export class SeederService {
  private readonly travelAgencies: {
    name: string
    description: string
    address: string
    phone: string
    contact_email: string
    rating: number
  }[] = [
    {
      name: "American Express Travel",
      description:
        "Embark on a journey of unparalleled luxury and convenience with American Express Travel. As one of the premier travel agencies, we offer a comprehensive range of services tailored to meet the needs of discerning travelers. From securing exclusive flight deals and luxurious accommodations to arranging seamless car rentals, unforgettable cruises, and bespoke vacation packages, we ensure every aspect of your trip is curated to perfection. Our dedicated team of travel experts is committed to providing personalized assistance and unrivaled customer service, ensuring your travel experience exceeds expectations. With American Express Travel, the world is yours to explore in style and comfort.",
      address: "New York, USA",
      phone: "+1 (800) 297-2977",
      contact_email: "support@amextravel.com",
      rating: 4.5
    },
    {
      name: "STA Travel",
      description:
        "Embark on an adventure of a lifetime with STA Travel, the ultimate destination for student and youth travel. With our extensive network and expertise in catering to the unique needs of young travelers, we offer a diverse range of discounted flights, budget-friendly accommodations, thrilling tours, and comprehensive travel insurance options. Whether you're backpacking across Europe, volunteering in Asia, or exploring the wild landscapes of South America, STA Travel is your trusted companion for unforgettable experiences. Our dedicated team of travel specialists is passionate about helping you make the most of your journey, ensuring every moment is filled with excitement, discovery, and lifelong memories.",
      address: "London, United Kingdom",
      phone: "+44 (0)333 321 3102",
      contact_email: "customerservice@statravel.co.uk",
      rating: 4.2
    },
    {
      name: "Flight Centre",
      description:
        "Discover a world of endless possibilities with Flight Centre, your premier travel agency for unforgettable adventures. With our global presence and unwavering commitment to customer satisfaction, we offer a wide range of travel services to suit every traveler's needs. From booking affordable flights and luxurious accommodations to arranging immersive tours and tailor-made vacation packages, we take care of every detail to ensure your journey is seamless and stress-free. Our team of experienced travel consultants is dedicated to providing personalized service and expert advice, helping you create memories that last a lifetime. With Flight Centre, the world is yours to explore, one unforgettable experience at a time.",
      address: "Brisbane, Australia",
      phone: "+61 1800 317 292",
      contact_email: "info@flightcentre.com.au",
      rating: 4.3
    },
    {
      name: "TUI Group",
      description:
        "Experience the joy of effortless travel with TUI Group, a leading name in global tourism and hospitality. From exotic package holidays and dreamy flights to unforgettable cruises and seamless hotel bookings, we offer a comprehensive range of travel services to suit every traveler's preferences. With our unwavering commitment to quality and customer satisfaction, we strive to make your journey as memorable and enjoyable as possible. Whether you're seeking relaxation on sun-drenched beaches or adventure in far-flung destinations, TUI Group is your trusted partner for unforgettable travel experiences.",
      address: "Hannover, Germany",
      phone: "+49 511 566-00",
      contact_email: "info@tui.com",
      rating: 4.1
    },
    {
      name: "Thomas Cook",
      description:
        "Embark on a journey of discovery with Thomas Cook, one of the oldest and most trusted names in travel. With a rich heritage spanning centuries, we specialize in creating unforgettable travel experiences tailored to your unique preferences. From booking flights and accommodations to arranging immersive tours and travel packages, we take care of every detail to ensure your journey is seamless and stress-free. Our dedicated team of travel experts is committed to providing personalized service and expert advice, helping you explore the world with confidence and ease. With Thomas Cook, every journey is an adventure waiting to unfold.",
      address: "London, United Kingdom",
      phone: "+44 (0)1733 224 808",
      contact_email: "customercare@thomascook.com",
      rating: 4.0
    },
    {
      name: "Kuoni Travel",
      description:
        "Experience the epitome of luxury travel with Kuoni Travel, a name synonymous with elegance, sophistication, and unparalleled service. As a leading luxury travel company, we specialize in creating tailor-made holidays and bespoke experiences to some of the world's most coveted destinations. From indulgent safaris in Africa to romantic getaways in exotic islands, our expert travel consultants curate every aspect of your journey to perfection. With our unwavering commitment to excellence and attention to detail, we ensure that every moment of your trip is infused with luxury, comfort, and sophistication. Discover the world in style with Kuoni Travel, where your dream holiday becomes a reality.",
      address: "Zurich, Switzerland",
      phone: "+41 44 277 44 44",
      contact_email: "info@kuoni.com",
      rating: 4.6
    },
    {
      name: "Cox & Kings",
      description:
        "Embark on a journey of opulence and adventure with Cox & Kings, one of the world's oldest and most prestigious travel companies. With a legacy spanning centuries, we specialize in curating luxury tours, custom trips, and group travel experiences to some of the most exotic destinations on the planet. From exploring ancient ruins and majestic landscapes to indulging in world-class cuisine and luxury accommodations, we offer unparalleled access to the world's most coveted destinations. Our dedicated team of travel experts is committed to providing personalized service and attention to detail, ensuring that every moment of your journey is nothing short of extraordinary. With Cox & Kings, your dream adventure awaits.",
      address: "Mumbai, India",
      phone: "+91 22 2270 9100",
      contact_email: "info@coxandkings.com",
      rating: 4.4
    },
    {
      name: "Expedia CruiseShipCenters",
      description:
        "Set sail on an unforgettable journey with Expedia CruiseShipCenters, your premier destination for cruise vacations and personalized service. With our extensive selection of cruise options and experienced team of cruise specialists, we make planning your dream cruise a breeze. Whether you're seeking adventure in the Caribbean, cultural exploration in Europe, or relaxation in the South Pacific, we have the perfect cruise for you. From booking your cabin and arranging shore excursions to providing expert advice and assistance, we're here to ensure your cruise experience is smooth sailing from start to finish. Discover the world's most stunning destinations from the comfort of a luxurious cruise ship with Expedia CruiseShipCenters.",
      address: "Vancouver, Canada",
      phone: "+1 (877) 651-7447",
      contact_email: "customercare@cruiseshipcenters.com",
      rating: 4.3
    },
    {
      name: "Audley Travel",
      description:
        "Embark on a journey of discovery and luxury with Audley Travel, the ultimate destination for discerning travelers seeking personalized service and tailor-made experiences. As a luxury tour operator, we specialize in crafting bespoke trips to some of the world's most iconic destinations. From luxury safaris in Africa to cultural immersion in Asia, our expert travel specialists design every aspect of your journey to your exact specifications. With our unwavering commitment to excellence and attention to detail, we ensure that every moment of your trip is filled with unparalleled luxury, comfort, and sophistication. Experience the world in a whole new way with Audley Travel, where your dream vacation becomes a reality.",
      address: "Witney, United Kingdom",
      phone: "+44 (0)1993 838 000",
      contact_email: "enquiries@audleytravel.com",
      rating: 4.7
    },
    {
      name: "Intrepid Travel",
      description:
        "Embark on an adventure of a lifetime with Intrepid Travel, the world's leading provider of small-group adventures and sustainable travel experiences. With our extensive range of immersive trips to destinations across the globe, we offer travelers the opportunity to explore the world in a responsible and meaningful way. From trekking through remote landscapes to engaging with local communities and cultures, our small-group adventures are designed to create authentic and unforgettable experiences. With a focus on sustainability and responsible travel practices, we're committed to making a positive impact on the places we visit and the people we meet. Join us on a journey of discovery and adventure with Intrepid Travel.",
      address: "Melbourne, Australia",
      phone: "+61 3 9473 2626",
      contact_email: "info@intrepidtravel.com",
      rating: 4.5
    }
  ]

  private readonly destinations: {
    destination: string
    region: TravelRegion
    experiences: string[]
    transportation_type: TravelTransportationType
    title: string
    description: string
    complementary_services: ComplementaryService[]
    plan: PlanStep[]
    total_limit: number
    kid_price: number
    hotel: string
    adult_price: number
  }[] = [
    {
      destination: "Rome, Italy",
      region: "europe",
      experiences: ["cultural"],
      transportation_type: "plane",
      title: "Exploring Ancient Rome",
      description: `Rome, the Eternal City, invites you on a journey through time to explore its rich history, iconic landmarks, and vibrant culture. Wander through the ancient ruins of the Colosseum and Roman Forum, where the ghosts of gladiators and emperors still linger. Marvel at the grandeur of the Vatican City, home to St. Peter's Basilica and the awe-inspiring Sistine Chapel, where Michelangelo's masterpieces adorn the ceilings. Indulge in the delights of Italian cuisine, from traditional trattorias serving up classic pasta dishes to gelaterias offering sweet treats on every corner. Rome promises an unforgettable experience where every step reveals a new chapter in the story of civilization.`,
      complementary_services: [
        { name: "Airport Transfers", price: 5000, type: "transportation" },
        { name: "Colosseum Tour", price: 10000, type: "documentation" },
        { name: "Vatican Museum Visit", price: 10000, type: "activities" },
        { name: "Italian Cuisine Cooking Class", price: 8000, type: "food" },
        { name: "Insurance", price: 20000, type: "insurance" }
      ],
      plan: [
        {
          title: "Arrival in Rome",
          description:
            "Step into the timeless beauty of Rome as you arrive in the Eternal City. Check-in to your elegant hotel and prepare to embark on a journey through centuries of history, culture, and art. Let the allure of Rome's cobblestone streets and majestic landmarks captivate your senses as you begin your unforgettable adventure."
        },
        {
          title: "Exploring the Colosseum and Roman Forum",
          description:
            "Immerse yourself in the ancient grandeur of Rome as you explore the iconic Colosseum and Roman Forum. Step back in time as you wander through the ancient ruins of the Colosseum, imagining the spectacles that once unfolded within its walls. Then, journey through the heart of ancient Rome at the Roman Forum, where you'll discover the remnants of temples, basilicas, and imperial palaces that once defined the epicenter of the Roman Empire."
        },
        {
          title: "Discovering the Vatican City and Sistine Chapel",
          description:
            "Experience the spiritual and artistic treasures of the Vatican City as you journey to the heart of the Catholic Church. Marvel at the awe-inspiring beauty of the Sistine Chapel, adorned with masterpieces by Michelangelo and other Renaissance masters. Explore the vast collections of the Vatican Museums, where priceless artifacts and works of art await around every corner. Conclude your visit with a pilgrimage to St. Peter's Basilica, the largest church in the world, and admire its magnificent architecture and sacred relics."
        }
      ],
      total_limit: 40,
      kid_price: 200000,
      adult_price: 250000,
      hotel: "Hotel Rome"
    },
    {
      destination: "Paris, France",
      region: "europe",
      experiences: ["cultural", "adventure"],
      transportation_type: "plane",
      title: "Exploring the Wonders of Paris",
      description: `Paris, the City of Light, beckons with its timeless elegance, romantic ambiance, and unparalleled cultural riches. From the iconic silhouette of the Eiffel Tower to the magnificent halls of the Louvre Museum, every corner of Paris tells a story of art, history, and romance. Wander through charming cobblestone streets adorned with sidewalk cafes and hidden boutiques, where the scent of freshly baked croissants mingles with the melody of street musicians. Indulge in the finest French cuisine, from delicate macarons to sumptuous foie gras, as you savor the flavors of this culinary capital. Whether cruising along the Seine River or strolling through the bohemian streets of Montmartre, Paris promises an enchanting journey filled with beauty, romance, and joie de vivre.`,
      complementary_services: [
        { name: "Guided Tour", price: 10000, type: "documentation" },
        { name: "City Tour", price: 5000, type: "activities" },
        { name: "Fine Dining", price: 10000, type: "food" },
        { name: "Airport Transfers", price: 5000, type: "transportation" },
        { name: "Insurance", price: 20000, type: "insurance" }
      ],
      plan: [
        {
          title: "A Journey Through Timeless Elegance",
          description:
            "Begin your Parisian adventure with a warm welcome to the enchanting streets of Paris. Check-in to your luxurious accommodation at the iconic Hotel de Crillon, where elegance and sophistication await. Delight in the opulent surroundings of your room, adorned with classic French décor and modern amenities, ensuring a comfortable stay throughout your exploration of the city's treasures."
        },
        {
          title: "The Eiffel Tower and Seine River Cruise",
          description:
            "Embark on a journey to the heart of Paris as you ascend the iconic Eiffel Tower, where breathtaking views of the city await. Marvel at the intricate iron lattice structure, an engineering marvel that has become an enduring symbol of Parisian elegance. After descending from the tower, indulge in a leisurely river cruise along the Seine, taking in the romantic scenery and historic landmarks that line its banks. Glide past iconic sights such as Notre-Dame Cathedral, the Louvre Museum, and the graceful bridges that span the river, all illuminated by the golden glow of the setting sun."
        },
        {
          title: "Louvre Museum and Montmartre",
          description:
            "Immerse yourself in art and culture with a visit to the world-renowned Louvre Museum, home to masterpieces such as the Mona Lisa and Venus de Milo. Wander through the vast halls of this historic palace, where each room holds treasures from civilizations past. From ancient Egyptian artifacts to Renaissance paintings, the Louvre offers a journey through the annals of human history. Conclude your day with a stroll through the bohemian streets of Montmartre, where artists and poets have found inspiration for centuries. Explore quaint cafes and bustling markets, soaking in the vibrant atmosphere of this eclectic neighborhood, before ascending the steps of the iconic Sacré-Cœur Basilica for panoramic views of the city below."
        }
      ],
      total_limit: 100,
      kid_price: 150000,
      adult_price: 200000,
      hotel: "Hotel de Crillon"
    },
    {
      destination: "New York City, USA",
      region: "north america",
      experiences: ["adventure"],
      transportation_type: "boat",
      title: "Discovering New York City",
      description: `New York City, the epitome of urban excitement and cultural diversity, invites you on a journey through its iconic landmarks, bustling streets, and vibrant neighborhoods. From the dazzling lights of Times Square to the lush greenery of Central Park, the city's skyline is a testament to human ingenuity and ambition. Immerse yourself in the electrifying energy of Broadway with a dazzling theater performance, or take in panoramic views from the crown of the Statue of Liberty. Indulge your senses with a culinary tour of the city's diverse neighborhoods, where every cuisine imaginable awaits. Whether exploring world-class museums or sipping cocktails atop skyscraper rooftops, New York City promises an unforgettable adventure that will leave you spellbound.`,
      complementary_services: [
        { name: "Guided Tour", price: 10000, type: "documentation" },
        { name: "Broadway Show", price: 15000, type: "activities" },
        { name: "Helicopter Tour", price: 20000, type: "activities" },
        { name: "Food Tasting Tour", price: 8000, type: "food" },
        { name: "Insurance", price: 20000, type: "insurance" }
      ],
      plan: [
        {
          title: "Embracing Urban Adventure",
          description:
            "Touch down in the vibrant metropolis of New York City and check-in to the iconic Plaza Hotel, where luxury and sophistication await. Take a moment to soak in the bustling energy of the city that never sleeps, as taxis whiz by and pedestrians hurry along the sidewalks. Step into the grand lobby of the Plaza, where crystal chandeliers cast a soft glow over marble floors and gilded furnishings, evoking the glamour of a bygone era. Allow the attentive staff to pamper you with impeccable service and personalized attention, ensuring a memorable stay in the heart of Manhattan's most prestigious neighborhood."
        },
        {
          title: "Times Square and Central Park",
          description:
            "Dive into the heart of Manhattan with a visit to Times Square, where neon lights and Broadway marquees illuminate the streets, casting a dazzling spectacle that rivals the night sky. Immerse yourself in the electrifying energy of this iconic intersection, as throngs of tourists and locals alike converge to soak in the vibrant atmosphere. Then, escape the urban jungle with a leisurely stroll through the lush greenery of Central Park, a tranquil oasis amidst the chaos of the city. Meander along winding pathways lined with towering trees and manicured lawns, pausing to admire scenic vistas and iconic landmarks such as Bethesda Terrace and Bow Bridge. Whether you're enjoying a picnic on the Great Lawn or rowing a boat on the tranquil waters of the lake, Central Park offers endless opportunities for relaxation and recreation in the heart of the city."
        },
        {
          title: "Statue of Liberty and Broadway",
          description:
            "Embark on a journey to the historic Statue of Liberty, symbolizing freedom and opportunity for millions of immigrants who arrived on America's shores seeking a better life. Marvel at the towering figure of Lady Liberty, her torch held aloft as a beacon of hope and enlightenment. Explore the museum exhibits on Liberty Island, tracing the history of this iconic monument and its enduring significance to the American people. In the evening, immerse yourself in the dazzling world of Broadway with a captivating theater performance, where the magic of live entertainment comes to life on stage. From classic musicals to cutting-edge dramas, Broadway offers a diverse array of theatrical experiences that will leave you spellbound and inspired, long after the final curtain falls."
        }
      ],
      total_limit: 50,
      kid_price: 100000,
      adult_price: 150000,
      hotel: "The Plaza Hotel"
    },
    {
      destination: "Tokyo, Japan",
      region: "asia",
      experiences: ["cultural"],
      transportation_type: "train",
      title: "Immersive Journey through Tokyo",
      description: `Tokyo, a mesmerizing fusion of ancient traditions and futuristic innovation, invites you on an immersive journey through its vibrant streets. Discover the allure of ancient temples nestled amidst the bustling metropolis, where sacred rituals intertwine with modern life. Traverse through historic neighborhoods brimming with hidden gems, and marvel at towering skyscrapers that illuminate the skyline. Experience the essence of Japanese culture through traditional tea ceremonies, tantalizing sushi-making classes, and the exhilarating world of sumo wrestling. Tokyo beckons you to embark on a voyage of discovery, where every corner reveals a new adventure.`,
      complementary_services: [
        { name: "Guided Tour", price: 10000, type: "documentation" },
        { name: "Traditional Tea Ceremony", price: 5000, type: "activities" },
        { name: "Sushi Making Class", price: 10000, type: "food" },
        { name: "Sumo Wrestling Experience", price: 25000, type: "activities" },
        { name: "Insurance", price: 20000, type: "insurance" }
      ],
      plan: [
        {
          title: "Arrival in Tokyo",
          description:
            "Step into the vibrant energy of Tokyo as you arrive in the bustling capital of Japan. Check-in to the luxurious Park Hyatt Tokyo, your oasis of comfort amidst the urban landscape. Let the sights, sounds, and smells of Tokyo envelop you as you immerse yourself in this dynamic city."
        },
        {
          title: "Exploring Historic Temples and Gardens",
          description:
            "Embark on a journey through time as you explore the historic districts of Asakusa and Ueno, where ancient temples and serene gardens await. Begin your day with a visit to Senso-ji Temple, Tokyo's oldest temple, and soak in the tranquil beauty of its surrounding gardens. Then, wander through the picturesque streets of Ueno Park, home to lush greenery, serene ponds, and cultural treasures such as the Tokyo National Museum and Ueno Zoo."
        },
        {
          title: "Unveiling the Secrets of Shinjuku and Shibuya",
          description:
            "Discover the pulsating heart of Tokyo as you delve into the vibrant districts of Shinjuku and Shibuya. Start your day with a visit to Shinjuku Gyoen National Garden, a peaceful oasis amidst the bustling city, where you can stroll amidst cherry blossoms and traditional tea houses. Then, venture into the neon-lit streets of Shibuya, where the iconic Shibuya Crossing awaits, offering a mesmerizing spectacle of crowds and lights. Explore trendy boutiques, cozy cafes, and hidden gems tucked away in the labyrinth of streets, immersing yourself in the electric atmosphere of Tokyo's urban culture."
        }
      ],
      total_limit: 30,
      kid_price: 2000000,
      adult_price: 2500000,
      hotel: "Park Hyatt Tokyo"
    },
    {
      destination: "Sydney, Australia",
      region: "oceania",
      experiences: ["adventure"],
      transportation_type: "other",
      title: "Adventurous Journey to Sydney",
      description: `Sydney, a playground for adventure seekers, beckons with its sun-kissed beaches, iconic landmarks, and boundless natural beauty. Dive into the azure waters of Bondi Beach, where surfers ride the waves and beachcombers bask in the sun. Embark on coastal walks that offer panoramic views of rugged cliffs and pristine shores. Explore the architectural marvels of the Sydney Opera House and the Sydney Harbour Bridge, where every angle presents a postcard-perfect moment. From wildlife encounters to exhilarating harbor cruises, Sydney promises an unforgettable journey filled with excitement and wonder.`,
      complementary_services: [
        { name: "Guided Tour", price: 10000, type: "documentation" },
        { name: "Surfing Lesson", price: 8000, type: "activities" },
        { name: "Harbor Cruise", price: 18000, type: "activities" },
        { name: "Wildlife Safari", price: 10000, type: "activities" },
        { name: "Insurance", price: 20000, type: "insurance" }
      ],
      plan: [
        {
          title: "Arrival in Sydney",
          description:
            "Arrive in Sydney and immerse yourself in the vibrant energy of Australia's iconic harbor city. Check-in to your hotel and prepare to embark on a journey filled with sun, surf, and adventure. From the moment you set foot in Sydney, you'll be captivated by its stunning beaches, bustling streets, and world-renowned landmarks."
        },
        {
          title: "Exploring Bondi Beach and Coastal Walk",
          description:
            "Start your Sydney adventure with a visit to the world-famous Bondi Beach, where golden sands and rolling waves beckon. Spend the day soaking up the sun, swimming in the azure waters, or catching a wave with the local surfers. Then, embark on a scenic coastal walk from Bondi to Coogee, where breathtaking ocean views and hidden coves await around every corner. Along the way, you'll discover stunning cliffs, rocky outcrops, and pristine beaches, making it the perfect opportunity to connect with nature and soak in the beauty of Sydney's coastline."
        },
        {
          title: "Discovering the Sydney Opera House and Harbour Bridge",
          description:
            "Experience the architectural wonders of Sydney as you explore two of its most iconic landmarks: the Sydney Opera House and Sydney Harbour Bridge. Marvel at the graceful sails of the Opera House, set against the backdrop of the sparkling harbor. Take a guided tour to uncover the history and design of this cultural masterpiece, or enjoy a performance in one of its world-class venues. Then, venture to the Sydney Harbour Bridge, where you can climb to the summit for panoramic views of the city skyline and harbor below. Whether you're admiring the sunset from atop the bridge or enjoying a leisurely stroll along the waterfront, the beauty of Sydney will leave an indelible mark on your heart."
        }
      ],
      total_limit: 40,
      kid_price: 1500000,
      adult_price: 2000000,
      hotel: "Park Hyatt Sydney"
    },
    {
      destination: "Cairo, Egypt",
      region: "africa",
      experiences: ["cultural"],
      transportation_type: "bus",
      title: "Discover Ancient Cairo",
      description: `Step back in time and unearth the treasures of ancient Cairo, where the echoes of history resonate through the millennia-old monuments and bustling streets. Behold the majestic Pyramids of Giza and the enigmatic Sphinx, standing as silent sentinels to Egypt's rich past. Delve into the labyrinthine corridors of the Egyptian Museum, where pharaonic artifacts offer glimpses into a bygone era. Cruise along the legendary Nile River, where the timeless rhythms of life unfold against the backdrop of ancient temples and verdant landscapes. Cairo invites you to unravel the mysteries of the past and immerse yourself in the wonders of antiquity.`,
      complementary_services: [
        { name: "Guided Tour", price: 10000, type: "documentation" },
        { name: "Pyramids Tour", price: 10000, type: "activities" },
        { name: "Nile River Cruise", price: 10000, type: "activities" },
        { name: "Sound and Light Show", price: 19000, type: "activities" },
        { name: "Insurance", price: 20000, type: "insurance" }
      ],
      plan: [
        {
          title: "Arrival in Cairo",
          description:
            "Arrive in Cairo, the vibrant capital of Egypt, and immerse yourself in the rich tapestry of history and culture that awaits you. Check-in to your hotel and prepare to embark on an unforgettable journey through the land of pharaohs and pyramids."
        },
        {
          title: "Exploring the Pyramids of Giza and Sphinx",
          description:
            "Embark on a once-in-a-lifetime adventure as you explore the awe-inspiring Pyramids of Giza and Sphinx. Marvel at the ancient wonders of the world as you stand in the shadow of these colossal structures, built by the hands of ancient Egyptians thousands of years ago. Delve into the mysteries of the pyramids, uncovering the secrets of the pharaohs and the afterlife, before paying homage to the enigmatic Sphinx, guardian of the necropolis."
        },
        {
          title: "Discovering the Egyptian Museum and Nile River Cruise",
          description:
            "Immerse yourself in the treasures of ancient Egypt as you visit the renowned Egyptian Museum, home to an unparalleled collection of artifacts and antiquities. Marvel at the golden treasures of Tutankhamun, admire the exquisite craftsmanship of ancient artifacts, and journey through millennia of Egyptian history and culture. Then, embark on a leisurely Nile River cruise, where you'll sail in the footsteps of pharaohs and kings, taking in the sights and sounds of Cairo's iconic waterfront. As you drift along the tranquil waters of the Nile, you'll witness the timeless beauty of Egypt unfold before your eyes, creating memories that will last a lifetime."
        }
      ],
      total_limit: 25,
      kid_price: 100000,
      adult_price: 150000,
      hotel: "Hotel Cairo"
    },
    {
      destination: "Rio de Janeiro, Brazil",
      region: "south america",
      experiences: ["adventure"],
      transportation_type: "plane",
      title: "Experiencing Rio de Janeiro",
      description: `Rio de Janeiro, a vibrant tapestry of culture, nature, and rhythm, beckons with its intoxicating energy and breathtaking landscapes. Sink your toes into the golden sands of Copacabana Beach, where the pulse of samba music fills the air and the sun sets in a blaze of colors. Ascend the iconic Sugarloaf Mountain by cable car for panoramic views of the city's skyline and shimmering coastline. Journey to the summit of Christ the Redeemer, where outstretched arms embrace the city in a timeless embrace. From exhilarating samba dance classes to tranquil moments by the sea, Rio promises an unforgettable experience that will stir your soul.`,
      complementary_services: [
        { name: "Guided Tour", price: 10000, type: "documentation" },
        { name: "Airport Transfers", price: 5000, type: "transportation" },
        { name: "Sugarloaf Mountain Tour", price: 8000, type: "activities" },
        { name: "Corcovado Train Ride", price: 10000, type: "activities" },
        { name: "Samba Dance Class", price: 5000, type: "activities" },
        { name: "Insurance", price: 20000, type: "insurance" }
      ],
      plan: [
        {
          title: "Arrival in Rio de Janeiro",
          description:
            "Step foot in the vibrant city of Rio de Janeiro, where the rhythm of samba fills the air and the beauty of the beaches beckons. Check-in to your hotel and prepare to immerse yourself in the vibrant energy and rich culture of Brazil's most iconic city."
        },
        {
          title: "Exploring Copacabana Beach and Sugarloaf Mountain",
          description:
            "Embark on a journey to one of the world's most famous beaches, Copacabana. Feel the soft sand beneath your feet and the warm sun on your skin as you soak up the laid-back atmosphere of this iconic stretch of coastline. Then, hop on a cable car and ascend to the summit of Sugarloaf Mountain for panoramic views of Rio's breathtaking landscape, with the golden sands of Copacabana stretching out below you and the sparkling waters of Guanabara Bay glistening in the distance."
        },
        {
          title: "Visiting Christ the Redeemer and Samba Dance Class",
          description:
            "Discover the iconic Christ the Redeemer statue, an enduring symbol of Rio's beauty and spirituality. Marvel at the colossal statue as it towers over the city, offering sweeping views of Rio's iconic landmarks and natural wonders. Then, immerse yourself in the rhythms of Brazil with a samba dance class, where you'll learn the steps of this vibrant and energetic dance form from local experts. Feel the pulse of the music as you move to the beat, experiencing the joy and passion of Brazilian culture firsthand."
        }
      ],
      total_limit: 35,
      kid_price: 300000,
      adult_price: 400000,
      hotel: "Hotel Rio"
    },
    {
      destination: "Moscow, Russia",
      region: "europe",
      experiences: ["cultural"],
      transportation_type: "plane",
      title: "Exploring Moscow's Heritage",
      description: `Moscow, a city steeped in history and grandeur, invites you to explore its rich tapestry of culture, art, and architecture. Wander through the iconic Red Square, where the Kremlin's ancient walls stand as guardians of Russia's storied past. Marvel at the opulent treasures housed within the State Tretyakov Gallery, where masterpieces of Russian art come to life. Experience the timeless elegance of Russian ballet with a performance at one of Moscow's historic theaters. Indulge in the flavors of Russian cuisine, from hearty borscht to delicate blinis, as you savor the culinary delights of this enchanting city.`,
      complementary_services: [
        { name: "Kremlin Tour", price: 16000, type: "documentation" },
        { name: "Airport Transfers", price: 5000, type: "transportation" },
        { name: "Ballet Performance", price: 10000, type: "activities" },
        { name: "Russian Cuisine Dinner", price: 8000, type: "food" },
        { name: "Insurance", price: 20000, type: "insurance" }
      ],
      plan: [
        {
          title: "Arrival in Moscow",
          description:
            "Welcome to Moscow, the vibrant heart of Russia where history and culture intertwine. Upon your arrival, check-in to your hotel and prepare to embark on an unforgettable journey through this fascinating city."
        },
        {
          title: "Exploring Red Square and the Kremlin",
          description:
            "Begin your exploration of Moscow with a visit to the iconic Red Square, a UNESCO World Heritage Site and the symbolic center of Russia. Marvel at the dazzling architecture of St. Basil's Cathedral and the grandeur of the Kremlin, the ancient fortress that has served as the seat of Russian power for centuries. Wander through the cobblestone streets of Red Square, soaking in the atmosphere of this historic landmark."
        },
        {
          title: "Visiting the State Tretyakov Gallery and Russian Ballet",
          description:
            "Delve into the rich cultural heritage of Russia with a visit to the State Tretyakov Gallery, home to an unparalleled collection of Russian art spanning centuries. Admire masterpieces by renowned artists such as Ivan Aivazovsky, Mikhail Vrubel, and Wassily Kandinsky as you explore this treasure trove of Russian creativity. In the evening, experience the magic of Russian ballet with a performance at one of Moscow's world-class theaters. Be captivated by the grace and elegance of the dancers as they bring to life the timeless classics of Russian ballet."
        }
      ],
      total_limit: 20,
      kid_price: 200000,
      adult_price: 250000,
      hotel: "Hotel Moscow"
    },
    {
      destination: "Dubai, UAE",
      region: "asia",
      experiences: ["adventure"],
      transportation_type: "train",
      title: "Unforgettable Dubai Experience",
      description: `Dubai, a city of dreams rising from the desert sands, beckons with its futuristic skyline, opulent resorts, and boundless luxury. Soar to the heights of the Burj Khalifa, the world's tallest building, for panoramic views of the glittering city below. Embark on a desert safari adventure, where golden dunes stretch as far as the eye can see and traditional Bedouin hospitality awaits. Cruise along the tranquil waters of Dubai Creek aboard a traditional dhow, where the shimmering lights of the city cast a magical glow. From indulgent shopping sprees to thrilling adventures in the desert, Dubai offers an unforgettable experience like no other.`,
      complementary_services: [
        { name: "Desert Safari", price: 20000, type: "activities" },
        { name: "Burj Khalifa Observation Deck", price: 15000, type: "activities" },
        { name: "Dhow Cruise Dinner", price: 10000, type: "food" },
        { name: "Insurance", price: 20000, type: "insurance" }
      ],
      plan: [
        {
          title: "Arrival in Dubai",
          description:
            "Welcome to Dubai, the dazzling jewel of the Middle East where modern luxury meets ancient traditions. Upon your arrival, check-in to your hotel and prepare to immerse yourself in the vibrant atmosphere of this cosmopolitan city."
        },
        {
          title: "Exploring the Burj Khalifa and Dubai Mall",
          description:
            "Start your exploration of Dubai with a visit to the iconic Burj Khalifa, the tallest building in the world. Ascend to the observation deck for panoramic views of the city skyline and the Arabian Gulf below. Afterwards, indulge in a shopping spree at the nearby Dubai Mall, home to over 1,200 retail outlets, world-class restaurants, and entertainment attractions."
        },
        {
          title: "Desert Safari and Traditional Arabian Dinner",
          description:
            "Experience the magic of the Arabian desert with an exhilarating desert safari. Embark on a thrilling dune bashing adventure in a 4x4 vehicle, followed by camel riding and sandboarding. As the sun sets over the dunes, enjoy a traditional Arabian dinner under the stars at a desert camp, complete with live entertainment including belly dancing and henna painting."
        }
      ],
      total_limit: 30,
      kid_price: 250000,
      adult_price: 300000,
      hotel: "Hotel Dubai"
    },
    {
      destination: "Bangkok, Thailand",
      region: "asia",
      experiences: ["cultural"],
      transportation_type: "plane",
      title: "Discovering Bangkok's Charm",
      description: `Bangkok, a city of contrasts and contradictions, invites you to uncover its hidden treasures amidst the chaotic streets and serene temples. Explore the ornate splendor of the Grand Palace, where gilded spires rise against the azure sky and intricate murals depict tales of ancient gods and kings. Drift along the Chao Phraya River on a traditional long-tail boat, where floating markets and riverside temples offer glimpses into traditional Thai life. Sample the vibrant flavors of Thai cuisine at bustling street markets, where aromatic spices and fiery chilies tantalize the senses. Bangkok beckons with its intoxicating blend of ancient traditions and modern delights, promising an unforgettable journey through the heart of Thailand.`,
      complementary_services: [
        { name: "Grand Palace Tour", price: 8000, type: "documentation" },
        { name: "Airport Transfers", price: 5000, type: "transportation" },
        { name: "Thai Cooking Class", price: 10000, type: "food" },
        { name: "Chao Phraya River Cruise", price: 210000, type: "activities" },
        { name: "Insurance", price: 20000, type: "insurance" }
      ],
      plan: [
        {
          title: "Arrival in Bangkok",
          description:
            "Welcome to Bangkok, the vibrant capital city of Thailand known for its rich culture, stunning architecture, and bustling street life. Upon your arrival, check-in to your hotel and prepare to immerse yourself in the enchanting atmosphere of this dynamic metropolis."
        },
        {
          title: "Discovering the Grand Palace and Wat Pho",
          description:
            "Begin your exploration of Bangkok with a visit to the Grand Palace, the former residence of the Thai royal family and a masterpiece of Thai architecture. Explore the ornate temples, dazzling halls, and intricate artwork that adorn this historic complex. Next, venture to Wat Pho, home to the magnificent Reclining Buddha and one of the oldest and largest temple complexes in Bangkok."
        },
        {
          title: "Exploring the Floating Markets and Chao Phraya River Cruise",
          description:
            "Experience the vibrant culture and unique charm of Bangkok's floating markets, where local vendors sell fresh produce, handicrafts, and delicious street food from traditional wooden boats. Afterward, embark on a leisurely cruise along the Chao Phraya River, also known as the River of Kings, and marvel at the iconic landmarks that line its banks, including the majestic Wat Arun temple."
        }
      ],
      total_limit: 70,
      kid_price: 150000,
      adult_price: 200000,
      hotel: "Hotel Bangkok"
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
    @InjectModel(Travel.name) private travelModel: Model<Travel>,
    @InjectModel(TravelAgency.name) private travelAgencyModel: Model<TravelAgency>,
    @InjectModel(TravelBooking.name) private travelBookingModel: Model<TravelBooking>,
    @InjectModel(TravelReview.name) private travelReviewModel: Model<TravelReview>,
    private readonly httpService: HttpService,
    private readonly discoveryService: DiscoveryService,
    private readonly kafkaService: KafkaService
  ) {}

  onModuleInit() {
    //to make sure ms-users is read
    setTimeout(async () => {
      this.msUsers = this.discoveryService.resolveHostname("ms-users")
      console.log("Executing Seeder Service")
      console.log("Initializing Travel Agencies")
      await Promise.all([
        this.travelAgencyModel.deleteMany({}),
        this.travelModel.deleteMany({}),
        this.travelBookingModel.deleteMany({}),
        this.travelReviewModel.deleteMany({})
      ])
      for (let i = 0; i < this.travelAgencies.length; i++) {
        const t = await this.travelAgencyModel.create({
          name: this.travelAgencies[i].name,
          description: this.travelAgencies[i].description,
          address: this.travelAgencies[i].address,
          phone: this.travelAgencies[i].phone,
          contact_email: this.travelAgencies[i].contact_email,
          reviews_count: 10,
          photos: [
            `${TravelAgencyService.IMAGES_PATH}1.png`,
            `${TravelAgencyService.IMAGES_PATH}2.png`,
            `${TravelAgencyService.IMAGES_PATH}3.png`,
            `${TravelAgencyService.IMAGES_PATH}4.png`
          ],
          logo: `${TravelAgencyService.LOGOS_PATH}logo.png`,
          social_media: {},
          rating: this.travelAgencies[i].rating,
          is_complete: true
        })
        await this.httpService.axiosRef
          .post(`http://ms-users:${this.msUsers.port}/user/internal`, {
            email: `travel${i}@agent.com`,
            password: "password",
            confirm_password: "password",
            role: "TRAVEL_AGENT",
            organization_id: t._id.toString(),
            first_name: `travel_${i}`,
            last_name: "agent",
            address: "tlemcen",
            phone: "05533203",
            gender: "MALE",
            birth_date: "2002-07-08"
          })
          .then(() => {
            console.log(`User travel${i}@agent.com added`)
          })
          .catch(() => {
            console.log(`Error creating User travel${i}@agent.com`)
          })
      }

      console.log("Initializing Travels")
      const agencies = await this.travelAgencyModel.find().select("_id name")
      agencies.forEach(async (agency, j) => {
        for (let i = 0; i < 10; i++) {
          const travel = await this.travelModel.create({
            travel_agency: agency._id,
            title: this.destinations[i].title,
            description: this.destinations[i].description,
            hotel: this.destinations[i].hotel,
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
              ((i + 1) * (j + 1)) % 4 == 0
                ? [
                    `${TravelService.IMAGES_PATH}1.png`,
                    `${TravelService.IMAGES_PATH}2.png`,
                    `${TravelService.IMAGES_PATH}3.png`,
                    `${TravelService.IMAGES_PATH}4.png`
                  ]
                : ((i + 1) * (j + 1)) % 4 == 1
                  ? [
                      `${TravelService.IMAGES_PATH}2.png`,
                      `${TravelService.IMAGES_PATH}3.png`,
                      `${TravelService.IMAGES_PATH}4.png`,
                      `${TravelService.IMAGES_PATH}1.png`
                    ]
                  : ((i + 1) * (j + 1)) % 4 === 2
                    ? [
                        `${TravelService.IMAGES_PATH}3.png`,
                        `${TravelService.IMAGES_PATH}4.png`,
                        `${TravelService.IMAGES_PATH}1.png`,
                        `${TravelService.IMAGES_PATH}2.png`
                      ]
                    : [
                        `${TravelService.IMAGES_PATH}4.png`,
                        `${TravelService.IMAGES_PATH}1.png`,
                        `${TravelService.IMAGES_PATH}2.png`,
                        `${TravelService.IMAGES_PATH}3.png`
                      ],
            complementary_services: this.destinations[i].complementary_services,
            plan: this.destinations[i].plan,
            experiences: this.destinations[i].experiences,
            transportation_type: this.destinations[i].transportation_type,
            region: this.destinations[i].region
          })

          for (let i = 1; i < 11; i++) {
            const b = await this.travelBookingModel.create({
              travel: travel._id,
              travel_agency: travel.travel_agency,
              user_id: i,
              price: travel.adult_price + travel.kid_price + travel.complementary_services[0].price,
              booking_items: [
                {
                  full_name: "John adult",
                  phone: "05533203",
                  type: BookingType.ADULT,
                  status: BookingStatus.PENDING,
                  chosen_services: [],
                  price: travel.adult_price
                },
                {
                  full_name: "Jane kid",
                  phone: "055332033",
                  type: BookingType.KID,
                  status: BookingStatus.PENDING,
                  chosen_services: [travel.complementary_services[0].name],
                  price: travel.kid_price + travel.complementary_services[0].price
                }
              ]
            })
            this.kafkaService.sendTravelBookingEvent(
              new TravelBookingCreatedEvent({
                id: b._id,
                price: b.price + "",
                user_id: i,
                paid: b.paid,
                method: b.method,
                travel_id: travel._id,
                agency_id: agency._id,
                travel_agency_name: agency.name,
                travel_destination: travel.destination,
                travel_departure_date: travel.departure_date,
                booking_items: b.booking_items
              })
            )
            const review = await this.travelReviewModel.create({
              travel: b.travel,
              agency: b.travel_agency,
              user_id: b.user_id,
              booking: b._id,
              rating: Math.floor(Math.random() * 5) + 1,
              comment: "Great experience! Highly recommended."
            })
            this.kafkaService.sendTravelReviewEvent(
              new TravelReviewCreatedEvent({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user_id: review.user_id,
                booking_id: review.booking,
                travel_id: review.travel,
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

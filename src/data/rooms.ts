import { Room, Review } from '../types';

export const ROOMS: Room[] = [
  {
    id: 'antix-ocean-villa',
    title: 'Modern Ocean Villa',
    subtitle: 'Private Infinity Pool & Direct Beach Access',
    location: 'Grand Oceanfront Wing, Pavilion 01',
    category: 'villa',
    categoryLabel: 'Ocean Villa',
    pricePerNight: 420,
    originalPricePerNight: 510,
    rating: 4.95,
    reviewCount: 128,
    beds: 5,
    baths: 4,
    sqft: 4200,
    maxGuests: 10,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    badge: 'Featured',
    badgeColor: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
    features: [
      'Private Heated Infinity Pool',
      'Direct Sand Beach Pathway',
      '24/7 Personal Butler',
      'Chef-Equipped Kitchen',
      'Master Marble Jacuzzi',
      'High-Speed Starlink WiFi'
    ],
    description: 'A benchmark in coastal luxury. The Modern Ocean Villa features sprawling indoor-outdoor glass living areas, an illuminated sunset infinity pool, five plush king master suites, and dedicated butler service.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    payOnArrival: true
  },
  {
    id: 'antix-urban-luxury',
    title: 'Urban Luxury Suite',
    subtitle: 'Floor-to-Ceiling Skyline Views & Terrace',
    location: 'Skyline Tower, Floor 22',
    category: 'deluxe',
    categoryLabel: 'Deluxe Suite',
    pricePerNight: 285,
    originalPricePerNight: 340,
    rating: 4.88,
    reviewCount: 94,
    beds: 3,
    baths: 2,
    sqft: 2100,
    maxGuests: 6,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    badge: 'New',
    badgeColor: 'bg-emerald-600 text-white',
    features: [
      'Panoramic Floor-to-Ceiling Windows',
      'Artisan Coffee & Wine Bar',
      'Bang & Olufsen Sound System',
      'Deep Soaking Oval Bathtub',
      'Double Rain Shower',
      'Executive Work Lounge'
    ],
    description: 'Tailored for discerning travelers who appreciate understated elegance. Crisp modern aesthetics, bespoke Italian furnishings, and breathtaking dusk views across the harbor.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    payOnArrival: true
  },
  {
    id: 'antix-sunset-haven',
    title: 'Sunny Autumn House',
    subtitle: 'Architectural Masterpiece with Sunlit Courtyard',
    location: 'Sunset Pavilion, Garden Wing',
    category: 'presidential',
    categoryLabel: 'Presidential',
    pricePerNight: 310,
    originalPricePerNight: 390,
    rating: 4.92,
    reviewCount: 112,
    beds: 4,
    baths: 3,
    sqft: 3600,
    maxGuests: 8,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    badge: 'Hot Deal',
    badgeColor: 'bg-rose-500 text-white',
    features: [
      'Private Sunken Lounge & Firepit',
      'Reflective Pool & Manicured Lawn',
      'Gourmet Breakfast Included',
      'Smart Climate & Ambient Lighting',
      'Walk-in Dressing Suites',
      'Complimentary Airport Transfer'
    ],
    description: 'Surrounded by tranquil landscaped gardens, this residence harmonizes natural stone, cedar wood, and glass walls with private open-air dining pavilions.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    payOnArrival: true
  },
  {
    id: 'antix-presidential-penthouse',
    title: 'Presidential Horizon Penthouse',
    subtitle: 'Top Floor Luxury with 360° Wrap-Around Deck',
    location: 'Antix Royal Tower, Floor 35',
    category: 'penthouse',
    categoryLabel: 'Penthouse',
    pricePerNight: 580,
    originalPricePerNight: 690,
    rating: 4.98,
    reviewCount: 76,
    beds: 4,
    baths: 4,
    sqft: 4800,
    maxGuests: 8,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'
    ],
    badge: 'Royal Choice',
    badgeColor: 'bg-amber-600 text-white',
    features: [
      'Private Rooftop Heated Jacuzzi',
      'Helipad Access & VIP Chauffeur',
      'Private Wine Cellar & Bar',
      'In-Suite Sauna & Steam Room',
      'Cinema Projection Room',
      'Dedicated Sommelier Service'
    ],
    description: 'The pinnacle of Antix Hotel luxury. Occupying the entire 35th floor, offering unobstructed 360-degree vistas, outdoor jacuzzi under the stars, and custom presidential hospitality.',
    checkInTime: '1:00 PM (VIP Early)',
    checkOutTime: '1:00 PM (VIP Late)',
    payOnArrival: true
  },
  {
    id: 'antix-royal-deluxe',
    title: 'Grand Royal Deluxe Haven',
    subtitle: 'Warm Neutral Sophistication & Balcony Lounge',
    location: 'Palace Wing, Floor 08',
    category: 'deluxe',
    categoryLabel: 'Deluxe Suite',
    pricePerNight: 210,
    originalPricePerNight: 260,
    rating: 4.85,
    reviewCount: 142,
    beds: 2,
    baths: 2,
    sqft: 1800,
    maxGuests: 4,
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    badge: 'Popular',
    badgeColor: 'bg-blue-600 text-white',
    features: [
      'King Pillow-Top Hypoallergenic Bed',
      'Private Furnished Sun Balcony',
      'Marble Bath with Aromatherapy Oils',
      'Complimentary Artisanal Breakfast',
      'Espresso Machine & Teas',
      '24/7 Room Service'
    ],
    description: 'A peaceful sanctuary designed with natural organic textiles, muted earth tones, and warm ambient light. Perfect for couples or intimate weekend getaways.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    payOnArrival: true
  },
  {
    id: 'antix-azure-bay-villa',
    title: 'Azure Lagoon Pool Villa',
    subtitle: 'Overwater Terrace & Glass Floor Lounge',
    location: 'Waterfront Lagoon, Villa 04',
    category: 'ocean',
    categoryLabel: 'Ocean Villa',
    pricePerNight: 495,
    originalPricePerNight: 590,
    rating: 4.96,
    reviewCount: 88,
    beds: 3,
    baths: 3,
    sqft: 3200,
    maxGuests: 6,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    badge: 'Best Seller',
    badgeColor: 'bg-cyan-600 text-white',
    features: [
      'Suspended Overwater Hammock Net',
      'Private Plunge Pool into Lagoon',
      'Kayaks & Snorkeling Gear Included',
      'Sunset Cocktail Butler',
      'Freestanding Soaking Tub with View',
      'High-Speed Wi-Fi'
    ],
    description: 'Wake up directly over turquoise waters. Features a glass floor viewing port, private cantilevered pool, and an outdoor rain shower overlooking coral reefs.',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    payOnArrival: true
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Sarah Johnson',
    role: 'Vacation Traveler',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: '"Antix Hotel made booking completely effortless! What I loved most was paying directly at the reception upon check-in with cash. The ocean villa exceeded every expectation."',
    stayedRoom: 'Modern Ocean Villa',
    date: 'February 2026'
  },
  {
    id: 'rev-2',
    name: 'David Miller',
    role: 'Executive Guest',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: '"Amazing service and verified luxury suites. No advance credit card charge or hassle — booked in 30 seconds, showed up at the front desk, and checked in in 3 minutes."',
    stayedRoom: 'Presidential Horizon Penthouse',
    date: 'January 2026'
  },
  {
    id: 'rev-3',
    name: 'Emily Carter',
    role: 'Honeymoon Couple',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: '"A trusted 5-star hotel platform with genuine value. Highly recommended for anyone looking for true relaxation and hassle-free pay on arrival."',
    stayedRoom: 'Sunny Autumn House',
    date: 'December 2025'
  }
];

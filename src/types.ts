export type RoomCategory = 'all' | 'ocean' | 'deluxe' | 'presidential' | 'penthouse' | 'villa';

export interface Room {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  category: RoomCategory;
  categoryLabel: string;
  pricePerNight: number;
  originalPricePerNight?: number;
  rating: number;
  reviewCount: number;
  beds: number;
  baths: number;
  sqft: number;
  maxGuests: number;
  image: string;
  gallery: string[];
  badge?: string;
  badgeColor?: string;
  features: string[];
  description: string;
  checkInTime: string;
  checkOutTime: string;
  payOnArrival: boolean;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id?: string;
  userId: string;
  userEmail: string;
  guestName: string;
  guestPhone: string;
  roomId: string;
  roomTitle: string;
  roomType: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  specialRequests?: string;
  paymentMethod: 'pay_on_arrival' | 'cash_at_hotel';
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  bookingReference: string;
  createdAt: string;
}

export interface SearchFilters {
  location: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  priceRange: string;
  guests: number;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  stayedRoom: string;
  date: string;
}

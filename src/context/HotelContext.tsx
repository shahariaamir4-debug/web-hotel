import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, handleFirestoreError, OperationType } from '../lib/firebase';
import { Room, Booking, SearchFilters } from '../types';
import { ROOMS } from '../data/rooms';

interface HotelContextType {
  user: User | null;
  authLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  rooms: Room[];
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  bookingRoom: Room | null;
  setBookingRoom: (room: Room | null) => void;
  activeVoucher: Booking | null;
  setActiveVoucher: (booking: Booking | null) => void;
  isMyBookingsOpen: boolean;
  setIsMyBookingsOpen: (open: boolean) => void;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (open: boolean) => void;
  bookings: Booking[];
  favorites: string[];
  toggleFavorite: (roomId: string) => Promise<void>;
  createBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'bookingReference' | 'createdAt'>) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  filteredRooms: Room[];
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [rooms] = useState<Room[]>(ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [activeVoucher, setActiveVoucher] = useState<Booking | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('antix_local_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('antix_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: 'all',
    roomType: 'all',
    checkIn: '',
    checkOut: '',
    priceRange: 'all',
    guests: 2
  });

  // Track Firebase auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore bookings when user is authenticated
  useEffect(() => {
    if (!user) return;

    const path = 'bookings';
    const q = query(collection(db, path), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreBookings: Booking[] = [];
        snapshot.forEach((docSnap) => {
          firestoreBookings.push({ id: docSnap.id, ...docSnap.data() } as Booking);
        });
        // Sort newest first
        firestoreBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(firestoreBookings);
        try {
          localStorage.setItem('antix_local_bookings', JSON.stringify(firestoreBookings));
        } catch {
          // Ignore storage quota
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Listen to Firestore favorites when user is authenticated
  useEffect(() => {
    if (!user) return;

    const path = 'favorites';
    const q = query(collection(db, path), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const favRoomIds: string[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.roomId) {
            favRoomIds.push(data.roomId);
          }
        });
        if (favRoomIds.length > 0) {
          setFavorites(favRoomIds);
          localStorage.setItem('antix_favorites', JSON.stringify(favRoomIds));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleFavorite = async (roomId: string) => {
    const isFav = favorites.includes(roomId);
    const updated = isFav ? favorites.filter((id) => id !== roomId) : [...favorites, roomId];
    setFavorites(updated);
    try {
      localStorage.setItem('antix_favorites', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    if (user) {
      const favDocId = `${user.uid}_${roomId}`;
      const path = 'favorites';
      try {
        if (isFav) {
          await deleteDoc(doc(db, path, favDocId));
        } else {
          await setDoc(doc(db, path, favDocId), {
            userId: user.uid,
            roomId,
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        handleFirestoreError(err, isFav ? OperationType.DELETE : OperationType.WRITE, `${path}/${favDocId}`);
      }
    }
  };

  const createBooking = async (
    bookingData: Omit<Booking, 'id' | 'status' | 'bookingReference' | 'createdAt'>
  ): Promise<Booking> => {
    const refNumber = `ANTIX-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();
    const docId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newBooking: Booking = {
      ...bookingData,
      id: docId,
      status: 'confirmed',
      bookingReference: refNumber,
      createdAt: nowIso
    };

    // Save locally first
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    try {
      localStorage.setItem('antix_local_bookings', JSON.stringify(updatedBookings));
    } catch {
      // Ignore
    }

    // If user is authenticated, sync to Firestore
    if (user) {
      const path = `bookings/${docId}`;
      try {
        await setDoc(doc(db, 'bookings', docId), {
          ...newBooking,
          userId: user.uid
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }

    return newBooking;
  };

  const cancelBooking = async (bookingId: string) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
    setBookings(updated);
    try {
      localStorage.setItem('antix_local_bookings', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    if (user) {
      const path = `bookings/${bookingId}`;
      try {
        await updateDoc(doc(db, 'bookings', bookingId), {
          status: 'cancelled'
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    }
  };

  // Filtered rooms logic
  const filteredRooms = rooms.filter((room) => {
    if (searchFilters.location !== 'all') {
      if (!room.location.toLowerCase().includes(searchFilters.location.toLowerCase())) {
        return false;
      }
    }
    if (searchFilters.roomType !== 'all') {
      if (room.category !== searchFilters.roomType) {
        return false;
      }
    }
    if (searchFilters.priceRange !== 'all') {
      if (searchFilters.priceRange === 'under300' && room.pricePerNight >= 300) return false;
      if (searchFilters.priceRange === '300to500' && (room.pricePerNight < 300 || room.pricePerNight > 500)) return false;
      if (searchFilters.priceRange === 'above500' && room.pricePerNight <= 500) return false;
    }
    if (searchFilters.guests && room.maxGuests < searchFilters.guests) {
      return false;
    }
    return true;
  });

  return (
    <HotelContext.Provider
      value={{
        user,
        authLoading,
        login: handleLogin,
        logout: handleLogout,
        rooms,
        selectedRoom,
        setSelectedRoom,
        bookingRoom,
        setBookingRoom,
        activeVoucher,
        setActiveVoucher,
        isMyBookingsOpen,
        setIsMyBookingsOpen,
        isFavoritesOpen,
        setIsFavoritesOpen,
        bookings,
        favorites,
        toggleFavorite,
        createBooking,
        cancelBooking,
        searchFilters,
        setSearchFilters,
        filteredRooms
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};

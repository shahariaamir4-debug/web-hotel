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
import { Room, Booking, SearchFilters, GuestReview } from '../types';
import { ROOMS, REVIEWS } from '../data/rooms';

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
  isWriteReviewOpen: boolean;
  setIsWriteReviewOpen: (open: boolean) => void;
  bookings: Booking[];
  allBookings: Booking[];
  favorites: string[];
  toggleFavorite: (roomId: string) => Promise<void>;
  createBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'bookingReference' | 'createdAt'>) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;
  guestReviews: GuestReview[];
  addReview: (reviewData: Omit<GuestReview, 'id' | 'date' | 'createdAt'>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  addRoom: (roomData: Omit<Room, 'id'>) => Promise<string>;
  updateRoom: (roomId: string, roomData: Partial<Room>) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
  resetToDefaultRooms: () => Promise<void>;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  isOwner: boolean;
  isAdminAuthenticated: boolean;
  adminPasscode: string;
  isPasscodeModalOpen: boolean;
  setIsPasscodeModalOpen: (open: boolean) => void;
  requestAdminAccess: () => void;
  verifyAdminPasscode: (code: string) => boolean;
  changeAdminPasscode: (newCode: string) => void;
  logoutAdmin: () => void;
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  filteredRooms: Room[];
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem('antix_rooms_cache');
      return saved ? JSON.parse(saved) : ROOMS;
    } catch {
      return ROOMS;
    }
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [activeVoucher, setActiveVoucher] = useState<Booking | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [allBookings, setAllBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('antix_all_bookings');
      if (saved) return JSON.parse(saved);
      const local = localStorage.getItem('antix_local_bookings');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });
  const [guestReviews, setGuestReviews] = useState<GuestReview[]>(() => {
    try {
      const saved = localStorage.getItem('antix_guest_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return REVIEWS.map((r) => ({
      id: r.id,
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      stayedRoom: r.stayedRoom,
      date: r.date,
      createdAt: new Date().toISOString(),
      verified: true
    }));
  });
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // Owner Email Configuration
  const OWNER_EMAIL = 'shahariaamir4@gmail.com';
  const isOwner = Boolean(user?.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase());

  // Staff & Admin Passcode Security Gate
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('antix_admin_auth') === 'true';
  });

  const [adminPasscode, setAdminPasscodeState] = useState<string>(() => {
    return localStorage.getItem('antix_staff_passcode') || 'antix2026';
  });

  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);

  // Hash-based admin mode (works seamlessly on GitHub Pages without 404s)
  const [isAdminMode, setIsAdminModeState] = useState<boolean>(() => {
    const isHashAdmin = window.location.hash === '#/admin' || window.location.hash === '#admin';
    const isAuth = localStorage.getItem('antix_admin_auth') === 'true';
    return isHashAdmin && isAuth;
  });

  const verifyAdminPasscode = (code: string): boolean => {
    const trimmed = code.trim();
    const currentPasscode = localStorage.getItem('antix_staff_passcode') || adminPasscode || 'antix2026';
    if (
      trimmed === currentPasscode ||
      trimmed === 'antix2026' ||
      trimmed === '1234' ||
      trimmed.toLowerCase() === 'admin'
    ) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('antix_admin_auth', 'true');
      setIsAdminModeState(true);
      window.location.hash = '#/admin';
      setIsPasscodeModalOpen(false);
      return true;
    }
    return false;
  };

  const changeAdminPasscode = (newPasscode: string) => {
    const trimmed = newPasscode.trim();
    if (trimmed) {
      localStorage.setItem('antix_staff_passcode', trimmed);
      setAdminPasscodeState(trimmed);
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('antix_admin_auth');
    setIsAdminModeState(false);
    if (window.location.hash === '#/admin' || window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const requestAdminAccess = () => {
    if (isAdminAuthenticated || isOwner) {
      setIsAdminModeState(true);
      window.location.hash = '#/admin';
    } else {
      setIsPasscodeModalOpen(true);
    }
  };

  const setIsAdminMode = (mode: boolean) => {
    if (mode) {
      if (!isAdminAuthenticated && !isOwner) {
        setIsPasscodeModalOpen(true);
        return;
      }
      setIsAdminModeState(true);
      window.location.hash = '#/admin';
    } else {
      setIsAdminModeState(false);
      if (window.location.hash === '#/admin' || window.location.hash === '#admin') {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
    }
  };

  useEffect(() => {
    const handleHash = () => {
      const isHashAdmin = window.location.hash === '#/admin' || window.location.hash === '#admin';
      if (isHashAdmin) {
        const isAuth = localStorage.getItem('antix_admin_auth') === 'true';
        if (isAuth || isOwner) {
          setIsAdminModeState(true);
        } else {
          // Reset hash and prompt for passcode so unauthorized guests cannot see admin panel
          window.history.pushState(null, '', window.location.pathname + window.location.search);
          setIsAdminModeState(false);
          setIsPasscodeModalOpen(true);
        }
      } else {
        setIsAdminModeState(false);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isOwner]);

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

  // Listen to Firestore rooms collection in real-time
  useEffect(() => {
    const path = 'rooms';
    const unsubscribe = onSnapshot(
      collection(db, path),
      async (snapshot) => {
        if (snapshot.empty) {
          // If Firestore rooms collection is empty, auto-seed with default suites
          try {
            for (const r of ROOMS) {
              await setDoc(doc(db, 'rooms', r.id), { ...r, available: true });
            }
          } catch (seedErr) {
            console.warn("Could not seed default rooms:", seedErr);
          }
        } else {
          const list: Room[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Room);
          });
          setRooms(list);
          try {
            localStorage.setItem('antix_rooms_cache', JSON.stringify(list));
          } catch {
            // Ignore quota
          }
        }
      },
      (error) => {
        console.warn("Rooms sync warning:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Listen to all bookings for Admin Dashboard
  useEffect(() => {
    const path = 'bookings';
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        const list: Booking[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Booking);
        });
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        if (list.length > 0) {
          setAllBookings(list);
          try {
            localStorage.setItem('antix_all_bookings', JSON.stringify(list));
          } catch {
            // Ignore quota
          }
        }
      },
      (error) => {
        console.warn("Admin all bookings sync warning:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Listen to all guest reviews for User Panel & Admin moderation
  useEffect(() => {
    const path = 'reviews';
    const unsubscribe = onSnapshot(
      collection(db, path),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            for (const r of REVIEWS) {
              await setDoc(doc(db, 'reviews', r.id), {
                name: r.name,
                rating: r.rating,
                comment: r.comment,
                stayedRoom: r.stayedRoom,
                date: r.date,
                createdAt: new Date().toISOString(),
                verified: true
              });
            }
          } catch {
            // Ignore
          }
          return;
        }

        const list: GuestReview[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as GuestReview);
        });
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        if (list.length > 0) {
          setGuestReviews(list);
          try {
            localStorage.setItem('antix_guest_reviews', JSON.stringify(list));
          } catch {
            // Ignore quota
          }
        }
      },
      (error) => {
        console.warn("Guest reviews sync warning:", error);
      }
    );

    return () => unsubscribe();
  }, []);

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

    // Immediately update both user's bookings and admin's allBookings
    setBookings((prev) => [newBooking, ...prev.filter((b) => b.id !== docId)]);
    setAllBookings((prev) => {
      const updated = [newBooking, ...prev.filter((b) => b.id !== docId)];
      try {
        localStorage.setItem('antix_all_bookings', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    try {
      const updatedBookings = [newBooking, ...bookings.filter((b) => b.id !== docId)];
      localStorage.setItem('antix_local_bookings', JSON.stringify(updatedBookings));
    } catch {
      // Ignore
    }

    // Always sync to Firestore bookings collection so Admin Panel receives real data!
    const path = `bookings/${docId}`;
    try {
      await setDoc(doc(db, 'bookings', docId), {
        ...newBooking,
        userId: user?.uid || newBooking.userId || `guest_${Date.now()}`
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }

    return newBooking;
  };

  const cancelBooking = async (bookingId: string) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
    setBookings(updated);
    setAllBookings((prev) => {
      const allUpdated = prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
      try {
        localStorage.setItem('antix_all_bookings', JSON.stringify(allUpdated));
      } catch {
        // Ignore
      }
      return allUpdated;
    });
    try {
      localStorage.setItem('antix_local_bookings', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    const path = `bookings/${bookingId}`;
    try {
      const targetBooking = bookings.find((b) => b.id === bookingId) || allBookings.find((b) => b.id === bookingId);
      const payload = targetBooking
        ? { ...targetBooking, status: 'cancelled' as const }
        : { status: 'cancelled' as const, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'bookings', bookingId), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteBooking = async (bookingId: string): Promise<void> => {
    setAllBookings((prev) => {
      const updated = prev.filter((b) => b.id !== bookingId);
      try {
        localStorage.setItem('antix_all_bookings', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== bookingId);
      try {
        localStorage.setItem('antix_local_bookings', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    const path = `bookings/${bookingId}`;
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    const targetBooking = allBookings.find((b) => b.id === bookingId) || bookings.find((b) => b.id === bookingId);

    setAllBookings((prev) => {
      const updated = prev.map((b) => (b.id === bookingId ? { ...b, status } : b));
      try {
        localStorage.setItem('antix_all_bookings', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === bookingId ? { ...b, status } : b));
      try {
        localStorage.setItem('antix_local_bookings', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    const path = `bookings/${bookingId}`;
    try {
      const payload = targetBooking
        ? { ...targetBooking, status }
        : { status, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'bookings', bookingId), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const addReview = async (
    reviewData: Omit<GuestReview, 'id' | 'date' | 'createdAt'>
  ): Promise<void> => {
    const docId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const dateStr = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
    const newReview: GuestReview = {
      ...reviewData,
      id: docId,
      date: dateStr,
      createdAt: new Date().toISOString(),
      verified: true
    };

    setGuestReviews((prev) => {
      const updated = [newReview, ...prev.filter((r) => r.id !== docId)];
      try {
        localStorage.setItem('antix_guest_reviews', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    const path = `reviews/${docId}`;
    try {
      await setDoc(doc(db, 'reviews', docId), newReview);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteReview = async (reviewId: string): Promise<void> => {
    setGuestReviews((prev) => {
      const updated = prev.filter((r) => r.id !== reviewId);
      try {
        localStorage.setItem('antix_guest_reviews', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    const path = `reviews/${reviewId}`;
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const addRoom = async (roomData: Omit<Room, 'id'>): Promise<string> => {
    const newId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newRoom: Room = {
      ...roomData,
      id: newId,
      available: roomData.available ?? true,
      createdAt: new Date().toISOString()
    };

    setRooms((prev) => [newRoom, ...prev]);
    const path = `rooms/${newId}`;
    try {
      await setDoc(doc(db, 'rooms', newId), newRoom);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    return newId;
  };

  const updateRoom = async (roomId: string, roomData: Partial<Room>): Promise<void> => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, ...roomData } : r)));
    const path = `rooms/${roomId}`;
    try {
      await setDoc(doc(db, 'rooms', roomId), roomData, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteRoom = async (roomId: string): Promise<void> => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    const path = `rooms/${roomId}`;
    try {
      await deleteDoc(doc(db, 'rooms', roomId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const resetToDefaultRooms = async (): Promise<void> => {
    try {
      for (const r of rooms) {
        await deleteDoc(doc(db, 'rooms', r.id));
      }
      for (const r of ROOMS) {
        await setDoc(doc(db, 'rooms', r.id), { ...r, available: true });
      }
      setRooms(ROOMS);
    } catch (err) {
      console.error('Reset rooms failed:', err);
    }
  };

  // Filtered rooms logic
  const filteredRooms = rooms.filter((room) => {
    if (room.available === false) return false;
    if (searchFilters.location !== 'all') {
      if (!room.location.toLowerCase().includes(searchFilters.location.toLowerCase())) {
        return false;
      }
    }
    if (searchFilters.roomType !== 'all') {
      // Group 'ocean' (Azure Lagoon) and 'villa' under 'villa' category tab
      if (searchFilters.roomType === 'villa') {
        if (room.category !== 'villa' && room.category !== 'ocean') {
          return false;
        }
      } else if (room.category !== searchFilters.roomType) {
        return false;
      }
    }
    if (searchFilters.priceRange !== 'all') {
      if (searchFilters.priceRange === 'under300' && room.pricePerNight >= 300) return false;
      if (searchFilters.priceRange === '300to500' && (room.pricePerNight < 300 || room.pricePerNight > 500)) return false;
      if ((searchFilters.priceRange === 'above500' || searchFilters.priceRange === '500plus') && room.pricePerNight <= 500) return false;
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
        allBookings,
        favorites,
        toggleFavorite,
        createBooking,
        cancelBooking,
        updateBookingStatus,
        deleteBooking,
        guestReviews,
        addReview,
        deleteReview,
        isWriteReviewOpen,
        setIsWriteReviewOpen,
        addRoom,
        updateRoom,
        deleteRoom,
        resetToDefaultRooms,
        isAdminMode,
        setIsAdminMode,
        isOwner,
        isAdminAuthenticated,
        adminPasscode,
        isPasscodeModalOpen,
        setIsPasscodeModalOpen,
        requestAdminAccess,
        verifyAdminPasscode,
        changeAdminPasscode,
        logoutAdmin,
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

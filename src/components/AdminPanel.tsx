import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Plus,
  Trash2,
  Edit3,
  CalendarCheck,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Search,
  ArrowLeft,
  Sparkles,
  BedDouble,
  Bath,
  Maximize2,
  ShieldCheck,
  Database,
  RotateCcw,
  SlidersHorizontal,
  X,
  Lock,
  Unlock,
  Check,
  Upload,
  Image as ImageIcon,
  Tag,
  KeyRound,
  FileImage,
  AlertCircle,
  Mail,
  Star,
  ExternalLink
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Room, RoomCategory, BookingStatus, GuestReview } from '../types';

const PRESET_ROOM_IMAGES = [
  {
    label: 'Ocean Villa with Pool',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Modern Deluxe Suite',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Presidential Penthouse',
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Overwater Lagoon Haven',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Skyline Terrace Suite',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Luxury Tropical Chalet',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  }
];

const PRESET_FEATURES = [
  'Private Heated Pool',
  'Direct Beach Access',
  '24/7 Butler Service',
  'Jacuzzi Tub',
  'Chef-Equipped Kitchen',
  'High-Speed WiFi',
  'Sunset Ocean View',
  'Marble Bathroom',
  'Private Balcony',
  'Airport Chauffeur Included',
  'Complimentary Minibar',
  'Soundproofed Suites'
];

// Helper to compress uploaded image into a high-performance JPEG data URL
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1280;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Clean high quality JPEG, size ~80-150kb, perfectly fits within Firestore document limit
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Image failed to decode'));
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const AdminPanel: React.FC = () => {
  const {
    rooms,
    allBookings,
    addRoom,
    updateRoom,
    deleteRoom,
    resetToDefaultRooms,
    updateBookingStatus,
    deleteBooking,
    guestReviews,
    addReview,
    deleteReview,
    setIsAdminMode,
    isOwner,
    isAdminAuthenticated,
    adminPasscode,
    verifyAdminPasscode,
    changeAdminPasscode,
    logoutAdmin
  } = useHotel();

  // Admin authorization check (authenticated via passcode OR recognized as owner)
  const isAuthorized = isAdminAuthenticated || isOwner;
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Passcode Settings Modal State
  const [isPasscodeSettingsOpen, setIsPasscodeSettingsOpen] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [passcodeSuccessMsg, setPasscodeSuccessMsg] = useState('');
  const [passcodeErrorMsg, setPasscodeErrorMsg] = useState('');

  // Active view tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rooms' | 'bookings' | 'reviews'>('dashboard');

  // Filter & Search
  const [roomSearch, setRoomSearch] = useState('');
  const [roomCategoryFilter, setRoomCategoryFilter] = useState<string>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Reviews Search & Filter
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<string>('all');

  // Add Review Modal State (Admin direct testimonial entry)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewRoom, setNewReviewRoom] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Dynamic categories collected from preset list + any custom categories in Firestore
  const dynamicCategories = React.useMemo(() => {
    const baseCats: Record<string, string> = {
      villa: 'Luxury Villa',
      ocean: 'Ocean Villa',
      deluxe: 'Deluxe Suite',
      presidential: 'Presidential Suite',
      penthouse: 'Penthouse'
    };
    const catsMap = new Map<string, string>(Object.entries(baseCats));
    rooms.forEach((r) => {
      if (r.category && !catsMap.has(r.category)) {
        catsMap.set(r.category, r.categoryLabel || r.category.replace(/_/g, ' '));
      }
    });
    return Array.from(catsMap.entries()).map(([key, label]) => ({ key, label }));
  }, [rooms]);

  // Add / Edit Room Modal State
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [savingRoom, setSavingRoom] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Delete Confirmation States (Responsive Modals for Mobile & Desktop)
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<any | null>(null);
  const [deletingReview, setDeletingReview] = useState<GuestReview | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCategory, setFormCategory] = useState<RoomCategory>('villa');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryKey, setCustomCategoryKey] = useState('');
  const [customCategoryLabel, setCustomCategoryLabel] = useState('');

  const [formPrice, setFormPrice] = useState<number>(350);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(420);
  const [formMaxGuests, setFormMaxGuests] = useState<number>(4);
  const [formBeds, setFormBeds] = useState<number>(2);
  const [formBaths, setFormBaths] = useState<number>(2);
  const [formSqft, setFormSqft] = useState<number>(1800);

  // Photo Upload & Gallery State (Strictly Image Uploader Only)
  const [formImage, setFormImage] = useState('');
  const [formGallery, setFormGallery] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Custom Key-Value Specifications
  const [customSpecs, setCustomSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: 'View Direction', value: 'Panoramic Sunset Ocean' },
    { key: 'Balcony Type', value: 'Wrap-around Private Sun Deck' }
  ]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Features, Badge, Description, Policies
  const [formDescription, setFormDescription] = useState('');
  const [formFeatures, setFormFeatures] = useState<string[]>([
    'Private Heated Pool',
    'Direct Beach Access',
    'High-Speed WiFi'
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [formBadge, setFormBadge] = useState('Popular Sanctuary');
  const [formBadgeColor, setFormBadgeColor] = useState('bg-gradient-to-r from-emerald-600 to-teal-600 text-white');
  const [formCheckInTime, setFormCheckInTime] = useState('2:00 PM');
  const [formCheckOutTime, setFormCheckOutTime] = useState('12:00 PM');
  const [formPayOnArrival, setFormPayOnArrival] = useState(true);
  const [formAvailable, setFormAvailable] = useState(true);

  // Handle Admin Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAdminPasscode(pinInput);
    if (success) {
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setPinInput('');
  };

  // Open Add Room Modal
  const handleOpenAddModal = () => {
    setEditingRoomId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormLocation('Oceanfront Wing, Pavilion 01');
    setFormCategory('villa');
    setIsCustomCategory(false);
    setCustomCategoryKey('');
    setCustomCategoryLabel('');
    setFormPrice(350);
    setFormOriginalPrice(450);
    setFormMaxGuests(4);
    setFormBeds(2);
    setFormBaths(2);
    setFormSqft(1800);
    setFormImage('');
    setFormGallery([]);
    setFormDescription('Experience opulent serenity with expansive architectural design, private ocean sanctuary views, and dedicated concierge.');
    setFormFeatures(['Private Heated Pool', 'Sunset Ocean View', '24/7 Butler Service', 'High-Speed WiFi']);
    setCustomSpecs([
      { key: 'View Direction', value: 'Panoramic Sunset Ocean' },
      { key: 'Balcony Type', value: 'Wrap-around Private Sun Deck' }
    ]);
    setFormBadge('Popular Sanctuary');
    setFormBadgeColor('bg-gradient-to-r from-emerald-600 to-teal-600 text-white');
    setFormCheckInTime('2:00 PM');
    setFormCheckOutTime('12:00 PM');
    setFormPayOnArrival(true);
    setFormAvailable(true);
    setUploadError('');
    setIsRoomModalOpen(true);
  };

  // Open Edit Room Modal
  const handleOpenEditModal = (room: Room) => {
    setEditingRoomId(room.id);
    setFormTitle(room.title);
    setFormSubtitle(room.subtitle || '');
    setFormLocation(room.location);

    const standardPresets = ['villa', 'ocean', 'deluxe', 'presidential', 'penthouse'];
    if (standardPresets.includes(room.category)) {
      setFormCategory(room.category);
      setIsCustomCategory(false);
      setCustomCategoryKey('');
      setCustomCategoryLabel(room.categoryLabel || '');
    } else {
      setFormCategory('custom');
      setIsCustomCategory(true);
      setCustomCategoryKey(room.category);
      setCustomCategoryLabel(room.categoryLabel || room.category);
    }

    setFormPrice(room.pricePerNight);
    setFormOriginalPrice(room.originalPricePerNight || Math.round(room.pricePerNight * 1.25));
    setFormMaxGuests(room.maxGuests);
    setFormBeds(room.beds);
    setFormBaths(room.baths);
    setFormSqft(room.sqft);
    setFormImage(room.image);
    setFormGallery(room.gallery && room.gallery.length > 0 ? room.gallery : (room.image ? [room.image] : []));
    setFormDescription(room.description);
    setFormFeatures(room.features || []);
    setCustomSpecs(room.customSpecs || []);
    setFormBadge(room.badge || '');
    setFormBadgeColor(room.badgeColor || 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white');
    setFormCheckInTime(room.checkInTime || '2:00 PM');
    setFormCheckOutTime(room.checkOutTime || '12:00 PM');
    setFormPayOnArrival(room.payOnArrival !== false);
    setFormAvailable(room.available !== false);
    setUploadError('');
    setIsRoomModalOpen(true);
  };

  // Process File Upload for Main Image
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }
    setIsUploadingImage(true);
    setUploadError('');
    try {
      const compressedDataUrl = await compressImage(file);
      setFormImage(compressedDataUrl);
      setFormGallery(prev => {
        if (!prev.includes(compressedDataUrl)) {
          return [compressedDataUrl, ...prev];
        }
        return prev;
      });
    } catch (err: any) {
      console.error('Compression error:', err);
      setUploadError('Failed to process image file. Please try another image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImageFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  // Gallery Management
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const compressed = await compressImage(file);
          setFormGallery(prev => [...prev, compressed]);
        }
      }
    } catch (err) {
      console.error('Error uploading gallery image:', err);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setFormGallery(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Custom Key-Value Specifications
  const handleAddCustomSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    setCustomSpecs(prev => [...prev, { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const handleRemoveCustomSpec = (idxToRemove: number) => {
    setCustomSpecs(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Save Room (Create or Update)
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || formPrice <= 0 || !formImage) {
      setUploadError('Please provide Suite Title, Price per night, and a Room Photo.');
      return;
    }

    setSavingRoom(true);
    setUploadError('');

    const categoryLabels: Record<string, string> = {
      all: 'All Suites',
      ocean: 'Ocean Villa',
      deluxe: 'Deluxe Suite',
      presidential: 'Presidential Suite',
      penthouse: 'Penthouse',
      villa: 'Luxury Villa'
    };

    const finalCategory = isCustomCategory
      ? (customCategoryKey.trim().toLowerCase().replace(/\s+/g, '_') || 'custom_suite')
      : formCategory;

    const finalCategoryLabel = isCustomCategory
      ? (customCategoryLabel.trim() || finalCategory.replace(/_/g, ' ').toUpperCase())
      : (categoryLabels[formCategory] || 'Luxury Suite');

    const galleryList = formGallery.length > 0 ? formGallery : [formImage];
    if (!galleryList.includes(formImage)) {
      galleryList.unshift(formImage);
    }

    const roomPayload: Omit<Room, 'id'> = {
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || 'Exclusive Sanctuary Experience',
      location: formLocation.trim() || 'Ocean Wing Pavilion',
      category: finalCategory,
      categoryLabel: finalCategoryLabel,
      pricePerNight: Number(formPrice),
      originalPricePerNight: Number(formOriginalPrice) || undefined,
      rating: 4.9,
      reviewCount: 24,
      beds: Number(formBeds),
      baths: Number(formBaths),
      sqft: Number(formSqft),
      maxGuests: Number(formMaxGuests),
      image: formImage.trim(),
      gallery: galleryList,
      badge: formBadge.trim() || undefined,
      badgeColor: formBadgeColor,
      features: formFeatures.length > 0 ? formFeatures : ['High-Speed WiFi', 'Ocean View'],
      customSpecs: customSpecs.filter(s => s.key.trim() && s.value.trim()),
      description: formDescription.trim() || 'Spacious, elegant suite crafted for refined comfort and privacy.',
      checkInTime: formCheckInTime.trim() || '2:00 PM',
      checkOutTime: formCheckOutTime.trim() || '12:00 PM',
      payOnArrival: formPayOnArrival,
      available: formAvailable
    };

    try {
      if (editingRoomId) {
        await updateRoom(editingRoomId, roomPayload);
        setSaveSuccessMessage('Room updated successfully in Firestore!');
      } else {
        await addRoom(roomPayload);
        setSaveSuccessMessage('New room added to Firestore and visible to guests!');
      }

      setTimeout(() => {
        setSaveSuccessMessage('');
        setIsRoomModalOpen(false);
      }, 1000);
    } catch (err: any) {
      console.error('Error saving room:', err);
      setUploadError(err.message || 'Failed to save room. Please try again.');
    } finally {
      setSavingRoom(false);
    }
  };

  // Toggle Feature Pill in Form
  const toggleFeature = (feature: string) => {
    if (formFeatures.includes(feature)) {
      setFormFeatures(formFeatures.filter((f) => f !== feature));
    } else {
      setFormFeatures([...formFeatures, feature]);
    }
  };

  const handleAddCustomFeature = () => {
    if (newFeatureText.trim() && !formFeatures.includes(newFeatureText.trim())) {
      setFormFeatures([...formFeatures, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  // Quick toggle room availability
  const handleToggleRoomAvailability = async (room: Room) => {
    const currentStatus = room.available !== false;
    await updateRoom(room.id, { available: !currentStatus });
  };

  // Confirm delete room
  const handleConfirmDelete = async (roomId: string) => {
    await deleteRoom(roomId);
    setDeletingRoomId(null);
  };

  // Add guest review directly from admin
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      await addReview({
        name: newReviewName.trim(),
        rating: Number(newReviewRating),
        comment: newReviewComment.trim(),
        stayedRoom: newReviewRoom.trim() || 'Presidential Luxury Suite',
        verified: true
      });
      setIsReviewModalOpen(false);
      setNewReviewName('');
      setNewReviewRating(5);
      setNewReviewRoom('');
      setNewReviewComment('');
    } catch (err) {
      console.error('Failed to create review', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Filtered rooms in admin
  const filteredAdminRooms = rooms.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.location.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.categoryLabel.toLowerCase().includes(roomSearch.toLowerCase());

    const matchesCategory =
      roomCategoryFilter === 'all' || r.category === roomCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Filtered bookings in admin
  const filteredBookings = allBookings.filter((b) => {
    const matchesStatus =
      bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    const matchesSearch =
      b.guestName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.bookingReference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.roomTitle.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.guestPhone.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered reviews in admin (real data from user panel!)
  const filteredGuestReviews = guestReviews.filter((rev) => {
    const matchesRating =
      reviewRatingFilter === 'all' || rev.rating.toString() === reviewRatingFilter;
    const matchesSearch =
      rev.name.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      rev.comment.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      (rev.stayedRoom ? rev.stayedRoom.toLowerCase().includes(reviewSearch.toLowerCase()) : false);
    return matchesRating && matchesSearch;
  });

  // Calculate KPIs
  const totalRoomsCount = rooms.length;
  const availableRoomsCount = rooms.filter((r) => r.available !== false).length;
  const totalBookingsCount = allBookings.length;
  const activeBookingsCount = allBookings.filter((b) => b.status === 'confirmed').length;
  const totalReviewsCount = guestReviews.length;
  const avgReviewRating =
    guestReviews.length > 0
      ? (guestReviews.reduce((acc, r) => acc + r.rating, 0) / guestReviews.length).toFixed(1)
      : '5.0';

  const totalRevenue = allBookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  // If not authorized, show PIN / passcode entry screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#02130e] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#041c14] border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-950/80 mb-4 border border-amber-400/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="font-display font-black text-2xl text-white tracking-tight">
              Staff & Management Portal
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Restricted Hotel Administration & Operations
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-[11px] text-emerald-400 font-mono">
              <Database className="w-3 h-3" />
              <span>Connected to Live Firestore</span>
            </div>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Executive Passcode (PIN)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter passcode (e.g. antix2026)"
                  className="w-full px-4 py-3.5 bg-[#02140e] border border-emerald-800/70 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono tracking-wider"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-emerald-500/60 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {pinError && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Invalid passcode. Default passcode is <strong className="font-mono">antix2026</strong>.</span>
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300/90 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                Default Code:
              </span>
              <span className="font-mono font-bold bg-amber-900/50 px-2 py-0.5 rounded text-amber-200">
                antix2026
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAdminMode(false)}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Guest Website</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-emerald-900/40 text-center text-[11px] text-slate-400">
            Changes made here directly update the user booking catalog in real-time.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03140e] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-30 bg-[#041a12]/95 backdrop-blur-xl border-b border-emerald-900/60 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md border border-emerald-400/40">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg text-white">
                  Antix Hotel
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Firestore Synchronized</span>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-[#02140e] p-1 rounded-xl border border-emerald-900/70">
            <button
              id="admin-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              id="admin-tab-rooms"
              onClick={() => setActiveTab('rooms')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rooms'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Rooms & Suites</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px]">
                {rooms.length}
              </span>
            </button>
            <button
              id="admin-tab-bookings"
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Reservations</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px]">
                {allBookings.length}
              </span>
            </button>
            <button
              id="admin-tab-reviews"
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Reviews</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px]">
                {guestReviews.length}
              </span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Passcode Management Button */}
            <button
              id="btn-admin-passcode-settings"
              onClick={() => {
                setNewPasscode('');
                setPasscodeSuccessMsg('');
                setPasscodeErrorMsg('');
                setIsPasscodeSettingsOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 transition-all cursor-pointer shadow-xs"
              title="Change Staff Passcode"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Passcode Settings</span>
            </button>

            <button
              id="btn-admin-view-site"
              onClick={() => setIsAdminMode(false)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Guest Site</span>
            </button>
            <button
              id="btn-admin-logout"
              onClick={handleAdminLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-emerald-900/50 transition-colors cursor-pointer"
              title="Lock Admin Panel & Sign Out"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ========================================================
            TAB 1: DASHBOARD OVERVIEW
           ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Total Suites */}
              <div 
                onClick={() => setActiveTab('rooms')}
                className="bg-[#052119] hover:bg-[#072a20] transition-colors border border-emerald-800/50 rounded-2xl p-4.5 relative overflow-hidden cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Total Suites
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    <BedDouble className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display">
                  {totalRoomsCount}
                </div>
                <p className="text-[11px] text-emerald-400 font-medium mt-1">
                  {availableRoomsCount} available live
                </p>
              </div>

              {/* Active Reservations */}
              <div 
                onClick={() => setActiveTab('bookings')}
                className="bg-[#052119] hover:bg-[#072a20] transition-colors border border-emerald-800/50 rounded-2xl p-4.5 relative overflow-hidden cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Reservations
                  </span>
                  <div className="p-2 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/50">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display">
                  {activeBookingsCount}
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  ${totalRevenue.toLocaleString()} volume
                </p>
              </div>

              {/* Guest Reviews */}
              <div 
                onClick={() => setActiveTab('reviews')}
                className="bg-[#052119] hover:bg-[#072a20] transition-colors border border-emerald-800/50 rounded-2xl p-4.5 relative overflow-hidden cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Guest Reviews
                  </span>
                  <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/50">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-2">
                  <span>{totalReviewsCount}</span>
                  <span className="text-xs text-amber-400 font-bold">
                    ★ {avgReviewRating}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  Verified user testimonials
                </p>
              </div>

            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Quick Actions Card */}
              <div className="bg-[#052119] border border-emerald-800/50 rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-black text-base text-white">
                  Quick Manager Actions
                </h3>
                <div className="space-y-2.5">
                  <button
                    onClick={handleOpenAddModal}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Luxury Suite</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('rooms')}
                    className="w-full py-2.5 px-4 bg-[#031811] hover:bg-[#02130e] text-slate-200 hover:text-white border border-emerald-800/60 font-bold text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-emerald-400" />
                      <span>Suites Catalog</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                      {rooms.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="w-full py-2.5 px-4 bg-[#031811] hover:bg-[#02130e] text-slate-200 hover:text-white border border-emerald-800/60 font-bold text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-teal-400" />
                      <span>Reservations</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-teal-950 text-teal-400 border border-teal-800/40">
                      {allBookings.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="w-full py-2.5 px-4 bg-[#031811] hover:bg-[#02130e] text-slate-200 hover:text-white border border-emerald-800/60 font-bold text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span>Guest Reviews</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-purple-950 text-purple-400 border border-purple-800/40">
                      {guestReviews.length}
                    </span>
                  </button>
                </div>

                <div className="pt-4 border-t border-emerald-900/50 flex items-center justify-between text-xs text-slate-400">
                  <span>Firestore Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Online & Ready
                  </span>
                </div>
              </div>

              {/* Recent Bookings Feed */}
              <div className="lg:col-span-2 bg-[#052119] border border-emerald-800/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-base text-white">
                    Recent Guest Reservations
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    View All ({allBookings.length}) →
                  </button>
                </div>

                {allBookings.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    No reservations recorded yet. New guest bookings will appear here instantly.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {allBookings.slice(0, 4).map((booking) => (
                      <div
                        key={booking.id || booking.bookingReference}
                        className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#031811] border border-emerald-900/50 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">
                              {booking.guestName}
                            </span>
                            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800/40">
                              {booking.bookingReference}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            {booking.roomTitle} • {booking.nights} night(s) • {booking.checkIn} to {booking.checkOut}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            ${booking.totalPrice}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              booking.status === 'confirmed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                                : booking.status === 'completed'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                                : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: ROOMS & SUITES MANAGEMENT (CRUD)
           ======================================================== */}
        {activeTab === 'rooms' && (
          <div className="space-y-5">
            
            {/* Control Bar: Search, Category Filter, Add Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#052119] p-4 rounded-2xl border border-emerald-800/50">
              
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search Input */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                    placeholder="Search suites by name or location..."
                    className="w-full pl-9 pr-4 py-2 bg-[#02130e] border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                  />
                  {roomSearch && (
                    <button
                      onClick={() => setRoomSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Dropdown */}
                <select
                  value={roomCategoryFilter}
                  onChange={(e) => setRoomCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-[#02130e] border border-emerald-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="all">All Categories ({rooms.length})</option>
                  {dynamicCategories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-admin-add-room"
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Suite</span>
                </button>

                <button
                  id="btn-admin-reset-rooms"
                  onClick={() => {
                    if (confirm('Are you sure you want to reset rooms to the default luxury resort catalog?')) {
                      resetToDefaultRooms();
                    }
                  }}
                  className="p-2 bg-[#02130e] hover:bg-emerald-950 text-slate-300 hover:text-white border border-emerald-800/60 rounded-xl transition-colors cursor-pointer"
                  title="Restore default resort suites"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Suites Grid */}
            {filteredAdminRooms.length === 0 ? (
              <div className="bg-[#052119] border border-emerald-800/50 rounded-2xl p-12 text-center space-y-3">
                <BedDouble className="w-10 h-10 text-emerald-500/50 mx-auto" />
                <h4 className="font-display font-bold text-lg text-white">
                  No Suites Found
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No rooms matched your search query. Try clearing the filter or add a brand new luxury suite.
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  Add First Suite
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAdminRooms.map((room) => {
                  const isAvail = room.available !== false;
                  return (
                    <div
                      key={room.id}
                      className="bg-[#052119] border border-emerald-800/50 rounded-2xl overflow-hidden flex flex-col transition-all hover:border-emerald-700/80 shadow-md group"
                    >
                      {/* Image Preview & Status Badge */}
                      <div className="relative h-48 w-full overflow-hidden bg-[#02130e]">
                        <img
                          src={room.image}
                          alt={room.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#052119] via-transparent to-black/40" />

                        {/* Category Tag */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white">
                          {room.categoryLabel}
                        </div>

                        {/* Live Availability Badge */}
                        <button
                          onClick={() => handleToggleRoomAvailability(room)}
                          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                            isAvail
                              ? 'bg-emerald-600/90 text-white hover:bg-emerald-500'
                              : 'bg-rose-600/90 text-white hover:bg-rose-500'
                          }`}
                          title="Click to toggle availability"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>{isAvail ? 'Available' : 'Maintenance'}</span>
                        </button>

                        {/* Price Display */}
                        <div className="absolute bottom-3 left-3">
                          <div className="flex items-baseline gap-1">
                            <span className="font-display font-black text-2xl text-white">
                              ${room.pricePerNight}
                            </span>
                            <span className="text-xs text-emerald-300 font-medium">/night</span>
                          </div>
                        </div>
                      </div>

                      {/* Room Details Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-display font-black text-base text-white tracking-tight line-clamp-1">
                            {room.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {room.location}
                          </p>

                          {/* Quick specs */}
                          <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-emerald-900/50 text-[11px] text-slate-300">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{room.maxGuests} Guests</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BedDouble className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{room.beds} Beds</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{room.baths} Baths</span>
                            </div>
                          </div>

                          {/* Features Pills */}
                          <div className="flex flex-wrap gap-1">
                            {(room.features || []).slice(0, 3).map((f, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-[#02130e] text-slate-300 text-[10px] border border-emerald-900/50"
                              >
                                {f}
                              </span>
                            ))}
                            {(room.features || []).length > 3 && (
                              <span className="px-1.5 py-0.5 text-slate-400 text-[10px]">
                                +{(room.features || []).length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(room)}
                            className="flex-1 py-2 px-3 bg-[#02130e] hover:bg-emerald-950 text-slate-200 hover:text-white border border-emerald-800/60 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Edit Suite</span>
                          </button>

                          <button
                            onClick={() => setDeletingRoomId(room.id)}
                            className="p-2 bg-[#02130e] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-emerald-900/50 rounded-xl transition-all cursor-pointer"
                            title="Delete this room permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================
            TAB 3: RESERVATIONS / BOOKINGS MANAGEMENT
           ======================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-5">
            
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#052119] p-4 rounded-2xl border border-emerald-800/50">
              
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search by guest name, voucher #, or phone..."
                    className="w-full pl-9 pr-4 py-2 bg-[#02130e] border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                  />
                  {bookingSearch && (
                    <button
                      onClick={() => setBookingSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#02130e] border border-emerald-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="all">All Statuses ({allBookings.length})</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="text-xs text-emerald-400 font-medium">
                Showing {filteredBookings.length} of {allBookings.length} reservations
              </div>

            </div>

            {/* Bookings Table */}
            {filteredBookings.length === 0 ? (
              <div className="bg-[#052119] border border-emerald-800/50 rounded-2xl p-12 text-center space-y-2">
                <CalendarCheck className="w-10 h-10 text-emerald-500/50 mx-auto" />
                <h4 className="font-display font-bold text-lg text-white">
                  No Reservations Found
                </h4>
                <p className="text-xs text-slate-400">
                  No guest bookings match your active filters.
                </p>
              </div>
            ) : (
              <div className="bg-[#052119] border border-emerald-800/50 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#02140e] text-slate-400 uppercase tracking-wider text-[10px] border-b border-emerald-900/60">
                      <tr>
                        <th className="py-3.5 px-4 font-black">Voucher Ref</th>
                        <th className="py-3.5 px-4 font-black">Primary Guest</th>
                        <th className="py-3.5 px-4 font-black">Reserved Suite</th>
                        <th className="py-3.5 px-4 font-black">Dates & Stay</th>
                        <th className="py-3.5 px-4 font-black">Payment Due</th>
                        <th className="py-3.5 px-4 font-black">Status</th>
                        <th className="py-3.5 px-4 font-black text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-900/40 font-normal">
                      {filteredBookings.map((b) => (
                        <tr
                          key={b.id || b.bookingReference}
                          className="hover:bg-[#031c14] transition-colors"
                        >
                          {/* Ref */}
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                            {b.bookingReference}
                          </td>

                          {/* Guest info */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">
                              {b.guestName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {b.guestPhone} • {b.userEmail || 'Guest'}
                            </div>
                          </td>

                          {/* Suite */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-200 line-clamp-1 max-w-[200px]">
                              {b.roomTitle}
                            </div>
                            <div className="text-[10px] text-emerald-400">
                              {b.roomType}
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-medium text-slate-200">
                              {b.checkIn} → {b.checkOut}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {b.nights} night(s) • {b.guestsCount} guests
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-mono font-bold text-emerald-400 text-sm">
                              ${b.totalPrice}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Pay on Arrival
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                                  : b.status === 'completed'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                                  : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              {b.status !== 'confirmed' && (
                                <button
                                  onClick={() => b.id && updateBookingStatus(b.id, 'confirmed')}
                                  className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 text-[11px] font-bold cursor-pointer"
                                  title="Mark as Confirmed"
                                >
                                  Confirm
                                </button>
                              )}
                              {b.status !== 'completed' && (
                                <button
                                  onClick={() => b.id && updateBookingStatus(b.id, 'completed')}
                                  className="px-2 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800/60 text-[11px] font-bold cursor-pointer"
                                  title="Mark as Checked-in / Completed"
                                >
                                  Complete
                                </button>
                              )}
                              {b.status !== 'cancelled' && (
                                <button
                                  onClick={() => b.id && updateBookingStatus(b.id, 'cancelled')}
                                  className="px-2 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-[11px] font-bold cursor-pointer"
                                  title="Cancel Booking"
                                >
                                  Cancel
                                </button>
                              )}
                              {b.id && (
                                <button
                                  onClick={() => setDeletingBooking(b)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-colors cursor-pointer"
                                  title="Delete Reservation Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================
            TAB 4: GUEST REVIEWS & TESTIMONIALS
           ======================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-5">
            {/* Header & Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#052119] p-4 rounded-2xl border border-emerald-800/50">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search Input */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    placeholder="Search reviews by guest name or comments..."
                    className="w-full pl-9 pr-4 py-2 bg-[#02130e] border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                  />
                  {reviewSearch && (
                    <button
                      onClick={() => setReviewSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Rating Filter */}
                <select
                  value={reviewRatingFilter}
                  onChange={(e) => setReviewRatingFilter(e.target.value)}
                  className="px-3 py-2 bg-[#02130e] border border-emerald-800/60 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-emerald-400 font-medium cursor-pointer"
                >
                  <option value="all">All Ratings ({guestReviews.length})</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#02130e] border border-emerald-900/60 text-xs text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>Avg: {avgReviewRating} / 5.0</span>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>
            </div>

            {/* Reviews Grid */}
            {filteredGuestReviews.length === 0 ? (
              <div className="bg-[#052119] border border-emerald-800/50 rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-amber-400 mx-auto">
                  <Star className="w-6 h-6 fill-amber-400" />
                </div>
                <h4 className="text-white font-bold text-base">No Guest Reviews Found</h4>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  {reviewSearch || reviewRatingFilter !== 'all'
                    ? 'No reviews match your filter criteria.'
                    : 'Reviews written by guests from the public site will appear here in real time.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGuestReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#052119] border border-emerald-800/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-emerald-700/70 transition-all"
                  >
                    <div className="space-y-3">
                      {/* Top Row: Stars + Verified Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-slate-800 text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        {rev.verified !== false && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
                            <ShieldCheck className="w-3 h-3" />
                            Verified Guest
                          </span>
                        )}
                      </div>

                      {/* Comment */}
                      <p className="text-slate-200 text-xs leading-relaxed line-clamp-4 italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Footer / Author */}
                    <div className="pt-3 border-t border-emerald-900/50 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-white text-xs">
                          {rev.name}
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          {rev.stayedRoom || 'Executive Suite'} {rev.date ? `• ${rev.date}` : ''}
                        </p>
                      </div>

                      {rev.id && (
                        <button
                          onClick={() => setDeletingReview(rev)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-colors cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ========================================================
          MODAL: ADD OR EDIT ROOM
         ======================================================== */}
      <AnimatePresence>
        {isRoomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#052119] border border-emerald-700/60 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-emerald-950 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-white">
                    {editingRoomId ? 'Edit Luxury Suite' : 'Add New Luxury Suite'}
                  </h3>
                  <p className="text-xs text-emerald-400">
                    Saves directly to Firestore and updates the live user website.
                  </p>
                </div>
              </div>

              {saveSuccessMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{saveSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveRoom} className="space-y-5">
                
                {/* Error Banner if any */}
                {uploadError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800/80 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* ================= SECTION 1: BASIC INFORMATION ================= */}
                <div className="bg-[#031811] p-4 rounded-2xl border border-emerald-900/60 space-y-3.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Suite Identity & Custom Category</span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Suite Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Royal Oceanfront Sanctuary"
                        className="w-full px-3.5 py-2.5 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Highlight Subtitle
                      </label>
                      <input
                        type="text"
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                        placeholder="e.g. Private Heated Infinity Pool & Butler"
                        className="w-full px-3.5 py-2.5 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Category Selection & Custom Key Feature */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-300">
                            Category Selection *
                          </label>
                          <span className="text-[10px] text-emerald-400">
                            {isCustomCategory ? 'Custom Key Active' : 'Preset'}
                          </span>
                        </div>
                        <select
                          value={isCustomCategory ? 'custom' : formCategory}
                          onChange={(e) => {
                            if (e.target.value === 'custom') {
                              setIsCustomCategory(true);
                            } else {
                              setIsCustomCategory(false);
                              setFormCategory(e.target.value as RoomCategory);
                            }
                          }}
                          className="w-full px-3.5 py-2.5 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
                        >
                          <optgroup label="Standard Categories">
                            <option value="villa">Luxury Villa</option>
                            <option value="ocean">Ocean Villa</option>
                            <option value="deluxe">Deluxe Suite</option>
                            <option value="presidential">Presidential Suite</option>
                            <option value="penthouse">Penthouse</option>
                          </optgroup>
                          {dynamicCategories.filter(c => !['villa','ocean','deluxe','presidential','penthouse'].includes(c.key)).length > 0 && (
                            <optgroup label="Existing Custom Categories">
                              {dynamicCategories.filter(c => !['villa','ocean','deluxe','presidential','penthouse'].includes(c.key)).map(c => (
                                <option key={c.key} value={c.key}>{c.label} ({c.key})</option>
                              ))}
                            </optgroup>
                          )}
                          <option value="custom" className="text-emerald-400 font-bold">
                            + Add New Custom Category Key...
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Location / Wing *
                        </label>
                        <input
                          type="text"
                          required
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="e.g. Grand Oceanfront Wing, Pavilion 03"
                          className="w-full px-3.5 py-2.5 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    {/* Custom Category Key Creator UI */}
                    {isCustomCategory && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3.5 rounded-xl bg-[#02130e] border border-emerald-500/50 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5" />
                            Define Custom Category Key & Label
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomCategory(false);
                              setFormCategory('villa');
                            }}
                            className="text-[11px] text-slate-400 hover:text-white"
                          >
                            Switch back to preset
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-400 mb-1">
                              Internal Key (no spaces, e.g. <span className="font-mono text-emerald-400">bungalow</span>)
                            </label>
                            <input
                              type="text"
                              required
                              value={customCategoryKey}
                              onChange={(e) => setCustomCategoryKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                              placeholder="e.g. beach_bungalow"
                              className="w-full px-3 py-1.5 bg-[#010c08] border border-emerald-700/80 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-400 mb-1">
                              Display Name (shown to guests)
                            </label>
                            <input
                              type="text"
                              required
                              value={customCategoryLabel}
                              onChange={(e) => setCustomCategoryLabel(e.target.value)}
                              placeholder="e.g. Beach Bungalow Sanctuary"
                              className="w-full px-3 py-1.5 bg-[#010c08] border border-emerald-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                        </div>

                        {/* Quick preset key suggestions */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] text-slate-400">Quick Key Suggestions:</span>
                          {[
                            { key: 'bungalow', label: 'Beach Bungalow' },
                            { key: 'chalet', label: 'Alpine Chalet' },
                            { key: 'water_villa', label: 'Overwater Villa' },
                            { key: 'cottage', label: 'Garden Cottage' },
                            { key: 'duplex', label: 'Sky Duplex' }
                          ].map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => {
                                setCustomCategoryKey(s.key);
                                setCustomCategoryLabel(s.label);
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900 cursor-pointer"
                            >
                              +{s.key}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* ================= SECTION 2: PHOTO UPLOAD & GALLERY (UPLOADER ONLY) ================= */}
                <div className="bg-[#031811] p-4 rounded-2xl border border-emerald-900/60 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Primary Suite Photo Uploader *</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      Direct Image Upload Only
                    </span>
                  </div>

                  {/* Primary Room Photo Uploader */}
                  <div className="space-y-3">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
                        isDragOver
                          ? 'border-emerald-400 bg-emerald-950/40 scale-[1.01]'
                          : 'border-emerald-800/70 bg-[#02130e] hover:border-emerald-600'
                      }`}
                      onClick={() => document.getElementById('room-photo-file-input')?.click()}
                    >
                      <input
                        id="room-photo-file-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileInputChange}
                      />

                      {isUploadingImage ? (
                        <div className="py-6 flex flex-col items-center justify-center space-y-2">
                          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs font-bold text-emerald-400">
                            Optimizing & compressing room photo...
                          </p>
                        </div>
                      ) : formImage ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
                          <img
                            src={formImage}
                            alt="Uploaded Room Preview"
                            referrerPolicy="no-referrer"
                            className="w-28 h-28 rounded-xl object-cover border border-emerald-500 shadow-md shrink-0"
                          />
                          <div className="flex-1 space-y-2 text-center sm:text-left">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 text-[11px] font-bold border border-emerald-700/60">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Room Photo Ready</span>
                            </div>
                            <p className="text-xs text-slate-300">
                              Image successfully loaded and optimized for catalog display.
                            </p>
                            <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  document.getElementById('room-photo-file-input')?.click();
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-700/60 transition-colors cursor-pointer"
                              >
                                Replace Photo
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormImage('');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-800/60 transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 space-y-2.5">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800/50 shadow-inner">
                            <Upload className="w-7 h-7" />
                          </div>
                          <div className="text-sm font-bold text-white">
                            Click to browse room photo or drag & drop here
                          </div>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Supports JPG, PNG, WebP from your device or camera. Compressed automatically for fast catalog loading.
                          </p>
                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800/60">
                              <Plus className="w-3.5 h-3.5" />
                              Select Image File
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Gallery Photos Strip - Upload Only */}
                  <div className="pt-2 border-t border-emerald-900/50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">
                          Additional Gallery Photos ({formGallery.length})
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Upload multiple angles or interior views from device
                        </span>
                      </div>
                      <label
                        htmlFor="gallery-multi-upload"
                        className="py-1.5 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-800/70 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload Photos</span>
                      </label>
                      <input
                        id="gallery-multi-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleGalleryUpload}
                      />
                    </div>

                    {/* Thumbnail gallery */}
                    {formGallery.length > 0 ? (
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-1">
                        {formGallery.map((imgUrl, gIdx) => (
                          <div
                            key={gIdx}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border border-emerald-700/80 shrink-0 group shadow-sm"
                          >
                            <img
                              src={imgUrl}
                              alt={`Gallery photo ${gIdx + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(gIdx)}
                              className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-rose-600 text-white rounded-md opacity-90 transition-colors cursor-pointer"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-[#02130e] border border-emerald-900/50 text-center text-slate-400 text-xs italic">
                        No additional gallery photos uploaded. Click "Upload Photos" above to add room views.
                      </div>
                    )}
                  </div>
                </div>

                {/* ================= SECTION 3: CUSTOM SPECIFICATIONS KEY-VALUE ================= */}
                <div className="bg-[#031811] p-4 rounded-2xl border border-emerald-900/60 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Custom Room Specifications (Custom Key & Value)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Shows on guest details popup
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Add custom fields like <span className="text-emerald-300 font-semibold">View Direction</span>, <span className="text-emerald-300 font-semibold">Balcony Type</span>, <span className="text-emerald-300 font-semibold">Pool Size</span>, or any bespoke amenities.
                  </p>

                  {/* Preset quick key chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'View Direction',
                      'Balcony / Terrace',
                      'Pool Dimensions',
                      'Bedding Setup',
                      'Floor Level',
                      'Butler Service',
                      'Breakfast Policy',
                      'Airport Transfer',
                      'Pet Policy',
                      'Smoking'
                    ].map((keyName) => (
                      <button
                        key={keyName}
                        type="button"
                        onClick={() => setNewSpecKey(keyName)}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#02130e] text-slate-300 border border-emerald-800/50 hover:border-emerald-500 hover:text-emerald-300 cursor-pointer"
                      >
                        +{keyName}
                      </button>
                    ))}
                  </div>

                  {/* Add spec input row */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        placeholder="Custom Key (e.g. Jacuzzi)"
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        placeholder="Value (e.g. Heated 4-Person)"
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSpec();
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomSpec}
                      className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold hover:from-emerald-500 hover:to-teal-500 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Spec</span>
                    </button>
                  </div>

                  {/* Existing Custom Specs List */}
                  {customSpecs.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {customSpecs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#02130e] border border-emerald-800/40 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-400">{spec.key}:</span>
                            <span className="text-slate-200">{spec.value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomSpec(sIdx)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Remove specification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ================= SECTION 4: PRICING & DIMENSIONS ================= */}
                <div className="bg-[#031811] p-4 rounded-2xl border border-emerald-900/60 space-y-3.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Pricing & Occupancy</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Price / Night ($) *
                      </label>
                      <input
                        type="number"
                        required
                        min={10}
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Original Rate ($)
                      </label>
                      <input
                        type="number"
                        min={10}
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Max Guests
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={formMaxGuests}
                        onChange={(e) => setFormMaxGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Sqft Area
                      </label>
                      <input
                        type="number"
                        min={100}
                        value={formSqft}
                        onChange={(e) => setFormSqft(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Bedrooms / Beds Count
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={formBeds}
                        onChange={(e) => setFormBeds(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Bathrooms Count
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={formBaths}
                        onChange={(e) => setFormBaths(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                {/* ================= SECTION 5: AMENITIES & FEATURES ================= */}
                <div className="bg-[#031811] p-4 rounded-2xl border border-emerald-900/60 space-y-3.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Included Amenities & Features</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_FEATURES.map((feat, i) => {
                      const selected = formFeatures.includes(feat);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleFeature(feat)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            selected
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-[#02130e] text-slate-400 border-emerald-900/60 hover:text-white'
                          }`}
                        >
                          {selected ? '✓ ' : '+ '}
                          {feat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Feature */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      placeholder="Add another custom amenity..."
                      className="flex-1 px-3 py-1.5 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomFeature}
                      className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-900"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* ================= SECTION 6: BADGE, DESCRIPTION & POLICIES ================= */}
                <div className="bg-[#031811] p-4 rounded-2xl border border-emerald-900/60 space-y-3.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Promotional Badge & Hotel Policies</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Promotional Badge
                      </label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        placeholder="e.g. 20% Off Limited"
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Check-in Time
                      </label>
                      <input
                        type="text"
                        value={formCheckInTime}
                        onChange={(e) => setFormCheckInTime(e.target.value)}
                        placeholder="2:00 PM"
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Check-out Time
                      </label>
                      <input
                        type="text"
                        value={formCheckOutTime}
                        onChange={(e) => setFormCheckOutTime(e.target.value)}
                        placeholder="12:00 PM"
                        className="w-full px-3 py-2 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Room Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Room Description
                    </label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Provide evocative details of the architectural highlights, bathroom, views, and comforts..."
                      className="w-full px-3.5 py-2.5 bg-[#02130e] border border-emerald-800/70 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Checkboxes for Policies */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#02130e] border border-emerald-900/60">
                      <input
                        type="checkbox"
                        id="formPayOnArrival"
                        checked={formPayOnArrival}
                        onChange={(e) => setFormPayOnArrival(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-emerald-700 cursor-pointer"
                      />
                      <label htmlFor="formPayOnArrival" className="text-xs font-bold text-slate-200 cursor-pointer">
                        Pay on Arrival supported (Cash / Card)
                      </label>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#02130e] border border-emerald-900/60">
                      <input
                        type="checkbox"
                        id="formAvailable"
                        checked={formAvailable}
                        onChange={(e) => setFormAvailable(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-emerald-700 cursor-pointer"
                      />
                      <label htmlFor="formAvailable" className="text-xs font-bold text-slate-200 cursor-pointer">
                        Available for guest booking
                      </label>
                    </div>
                  </div>
                </div>

                {/* ================= ACTION SUBMIT ================= */}
                <div className="pt-3 flex items-center justify-end gap-3 sticky bottom-0 bg-[#052119]/95 backdrop-blur-md py-3 -mx-6 px-6 border-t border-emerald-800/60">
                  <button
                    type="button"
                    onClick={() => setIsRoomModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingRoom}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {savingRoom ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{editingRoomId ? 'Update Suite' : 'Publish Suite to Catalog'}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          CONFIRM DELETE DIALOG
         ======================================================== */}
      <AnimatePresence>
        {deletingRoomId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#052119] border border-rose-800/70 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center mx-auto border border-rose-800/50">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="font-display font-black text-lg text-white">
                Delete Luxury Suite?
              </h4>
              <p className="text-xs text-slate-300">
                This room will be permanently removed from Firestore and will no longer appear on the guest website.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDeletingRoomId(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-[#02130e] hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmDelete(deletingRoomId)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-md cursor-pointer"
                >
                  Delete Suite
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          CONFIRM DELETE RESERVATION DIALOG (RESPONSIVE)
         ======================================================== */}
      <AnimatePresence>
        {deletingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#052119] border border-rose-800/70 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center mx-auto border border-rose-800/50">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-black text-lg text-white">
                  Delete Guest Reservation?
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Are you sure you want to permanently remove this reservation record from Firestore?
                </p>
              </div>

              <div className="p-3 bg-[#02130e] border border-emerald-900/60 rounded-xl text-left space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Guest Name:</span>
                  <span className="font-bold text-white">{deletingBooking.guestName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Voucher Reference:</span>
                  <span className="font-mono font-bold text-emerald-400">{deletingBooking.bookingReference}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Suite Reserved:</span>
                  <span className="font-semibold text-slate-200 truncate max-w-[200px]">{deletingBooking.roomTitle}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Stay Dates:</span>
                  <span className="text-slate-300">{deletingBooking.checkIn} → {deletingBooking.checkOut}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 border-t border-emerald-900/40 pt-1.5">
                  <span>Total Bill:</span>
                  <span className="font-mono font-bold text-emerald-400">${deletingBooking.totalPrice}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDeletingBooking(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-[#02130e] hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deletingBooking.id) {
                      deleteBooking(deletingBooking.id);
                    }
                    setDeletingBooking(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-md cursor-pointer"
                >
                  Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          CONFIRM DELETE REVIEW DIALOG (RESPONSIVE)
         ======================================================== */}
      <AnimatePresence>
        {deletingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#052119] border border-rose-800/70 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center mx-auto border border-rose-800/50">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-black text-lg text-white">
                  Delete Guest Review?
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  This testimonial will be permanently deleted and will no longer appear on the live website.
                </p>
              </div>

              <div className="p-3 bg-[#02130e] border border-emerald-900/60 rounded-xl text-left space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Author:</span>
                  <span className="font-bold text-white">{deletingReview.name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Rating:</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    {'★'.repeat(deletingReview.rating)} ({deletingReview.rating}/5)
                  </span>
                </div>
                <div className="text-slate-300 italic text-[11px] border-t border-emerald-900/40 pt-1.5 line-clamp-3">
                  "{deletingReview.comment}"
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDeletingReview(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-[#02130e] hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deletingReview.id) {
                      deleteReview(deletingReview.id);
                    }
                    setDeletingReview(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-md cursor-pointer"
                >
                  Delete Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL: ADD GUEST REVIEW / TESTIMONIAL DIRECTLY
         ======================================================== */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#052119] border border-emerald-700/60 rounded-3xl w-full max-w-md shadow-2xl p-6 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-emerald-950/60 border border-emerald-900/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-white">
                    Add Guest Review
                  </h3>
                  <p className="text-xs text-slate-400">
                    Saves directly to live Firestore database
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="e.g. Lady Victoria Sterling"
                    className="w-full px-3.5 py-2.5 bg-[#02130e] border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Star Rating (1 - 5)
                  </label>
                  <div className="flex items-center gap-2 p-2 bg-[#02130e] border border-emerald-800/60 rounded-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newReviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-auto text-xs font-bold text-amber-300 pr-2">
                      {newReviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Suite / Villa Stayed
                  </label>
                  <input
                    type="text"
                    value={newReviewRoom}
                    onChange={(e) => setNewReviewRoom(e.target.value)}
                    placeholder="e.g. Royal Ocean Penthouse"
                    className="w-full px-3.5 py-2.5 bg-[#02130e] border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Guest Testimonial Comment *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Describe the stay experience..."
                    className="w-full px-3.5 py-2.5 bg-[#02130e] border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400 leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-[#02130e] hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingReview ? 'Publishing...' : 'Save & Publish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ========================================================
            MODAL: PASSCODE SETTINGS
           ======================================================== */}
        {isPasscodeSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#041c14] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-slate-100"
            >
              <button
                type="button"
                onClick={() => setIsPasscodeSettingsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-emerald-900/40 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Staff Passcode Settings
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update the executive security code
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#02130e] border border-emerald-900/80 mb-4 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Current Active Passcode:</span>
                  <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    {adminPasscode || 'antix2026'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Share this passcode only with authorized hotel managers or front desk personnel.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPasscode.trim()) {
                    setPasscodeErrorMsg('Please type a new passcode.');
                    return;
                  }
                  if (newPasscode.trim().length < 4) {
                    setPasscodeErrorMsg('Passcode should be at least 4 characters.');
                    return;
                  }
                  changeAdminPasscode(newPasscode.trim());
                  setPasscodeSuccessMsg('Passcode updated successfully! Next time you login, use this code.');
                  setPasscodeErrorMsg('');
                  setTimeout(() => {
                    setIsPasscodeSettingsOpen(false);
                    setPasscodeSuccessMsg('');
                  }, 1800);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    New Secret Passcode
                  </label>
                  <input
                    type="text"
                    value={newPasscode}
                    onChange={(e) => {
                      setNewPasscode(e.target.value);
                      setPasscodeErrorMsg('');
                      setPasscodeSuccessMsg('');
                    }}
                    placeholder="e.g. hotel2026 or antixMaster"
                    className="w-full px-3.5 py-3 bg-[#02130e] border border-emerald-800/80 rounded-xl text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    autoFocus
                  />
                </div>

                {passcodeErrorMsg && (
                  <p className="text-rose-400 text-xs font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passcodeErrorMsg}</span>
                  </p>
                )}

                {passcodeSuccessMsg && (
                  <p className="text-emerald-400 text-xs font-medium flex items-center gap-1 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{passcodeSuccessMsg}</span>
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasscodeSettingsOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-[#02130e] hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 transition-all shadow-md cursor-pointer"
                  >
                    Save New Passcode
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

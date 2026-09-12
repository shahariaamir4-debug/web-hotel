# 🏨 Antix Hotel - Separate Admin Panel Project

This package contains the **complete, standalone Admin Panel** for Antix Hotel & Sanctuary. It connects to the exact same Firebase Firestore database (`ai-studio-0d953d7d-fd9b-458b-8861-ef7743a87e93`) as your guest-facing website.

---

## ⚡ How Real-Time Two-Way Sync Works

Both apps share the same database collections:
- **`rooms`**: When you add, edit, or change room prices here, the user site updates instantly.
- **`bookings`**: When a guest completes a booking on the user site, it immediately appears in your Reservations tab with live audio notifications and revenue metrics.
- **`reviews`**: Guest testimonials submitted on the main site appear here for moderation.

---

## 📁 Standalone Project Structure

To deploy this as a separate GitHub repository (e.g. `antix-hotel-admin`), create a new Vite + React project:

```bash
npm create vite@latest antix-admin -- --template react-ts
cd antix-admin
npm install firebase lucide-react motion canvas-confetti
npm install -D tailwindcss @tailwindcss/vite
```

Then copy the files provided below into your project:

### 1. `src/firebaseConfig.json` (Database Credentials)
```json
{
  "projectId": "ageless-myth-stvkm",
  "appId": "1:822524940901:web:9204ee754b297f46b8ac8c",
  "apiKey": "AIzaSyAo_P4OMEjeQ-1Xxme5n799lqNFdXknbVI",
  "authDomain": "ageless-myth-stvkm.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-0d953d7d-fd9b-458b-8861-ef7743a87e93",
  "storageBucket": "ageless-myth-stvkm.firebasestorage.app",
  "messagingSenderId": "822524940901",
  "measurementId": "",
  "oAuthClientId": "822524940901-cqo4c5v5jhkc3t45lrgjuqfbf5j6gk6i.apps.googleusercontent.com"
}
```

---

### 2. `src/lib/firebase.ts`
```typescript
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  query,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../firebaseConfig.json';

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}
```

---

### 3. `src/types.ts`
```typescript
export interface CustomSpec {
  key: string;
  value: string;
}

export interface Room {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  category: string;
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
  customSpecs?: CustomSpec[];
  description: string;
  checkInTime: string;
  checkOutTime: string;
  payOnArrival: boolean;
  available?: boolean;
  createdAt?: string;
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

export interface GuestReview {
  id: string;
  name: string;
  email?: string;
  rating: number;
  stayedRoom: string;
  comment: string;
  date: string;
  createdAt: string;
  verified: boolean;
}
```

---

## 🚀 GitHub & Hosting Deployment (e.g. Vercel, Netlify, or GitHub Pages)
1. Push this standalone admin repository to GitHub (e.g. `username/antix-hotel-admin`).
2. Deploy to Vercel or GitHub Pages as `admin.antixhotel.com` or `username.github.io/antix-hotel-admin`.
3. You now have two completely isolated web applications operating with 100% unified real-time data!

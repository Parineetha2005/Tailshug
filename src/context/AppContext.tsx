import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { BRAND_ASSETS, INITIAL_SITE_CONFIG, MarketplaceProvider } from '../data/categories';

export type MascotMood = 'idle' | 'curious' | 'loading' | 'empty' | 'celebrate' | 'error';

export interface UserProfile {
  uid: string;
  displayName: string;
  role: 'customer' | 'provider';
  photoURL?: string;
}

export interface UserPrivateInfo {
  uid: string;
  email: string;
  phone?: string;
  city?: string;
  pincode?: string;
  address?: string;
}

export interface PetProfile {
  id: string;
  ownerId: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other';
  breed: string;
  ageYears: number;
  weightKg: number;
  vaccinated: boolean;
  notes?: string;
}

export interface BookingRecord {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerOwnerId: string;
  providerName: string;
  petId: string;
  petName: string;
  petSpecies: string;
  serviceName: string;
  priceInr: number;
  appointmentDate: string;
  appointmentTime: string;
  slotKey: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled' | 'rejected';
  createdAt?: unknown;
}

export interface ReviewRecord {
  id: string;
  authorId: string;
  authorName: string;
  providerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  status: 'published' | 'hidden';
  createdAt?: unknown;
}

export interface FavouriteRecord {
  id: string;
  userId: string;
  providerId: string;
  providerName: string;
  categoryTitle: string;
  city: string;
}

export interface SiteConfigState {
  phone: string;
  email: string;
  location: string;
  playStoreUrl: string;
  appStoreUrl: string;
  founderPhotoUrl: string;
}

interface AppContextType {
  user: User | null;
  profile: UserProfile | null;
  privateInfo: UserPrivateInfo | null;
  isAdmin: boolean;
  authReady: boolean;
  providers: MarketplaceProvider[];
  pets: PetProfile[];
  bookings: BookingRecord[];
  reviews: ReviewRecord[];
  favourites: FavouriteRecord[];
  siteConfig: SiteConfigState;
  mascotMood: MascotMood;
  mascotMessage: string;
  triggerMascot: (mood: MascotMood, message: string, resetAfterMs?: number) => void;
  loginWithGoogle: (preferredRole?: 'customer' | 'provider') => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    name: string,
    email: string,
    password: string,
    role: 'customer' | 'provider'
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateFounderPhoto: (dataUrl: string) => Promise<void>;
  toggleFavourite: (provider: MarketplaceProvider) => Promise<void>;
  customIcons: Record<string, string>;
  updateCustomIcon: (slug: string, dataUrl: string) => Promise<void>;
  resetCustomIcon: (slug: string) => Promise<void>;
  resetAllCustomIcons: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const LOCAL_FOUNDER_PHOTO_KEY = 'tailshug_founder_photo_v1';
export const LOCAL_CUSTOM_ICONS_KEY = 'tailshug_custom_icons_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [privateInfo, setPrivateInfo] = useState<UserPrivateInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const [providers, setProviders] = useState<MarketplaceProvider[]>([]);
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [favourites, setFavourites] = useState<FavouriteRecord[]>([]);

  const [siteConfig, setSiteConfig] = useState<SiteConfigState>(() => {
    const savedPhoto =
      typeof window !== 'undefined' ? localStorage.getItem(LOCAL_FOUNDER_PHOTO_KEY) : null;
    return {
      phone: INITIAL_SITE_CONFIG.phone,
      email: INITIAL_SITE_CONFIG.email,
      location: INITIAL_SITE_CONFIG.location,
      playStoreUrl: INITIAL_SITE_CONFIG.playStoreUrl,
      appStoreUrl: INITIAL_SITE_CONFIG.appStoreUrl,
      founderPhotoUrl: savedPhoto || BRAND_ASSETS.founderDefaultPhoto,
    };
  });

  const [customIcons, setCustomIcons] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(LOCAL_CUSTOM_ICONS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotMessage, setMascotMessage] = useState<string>(
    "Hi, pet parent! Let's find the perfect care for your furry friend."
  );

  const triggerMascot = (mood: MascotMood, message: string, resetAfterMs = 5000) => {
    setMascotMood(mood);
    setMascotMessage(message);
    if (resetAfterMs > 0) {
      window.setTimeout(() => {
        setMascotMood('idle');
      }, resetAfterMs);
    }
  };

  // Load Global Site Settings
  useEffect(() => {
    const settingsRef = doc(db, 'siteSettings', 'global');
    getDoc(settingsRef)
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSiteConfig((prev) => ({
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            location: data.location || prev.location,
            playStoreUrl: data.playStoreUrl || prev.playStoreUrl,
            appStoreUrl: data.appStoreUrl || prev.appStoreUrl,
            founderPhotoUrl: data.founderPhotoUrl || prev.founderPhotoUrl,
          }));
        }
      })
      .catch(() => {});

    // Load custom icons from Firestore if present
    const iconsRef = doc(db, 'siteSettings', 'icons');
    getDoc(iconsRef)
      .then((snap) => {
        if (snap.exists() && snap.data().icons) {
          setCustomIcons((prev) => ({ ...prev, ...snap.data().icons }));
        }
      })
      .catch(() => {});
  }, []);

  // Listen to Approved Marketplace Providers & Published Reviews
  useEffect(() => {
    const providersQuery = query(collection(db, 'providers'), where('status', '==', 'approved'));
    const unsubProviders = onSnapshot(
      providersQuery,
      (snap) => {
        const list: MarketplaceProvider[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<MarketplaceProvider, 'id'>),
        }));
        setProviders(list);
      },
      (err) => {
        console.warn('Providers listener notice:', err);
      }
    );

    const reviewsQuery = query(collection(db, 'reviews'), where('status', '==', 'published'));
    const unsubReviews = onSnapshot(
      reviewsQuery,
      (snap) => {
        const list: ReviewRecord[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ReviewRecord, 'id'>),
        }));
        setReviews(list);
      },
      (err) => {
        console.warn('Reviews listener notice:', err);
      }
    );

    return () => {
      unsubProviders();
      unsubReviews();
    };
  }, []);

  // Auth State & User Records
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setPrivateInfo(null);
        setIsAdmin(false);
        setPets([]);
        setBookings([]);
        setFavourites([]);
        setAuthReady(true);
        return;
      }

      const bootstrappedAdmin =
        currentUser.email === 'parineetha@tailshug.com' && currentUser.emailVerified === true;
      setIsAdmin(bootstrappedAdmin);

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        } else if (currentUser.emailVerified) {
          const newProfile: UserProfile = {
            uid: currentUser.uid,
            displayName: (currentUser.displayName || currentUser.email?.split('@')[0] || 'Pet Parent').slice(0, 90),
            role: 'customer',
            ...(currentUser.photoURL ? { photoURL: currentUser.photoURL.slice(0, 900) } : {}),
          };
          await setDoc(userRef, {
            ...newProfile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setProfile(newProfile);

          if (currentUser.email) {
            const piiRef = doc(db, 'users', currentUser.uid, 'private', 'pii');
            const newPii: UserPrivateInfo = {
              uid: currentUser.uid,
              email: currentUser.email.slice(0, 140),
            };
            await setDoc(piiRef, {
              ...newPii,
              updatedAt: serverTimestamp(),
            });
            setPrivateInfo(newPii);
          }
        }

        const piiRef = doc(db, 'users', currentUser.uid, 'private', 'pii');
        const piiSnap = await getDoc(piiRef);
        if (piiSnap.exists()) {
          setPrivateInfo(piiSnap.data() as UserPrivateInfo);
        }
      } catch (err) {
        console.warn('User profile sync notice:', err);
      }

      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Authenticated User Subscriptions (Pets, Bookings, Favourites)
  useEffect(() => {
    if (!authReady || !user) return;

    const petsQ = query(collection(db, 'pets'), where('ownerId', '==', user.uid));
    const unsubPets = onSnapshot(
      petsQ,
      (snap) => {
        setPets(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<PetProfile, 'id'>),
          }))
        );
      },
      (err) => console.warn('Pets listener notice:', err)
    );

    const customerBookingsQ = query(collection(db, 'bookings'), where('customerId', '==', user.uid));
    const unsubBookings = onSnapshot(
      customerBookingsQ,
      (snap) => {
        setBookings(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<BookingRecord, 'id'>),
          }))
        );
      },
      (err) => console.warn('Bookings listener notice:', err)
    );

    const favQ = query(collection(db, 'favourites'), where('userId', '==', user.uid));
    const unsubFavs = onSnapshot(
      favQ,
      (snap) => {
        setFavourites(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<FavouriteRecord, 'id'>),
          }))
        );
      },
      (err) => console.warn('Favourites listener notice:', err)
    );

    return () => {
      unsubPets();
      unsubBookings();
      unsubFavs();
    };
  }, [authReady, user]);

  const loginWithGoogle = async (preferredRole: 'customer' | 'provider' = 'customer') => {
    const cred = await signInWithPopup(auth, googleProvider);
    const u = cred.user;
    const userRef = doc(db, 'users', u.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const newProfile: UserProfile = {
        uid: u.uid,
        displayName: (u.displayName || u.email?.split('@')[0] || 'Pet Parent').slice(0, 90),
        role: preferredRole,
        ...(u.photoURL ? { photoURL: u.photoURL.slice(0, 900) } : {}),
      };
      try {
        await setDoc(userRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setProfile(newProfile);

        if (u.email) {
          const piiRef = doc(db, 'users', u.uid, 'private', 'pii');
          await setDoc(piiRef, {
            uid: u.uid,
            email: u.email.slice(0, 140),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${u.uid}`);
      }
    } else {
      setProfile(snap.data() as UserProfile);
    }

    triggerMascot('celebrate', `Welcome back to TailsHug, ${u.displayName || 'friend'}!`);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    triggerMascot('celebrate', 'Welcome back to TailsHug!');
  };

  const registerWithEmail = async (
    name: string,
    email: string,
    password: string,
    role: 'customer' | 'provider'
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(cred.user, { displayName: name.trim().slice(0, 90) });
    await sendEmailVerification(cred.user);
    setProfile({
      uid: cred.user.uid,
      displayName: name.trim().slice(0, 90),
      role,
    });
    triggerMascot(
      'celebrate',
      'Account created! Please check your inbox to verify your email address.'
    );
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const logout = async () => {
    await signOut(auth);
    triggerMascot('idle', 'See you soon! Give your furry friend a hug from us.');
  };

  const updateFounderPhoto = async (dataUrl: string) => {
    localStorage.setItem(LOCAL_FOUNDER_PHOTO_KEY, dataUrl);
    setSiteConfig((prev) => ({ ...prev, founderPhotoUrl: dataUrl }));

    if (user && isAdmin) {
      const settingsRef = doc(db, 'siteSettings', 'global');
      try {
        await setDoc(
          settingsRef,
          {
            phone: siteConfig.phone,
            email: siteConfig.email,
            location: siteConfig.location,
            playStoreUrl: siteConfig.playStoreUrl,
            appStoreUrl: siteConfig.appStoreUrl,
            founderPhotoUrl: dataUrl.slice(0, 145000),
            updatedAt: serverTimestamp(),
          },
          { merge: false }
        );
      } catch (err) {
        console.warn('Could not persist founder photo to Firestore settings:', err);
      }
    }
    triggerMascot('celebrate', "Garima & Bekky's Founder Portrait has been updated!");
  };

  const toggleFavourite = async (provider: MarketplaceProvider) => {
    if (!user) {
      triggerMascot('curious', 'Please sign in first to save your favourite providers!');
      return;
    }
    const favId = `${user.uid}_${provider.id}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
    const existingFav = favourites.find((f) => f.providerId === provider.id);
    const favRef = doc(db, 'favourites', existingFav ? existingFav.id : favId);

    try {
      if (existingFav) {
        await deleteDoc(favRef);
        triggerMascot('idle', `Removed ${provider.businessName} from saved providers.`);
      } else {
        await setDoc(favRef, {
          userId: user.uid,
          providerId: provider.id,
          providerName: provider.businessName.slice(0, 110),
          categoryTitle: provider.categoryTitle.slice(0, 90),
          city: provider.city.slice(0, 70),
          createdAt: serverTimestamp(),
        });
        triggerMascot('celebrate', `Saved ${provider.businessName} to your favourites!`);
      }
    } catch (err) {
      handleFirestoreError(
        err,
        existingFav ? OperationType.DELETE : OperationType.CREATE,
        `favourites/${favId}`
      );
    }
  };

  const updateCustomIcon = async (slug: string, dataUrl: string) => {
    const norm = slug.toLowerCase();
    const next = { ...customIcons, [norm]: dataUrl };
    setCustomIcons(next);
    try {
      localStorage.setItem(LOCAL_CUSTOM_ICONS_KEY, JSON.stringify(next));
    } catch {}
    if (user && isAdmin) {
      try {
        await setDoc(
          doc(db, 'siteSettings', 'icons'),
          { icons: next, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (err) {
        console.warn('Could not persist icons to Firestore:', err);
      }
    }
    triggerMascot('celebrate', `Updated icon for ${slug}!`);
  };

  const resetCustomIcon = async (slug: string) => {
    const norm = slug.toLowerCase();
    const next = { ...customIcons };
    delete next[norm];
    setCustomIcons(next);
    try {
      localStorage.setItem(LOCAL_CUSTOM_ICONS_KEY, JSON.stringify(next));
    } catch {}
    if (user && isAdmin) {
      try {
        await setDoc(
          doc(db, 'siteSettings', 'icons'),
          { icons: next, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch {}
    }
    triggerMascot('idle', `Reset ${slug} to default icon.`);
  };

  const resetAllCustomIcons = async () => {
    setCustomIcons({});
    try {
      localStorage.removeItem(LOCAL_CUSTOM_ICONS_KEY);
    } catch {}
    if (user && isAdmin) {
      try {
        await setDoc(
          doc(db, 'siteSettings', 'icons'),
          { icons: {}, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch {}
    }
    triggerMascot('idle', 'Reset all services to default icons.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        privateInfo,
        isAdmin,
        authReady,
        providers,
        pets,
        bookings,
        reviews,
        favourites,
        siteConfig,
        mascotMood,
        mascotMessage,
        triggerMascot,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        logout,
        updateFounderPhoto,
        toggleFavourite,
        customIcons,
        updateCustomIcon,
        resetCustomIcon,
        resetAllCustomIcons,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

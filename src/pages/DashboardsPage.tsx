import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { BRAND_ASSETS, SERVICE_CATEGORIES } from '../data/categories';
import { BookingRecord, useApp } from '../context/AppContext';
import { CategoryGraphic } from '../components/PetMascot';

/**
 * 1. Customer Dashboard (/dashboard/customer)
 */
export const CustomerDashboardPage: React.FC = () => {
  const {
    user,
    profile,
    privateInfo,
    pets,
    bookings,
    favourites,
    toggleFavourite,
    providers,
    triggerMascot,
  } = useApp();

  const [tab, setTab] = useState<'pets' | 'bookings' | 'favourites' | 'profile'>('bookings');

  // Add Pet Form
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other'>('Dog');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState(2);
  const [petWeight, setPetWeight] = useState(12);
  const [petNotes, setPetNotes] = useState('');

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<BookingRecord | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Private PII Update State
  const [phone, setPhone] = useState(privateInfo?.phone || '');
  const [city, setCity] = useState(privateInfo?.city || 'Bengaluru');
  const [pincode, setPincode] = useState(privateInfo?.pincode || '');
  const [address, setAddress] = useState(privateInfo?.address || '');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (privateInfo) {
      setPhone(privateInfo.phone || '');
      setCity(privateInfo.city || 'Bengaluru');
      setPincode(privateInfo.pincode || '');
      setAddress(privateInfo.address || '');
    }
  }, [privateInfo]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">Customer Dashboard</h1>
        <p className="text-sm text-stone-600">
          Please sign in to manage your pets, appointments, and saved providers.
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim() || !petBreed.trim()) return;
    const petId = `pet_${user.uid}_${Date.now()}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
    try {
      await setDoc(doc(db, 'pets', petId), {
        ownerId: user.uid,
        name: petName.trim().slice(0, 75),
        species: petSpecies,
        breed: petBreed.trim().slice(0, 75),
        ageYears: Number(petAge) || 1,
        weightKg: Number(petWeight) || 5,
        vaccinated: true,
        ...(petNotes.trim() ? { notes: petNotes.trim().slice(0, 480) } : {}),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setPetName('');
      setPetBreed('');
      setPetNotes('');
      triggerMascot('celebrate', `Added ${petName} to your pet profiles!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `pets/${petId}`);
    }
  };

  const handleDeletePet = async (petId: string) => {
    try {
      await deleteDoc(doc(db, 'pets', petId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `pets/${petId}`);
    }
  };

  const handleCancelBooking = async (b: BookingRecord) => {
    try {
      await updateDoc(doc(db, 'bookings', b.id), {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      });
      triggerMascot('idle', `Booking #${b.id.slice(-6)} has been cancelled.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${b.id}`);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking || reviewComment.trim().length < 5) return;
    const revId = `rev_${reviewBooking.id}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
    try {
      await setDoc(doc(db, 'reviews', revId), {
        authorId: user.uid,
        authorName: (profile?.displayName || user.displayName || 'Pet Parent').slice(0, 90),
        providerId: reviewBooking.providerId,
        bookingId: reviewBooking.id,
        rating: Number(reviewRating),
        comment: reviewComment.trim().slice(0, 950),
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setReviewBooking(null);
      setReviewComment('');
      triggerMascot('celebrate', 'Thank you for sharing your review with the TailsHug community!');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `reviews/${revId}`);
    }
  };

  const handleSaveProfilePii = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'users', user.uid, 'private', 'pii'), {
        uid: user.uid,
        email: (user.email || 'user@tailshug.com').slice(0, 140),
        ...(phone.trim() ? { phone: phone.trim().slice(0, 28) } : {}),
        ...(city.trim() ? { city: city.trim().slice(0, 75) } : {}),
        ...(pincode.trim() ? { pincode: pincode.trim().slice(0, 18) } : {}),
        ...(address.trim() ? { address: address.trim().slice(0, 290) } : {}),
        updatedAt: serverTimestamp(),
      });
      setStatusMessage('Account settings saved securely in isolated PII storage.');
      window.setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/private/pii`);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#9A4E0B] uppercase tracking-wide">
            Pet Parent Portal
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Welcome, {profile?.displayName || user.displayName || 'Pet Parent'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {pets.length} Pets · {bookings.length} Bookings · {favourites.length} Saved Providers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1 bg-[#FAF7F2] rounded-xl border border-stone-200">
          {(['bookings', 'pets', 'favourites', 'profile'] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                tab === t ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              {t === 'bookings'
                ? `Appointments (${bookings.length})`
                : t === 'pets'
                ? `My Pets (${pets.length})`
                : t === 'favourites'
                ? `Saved (${favourites.length})`
                : 'Account Settings'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Bookings */}
      {tab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">Your Appointments &amp; History</h2>
            <Link
              to="/search"
              className="px-4 py-2 rounded-xl bg-[#F69E40] text-white text-xs font-semibold"
            >
              Book New Service
            </Link>
          </div>

          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-stone-500">#{b.id.slice(-8)}</span>
                      <span className="font-semibold uppercase text-[#1F4D3A]">{b.status}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">{b.providerName}</h3>
                    <p className="text-sm text-stone-700">
                      {b.serviceName} · Pet: <span className="font-semibold">{b.petName}</span> (
                      {b.petSpecies})
                    </p>
                    <p className="text-xs font-mono text-stone-600">
                      Date: {b.appointmentDate} at {b.appointmentTime} · ₹{b.priceInr}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <Link
                      to={`/provider/${b.providerId}`}
                      className="text-stone-700 hover:text-[#F69E40] font-semibold"
                    >
                      View Provider
                    </Link>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setReviewBooking(b)}
                        className="text-[#F69E40] font-semibold hover:underline"
                      >
                        Leave Review
                      </button>
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(b)}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
              <p className="text-sm text-stone-600">You have no bookings yet.</p>
              <Link
                to="/search"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-xs font-semibold"
              >
                Explore Pet Care Services
              </Link>
            </div>
          )}

          {reviewBooking && (
            <form
              onSubmit={handleSubmitReview}
              className="bg-[#FFF7ED] rounded-2xl border border-orange-200 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900">
                  Write a Review for {reviewBooking.providerName}
                </h3>
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="text-xs text-stone-500"
                >
                  Close
                </button>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-stone-700">Rating (1–5):</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-mono"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                rows={3}
                required
                minLength={5}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this provider..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#F69E40] text-white text-xs font-semibold"
              >
                Publish Review
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: Pets */}
      {tab === 'pets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-bold text-stone-900">Your Pet Profiles</h2>
            {pets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 flex items-start justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-xs text-[#F69E40] font-semibold">{pet.species}</p>
                      <h3 className="text-lg font-bold text-stone-900">{pet.name}</h3>
                      <p className="text-xs text-stone-600">
                        {pet.breed} · {pet.ageYears} yrs · {pet.weightKg} kg
                      </p>
                      {pet.notes && <p className="text-xs text-stone-500 pt-1">{pet.notes}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePet(pet.id)}
                      aria-label="Delete pet profile"
                      className="text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-600 bg-white rounded-2xl border border-stone-200 p-6">
                Add your furry companions on the right so you can book services in one click.
              </p>
            )}
          </div>

          <form
            onSubmit={handleAddPet}
            className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 space-y-4 h-fit"
          >
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#F69E40]" /> Add a Pet Profile
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Pet Name (e.g. Bekky)"
                className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
              />
              <select
                value={petSpecies}
                onChange={(e) =>
                  setPetSpecies(e.target.value as 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other')
                }
                className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={petBreed}
                onChange={(e) => setPetBreed(e.target.value)}
                placeholder="Breed"
                className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
              />
              <input
                type="number"
                min={0}
                max={40}
                value={petAge}
                onChange={(e) => setPetAge(Number(e.target.value))}
                placeholder="Age (yrs)"
                className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-mono"
              />
              <input
                type="number"
                min={0}
                max={120}
                value={petWeight}
                onChange={(e) => setPetWeight(Number(e.target.value))}
                placeholder="Weight (kg)"
                className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-mono"
              />
            </div>
            <input
              type="text"
              value={petNotes}
              onChange={(e) => setPetNotes(e.target.value)}
              placeholder="Allergies, temperament, or medical notes (optional)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#F69E40] text-white text-xs font-semibold"
            >
              Save Pet Profile
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Saved Providers */}
      {tab === 'favourites' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-900">Saved Providers</h2>
          {favourites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favourites.map((fav) => {
                const fullProvider = providers.find((p) => p.id === fav.providerId);
                return (
                  <div
                    key={fav.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3"
                  >
                    <p className="text-xs text-stone-500">
                      {fav.categoryTitle} · {fav.city}
                    </p>
                    <h3 className="text-lg font-bold text-stone-900">{fav.providerName}</h3>
                    <div className="pt-2 flex items-center justify-between text-xs font-semibold">
                      <Link
                        to={`/provider/${fav.providerId}`}
                        className="text-[#F69E40] hover:underline"
                      >
                        View Profile →
                      </Link>
                      {fullProvider && (
                        <button
                          type="button"
                          onClick={() => toggleFavourite(fullProvider)}
                          className="text-stone-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-stone-600 bg-white rounded-2xl border border-stone-200 p-6">
              You haven’t saved any providers yet. Click the heart icon on any provider card to
              bookmark them here.
            </p>
          )}
        </div>
      )}

      {/* TAB 4: Isolated PII Account Settings */}
      {tab === 'profile' && (
        <form
          onSubmit={handleSaveProfilePii}
          className="max-w-xl bg-white rounded-2xl border border-stone-200 p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-stone-900">Private Contact &amp; Address Settings</h2>
          <p className="text-xs text-stone-500">
            Stored in your isolated private subcollection (<code>/users/{user.uid}/private/pii</code>
            ), accessible only to you.
          </p>
          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              {statusMessage}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-xs font-semibold"
          >
            Save Account Settings
          </button>
        </form>
      )}
    </div>
  );
};

/**
 * 2. Provider Dashboard (/dashboard/provider)
 */
export const ProviderDashboardPage: React.FC = () => {
  const { user, triggerMascot } = useApp();
  const [providerBookings, setProviderBookings] = useState<BookingRecord[]>([]);
  const [appStatus, setAppStatus] = useState<string>('not_submitted');
  const [businessName, setBusinessName] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    const appQ = query(
      collection(db, 'providerApplications'),
      where('applicantId', '==', user.uid)
    );
    getDocs(appQ)
      .then((snap) => {
        if (!snap.empty) {
          const d = snap.docs[0].data();
          setAppStatus(d.status || 'submitted');
          setBusinessName(d.businessName || '');
        }
      })
      .catch(() => {});

    const bQ = query(collection(db, 'bookings'), where('providerOwnerId', '==', user.uid));
    getDocs(bQ)
      .then((snap) => {
        setProviderBookings(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<BookingRecord, 'id'>),
          }))
        );
      })
      .catch(() => {});
  }, [user]);

  const handleUpdateBookingStatus = async (
    b: BookingRecord,
    newStatus: 'confirmed' | 'rejected' | 'completed'
  ) => {
    try {
      await updateDoc(doc(db, 'bookings', b.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      setProviderBookings((prev) =>
        prev.map((item) => (item.id === b.id ? { ...item, status: newStatus } : item))
      );
      triggerMascot('celebrate', `Updated booking #${b.id.slice(-6)} to ${newStatus}!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${b.id}`);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">Service Provider Dashboard</h1>
        <p className="text-sm text-stone-600">
          Sign in to track your verification status and manage incoming pet-care bookings.
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-8">
      <div className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#1F4D3A] uppercase tracking-wide">
            Service Provider Portal
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            {businessName || 'Provider Practice Overview'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Verification &amp; Onboarding Status:{' '}
            <span className="font-mono font-bold uppercase text-[#9A4E0B]">{appStatus}</span>
          </p>
        </div>

        <Link
          to="/become-a-provider"
          className="px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-xs font-semibold whitespace-nowrap self-start"
        >
          {appStatus === 'not_submitted' ? 'Complete Onboarding Wizard' : 'Update Onboarding Profile'}
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 space-y-4">
        <h2 className="text-xl font-bold text-stone-900">
          Incoming Appointment Requests ({providerBookings.length})
        </h2>
        {providerBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providerBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-[#FAF7F2] border border-stone-200 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">Customer: {b.customerName}</span>
                  <span className="font-mono uppercase text-[#1F4D3A]">{b.status}</span>
                </div>
                <p className="text-sm text-stone-700">
                  {b.serviceName} · Pet: {b.petName} ({b.petSpecies})
                </p>
                <p className="text-xs font-mono text-stone-600">
                  {b.appointmentDate} at {b.appointmentTime} · ₹{b.priceInr}
                </p>
                {b.notes && <p className="text-xs text-stone-500">Notes: {b.notes}</p>}

                {b.status === 'pending' && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateBookingStatus(b, 'confirmed')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1F4D3A] text-white text-xs font-semibold"
                    >
                      Accept Booking
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateBookingStatus(b, 'rejected')}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold"
                    >
                      Decline
                    </button>
                  </div>
                )}
                {b.status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateBookingStatus(b, 'completed')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F69E40] text-white text-xs font-semibold"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-600">
            No incoming bookings yet. Once your provider profile is approved by the TailsHug
            administrator, customer requests will appear here in real time.
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * 3. Protected Administrator Dashboard (/dashboard/admin)
 */
export const AdminDashboardPage: React.FC = () => {
  const {
    user,
    isAdmin,
    providers,
    updateFounderPhoto,
    siteConfig,
    customIcons,
    triggerMascot,
  } = useApp();


  const [applications, setApplications] = useState<
    {
      id: string;
      applicantId: string;
      applicantName: string;
      businessName: string;
      categorySlug: string;
      categoryTitle: string;
      subcategories: string[];
      services: {
        name: string;
        subcategory: string;
        priceInr: number;
        durationMinutes: number;
        description: string;
      }[];
      city: string;
      area: string;
      address: string;
      pincode: string;
      description: string;
      experienceYears: number;
      operatingHours: string;
      cancellationPolicy: string;
      startingPriceInr: number;
      status: string;
      privateKyc?: {
        phone: string;
        email: string;
        idDocumentType: string;
        idDocumentRef: string;
        licenseDocumentName?: string;
      };
    }[]
  >([]);

  const [enquiries, setEnquiries] = useState<
    {
      id: string;
      name: string;
      email: string;
      category: string;
      subject: string;
      message: string;
      status: string;
    }[]
  >([]);

  const [seeding, setSeeding] = useState(false);

  const loadAdminData = async () => {
    if (!user || !isAdmin) return;
    try {
      const appSnap = await getDocs(collection(db, 'providerApplications'));
      const appList = await Promise.all(
        appSnap.docs.map(async (d) => {
          const data = d.data();
          let privateKyc = undefined;
          try {
            const kycSnap = await getDoc(doc(db, 'providerApplications', d.id, 'privateDocs', 'kyc'));
            if (kycSnap.exists()) {
              privateKyc = kycSnap.data() as {
                phone: string;
                email: string;
                idDocumentType: string;
                idDocumentRef: string;
                licenseDocumentName?: string;
              };
            }
          } catch {
            // Ignore
          }
          return {
            id: d.id,
            ...(data as any),
            privateKyc,
          };
        })
      );
      setApplications(appList);

      const enqSnap = await getDocs(collection(db, 'enquiries'));
      setEnquiries(
        enqSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }))
      );
    } catch (err) {
      console.warn('Admin data load notice:', err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user, isAdmin]);

  if (!user || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">Restricted Administrator Console</h1>
        <p className="text-sm text-stone-600">
          Administrative permissions are enforced on the server and in Firestore security rules. Sign
          in with the verified administrator account (<code>parineetha@tailshug.com</code>) to
          access provider verification and site governance.
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
        >
          Sign In as Administrator
        </Link>
      </div>
    );
  }

  const handleApproveApplication = async (app: (typeof applications)[0]) => {
    const providerId = `prov_${app.id}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
    try {
      await updateDoc(doc(db, 'providerApplications', app.id), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'providers', providerId), {
        ownerId: app.applicantId,
        businessName: app.businessName.slice(0, 115),
        categorySlug: app.categorySlug,
        categoryTitle: app.categoryTitle,
        subcategories: app.subcategories.slice(0, 10),
        description: app.description.slice(0, 1950),
        city: app.city.slice(0, 75),
        area: app.area.slice(0, 95),
        address: app.address.slice(0, 290),
        pincode: app.pincode.slice(0, 12),
        publicPhone: (app.privateKyc?.phone || '+91 93539 78831').slice(0, 24),
        publicEmail: (app.privateKyc?.email || 'care@tailshug.com').slice(0, 140),
        startingPriceInr: Number(app.startingPriceInr) || 500,
        servicesOffered: app.services.slice(0, 20),
        operatingHours: app.operatingHours.slice(0, 190),
        cancellationPolicy: app.cancellationPolicy.slice(0, 480),
        experienceYears: Number(app.experienceYears) || 2,
        coverImage: BRAND_ASSETS.groomingBanner,
        verified: true,
        status: 'approved',
        ratingAvg: 5.0,
        reviewCount: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await loadAdminData();
      triggerMascot('celebrate', `Approved ${app.businessName} and published to TailsHug!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `providers/${providerId}`);
    }
  };

  const handleRejectApplication = async (appId: string) => {
    try {
      await updateDoc(doc(db, 'providerApplications', appId), {
        status: 'rejected',
        rejectionReason: 'Incomplete verification credentials.',
        updatedAt: serverTimestamp(),
      });
      await loadAdminData();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `providerApplications/${appId}`);
    }
  };

  const handleSeedVerifiedProviders = async () => {
    setSeeding(true);
    try {
      const sampleProviders = [
        {
          id: 'th_bengaluru_grooming_studio',
          businessName: 'TailsHug Signature Grooming & Spa Studio',
          categorySlug: 'grooming-and-hygiene',
          categoryTitle: 'Grooming and Hygiene',
          subcategories: ['Grooming', 'Bathing', 'Dental care'],
          description:
            'Gentle, fear-free dog and cat grooming studio in Indiranagar using botanical shampoos, warm hydro-massage baths, and sanitized styling tools.',
          city: 'Bengaluru',
          area: 'Indiranagar',
          address: '12th Main Road, HAL 2nd Stage, Indiranagar',
          pincode: '560038',
          publicPhone: '+91 93539 78831',
          publicEmail: 'care@tailshug.com',
          startingPriceInr: 899,
          servicesOffered: [
            {
              name: 'Full Breed Styling & Warm Botanical Bath',
              subcategory: 'Grooming',
              priceInr: 1299,
              durationMinutes: 90,
              description: 'Bath, blow-dry, breed-specific haircut, ear cleaning, and nail trim.',
            },
            {
              name: 'Gentle Feline Dry & Coat De-shedding',
              subcategory: 'Bathing',
              priceInr: 899,
              durationMinutes: 60,
              description: 'Calm cat-friendly brushing, sanitary trim, and paw pad care.',
            },
          ],
          operatingHours: 'Mon–Sun: 9:30 AM – 7:30 PM',
          cancellationPolicy: 'Free cancellation up to 12 hours before appointment.',
          experienceYears: 6,
          coverImage: BRAND_ASSETS.groomingBanner,
        },
        {
          id: 'th_koramangala_vet_wellness',
          businessName: 'Koramangala Compassionate Pet Vet & Preventive Clinic',
          categorySlug: 'health',
          categoryTitle: 'Health',
          subcategories: ['Veterinary care', 'Vaccination', 'Pet insurance'],
          description:
            'Comprehensive veterinary consultations, puppy & kitten vaccination schedules, microchipping, and pet insurance guidance in Koramangala.',
          city: 'Bengaluru',
          area: 'Koramangala',
          address: '4th Block, 80 Feet Road, Koramangala',
          pincode: '560034',
          publicPhone: '+91 93539 78831',
          publicEmail: 'care@tailshug.com',
          startingPriceInr: 650,
          servicesOffered: [
            {
              name: 'Comprehensive Vet Wellness Checkup',
              subcategory: 'Veterinary care',
              priceInr: 650,
              durationMinutes: 30,
              description: 'Full physical exam, weight & nutrition review, and preventive consult.',
            },
            {
              name: 'Annual Booster Vaccination Package',
              subcategory: 'Vaccination',
              priceInr: 1450,
              durationMinutes: 30,
              description: 'Core canine/feline vaccination with digital certificate.',
            },
          ],
          operatingHours: 'Mon–Sun: 8:30 AM – 9:00 PM',
          cancellationPolicy: 'Free rescheduling or cancellation up to 6 hours prior.',
          experienceYears: 9,
          coverImage: BRAND_ASSETS.vetBanner,
        },
        {
          id: 'th_whitefield_home_boarding',
          businessName: 'Bekky’s Cozy Paws Home Boarding & Daycare',
          categorySlug: 'boarding-and-daycare',
          categoryTitle: 'Boarding and Daycare',
          subcategories: ['Boarding', 'Daycare', 'Pet sitting'],
          description:
            'Cage-free, sunlit home boarding and supervised daycare in Whitefield with separate quiet lounges for cats and garden play areas for dogs.',
          city: 'Bengaluru',
          area: 'Whitefield',
          address: 'Palm Meadows Layout, Whitefield',
          pincode: '560066',
          publicPhone: '+91 93539 78831',
          publicEmail: 'care@tailshug.com',
          startingPriceInr: 750,
          servicesOffered: [
            {
              name: '24-Hour Cage-Free Home Boarding',
              subcategory: 'Boarding',
              priceInr: 1100,
              durationMinutes: 1440,
              description: 'Home-cooked meals, supervised play, and thrice-daily WhatsApp video updates.',
            },
            {
              name: 'Full-Day Supervised Social Daycare',
              subcategory: 'Daycare',
              priceInr: 750,
              durationMinutes: 480,
              description: '8 hours of structured play, nap time, and socialization.',
            },
          ],
          operatingHours: 'Mon–Sun: 7:00 AM – 9:00 PM',
          cancellationPolicy: 'Full refund up to 24 hours before check-in.',
          experienceYears: 5,
          coverImage: BRAND_ASSETS.boardingBanner,
        },
      ];

      for (const sp of sampleProviders) {
        await setDoc(doc(db, 'providers', sp.id), {
          ownerId: user.uid,
          businessName: sp.businessName,
          categorySlug: sp.categorySlug,
          categoryTitle: sp.categoryTitle,
          subcategories: sp.subcategories,
          description: sp.description,
          city: sp.city,
          area: sp.area,
          address: sp.address,
          pincode: sp.pincode,
          publicPhone: sp.publicPhone,
          publicEmail: sp.publicEmail,
          startingPriceInr: sp.startingPriceInr,
          servicesOffered: sp.servicesOffered,
          operatingHours: sp.operatingHours,
          cancellationPolicy: sp.cancellationPolicy,
          experienceYears: sp.experienceYears,
          coverImage: sp.coverImage,
          verified: true,
          status: 'approved',
          ratingAvg: 4.9,
          reviewCount: 12,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      triggerMascot(
        'celebrate',
        'Published 3 verified TailsHug Marketplace Providers to Firestore!'
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'providers');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="bg-[#18181B] text-white rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#F69E40] uppercase tracking-wide">
            Protected Administrator Console ({user.email})
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            TailsHug Marketplace Governance &amp; KYC Review
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Approved Providers: {providers.length} · Pending/Total Applications:{' '}
            {applications.length} · Support Enquiries: {enquiries.length}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSeedVerifiedProviders}
          disabled={seeding}
          className="px-5 py-2.5 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-xs font-semibold whitespace-nowrap"
        >
          {seeding ? 'Publishing...' : 'Publish Sample Verified Providers'}
        </button>
      </div>

      {/* Founder Photo Manager */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={siteConfig.founderPhotoUrl}
            alt="Garima & Bekky Founder Portrait"
            className="w-20 h-24 rounded-2xl object-cover border border-stone-200"
          />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-stone-900">
              Founder’s Note Portrait (Garima &amp; Bekky)
            </h2>
            <p className="text-xs text-stone-600 max-w-lg">
              Displayed on the Homepage and About Us page. You can upload your exact{' '}
              <code>garima pic.jpeg</code> photo here to update it across the entire platform.
            </p>
          </div>
        </div>
        <label className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 hover:border-[#F69E40] text-xs font-semibold text-stone-800 cursor-pointer whitespace-nowrap">
          Upload Founder Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  updateFounderPhoto(reader.result);
                }
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
      </div>

      {/* Official Service Icons */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            TailsHug Official Service Icons ({SERVICE_CATEGORIES.length} Services)
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            The authentic brand gradient icons verified across all 12 TailsHug pet disciplines.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {SERVICE_CATEGORIES.map((cat) => (
            <div
              key={cat.slug}
              className="p-3 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 flex flex-col items-center text-center gap-2"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl border border-stone-200/80 p-1 shadow-xs">
                <CategoryGraphic slug={cat.slug} className="w-10 h-10" showBg={false} />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-xs font-bold text-stone-900 truncate">{cat.title}</p>
                <p className="text-[10px] text-stone-500 font-mono">Service {cat.number}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provider Applications & Private KYC Review */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 space-y-5">
        <h2 className="text-xl font-bold text-stone-900">
          Provider Onboarding Applications &amp; Private Document Review
        </h2>
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-[#FAF7F2] border border-stone-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-[#9A4E0B]">
                      {app.categoryTitle} · {app.city}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900">
                      {app.businessName} (Applicant: {app.applicantName})
                    </h3>
                  </div>
                  <span className="text-xs font-mono uppercase font-bold text-stone-800">
                    Status: {app.status}
                  </span>
                </div>

                <p className="text-xs text-stone-600">{app.description}</p>

                {app.privateKyc && (
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
                    <p className="font-bold text-[#1F4D3A] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Restricted Private KYC Record:
                    </p>
                    <p>
                      ID Type: {app.privateKyc.idDocumentType} · Reference:{' '}
                      <span className="font-mono">{app.privateKyc.idDocumentRef}</span> · Phone:{' '}
                      {app.privateKyc.phone}
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-3">
                  {app.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleApproveApplication(app)}
                      className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve &amp; Publish Provider
                    </button>
                  )}
                  {app.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleRejectApplication(app.id)}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-600">No provider applications submitted yet.</p>
        )}
      </div>

      {/* Support Enquiries */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 space-y-4">
        <h2 className="text-xl font-bold text-stone-900">
          Customer &amp; Partner Support Enquiries ({enquiries.length})
        </h2>
        {enquiries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>{enq.category}</span>
                  <span className="font-mono uppercase">{enq.status}</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900">{enq.subject}</h3>
                <p className="text-xs text-stone-700">{enq.message}</p>
                <p className="text-[11px] text-stone-500 pt-1">
                  From: {enq.name} ({enq.email})
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-600">No support enquiries received yet.</p>
        )}
      </div>

    </div>
  );
};

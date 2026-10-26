import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { BRAND_ASSETS } from '../data/categories';
import { useApp } from '../context/AppContext';
import { CategoryGraphic, IllustratedDogMascot } from '../components/PetMascot';

/**
 * 1. Registered TailsHug Provider Profile Page (/provider/:id)
 */
export const ProviderProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { providers, reviews, favourites, toggleFavourite } = useApp();

  const provider = providers.find((p) => p.id === id);
  const providerReviews = reviews.filter((r) => r.providerId === id);

  if (!provider) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold text-stone-900">Provider Profile Not Found</h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          This provider profile may still be under administrator review or does not exist.
        </p>
        <Link
          to="/search"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
        >
          Back to Search
        </Link>
      </div>
    );
  }

  const isSaved = favourites.some((f) => f.providerId === provider.id);

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-10">
      {/* Cover & Summary Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
        <div className="h-56 sm:h-72 w-full bg-stone-900 relative">
          <img
            src={provider.coverImage || BRAND_ASSETS.groomingBanner}
            alt={provider.businessName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-[#1F4D3A] inline-flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                {provider.verified ? 'Verified TailsHug Provider' : 'Registered TailsHug Provider'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-medium text-stone-800">
                <CategoryGraphic slug={provider.categorySlug} className="w-4 h-4 shrink-0" showBg={false} />
                {provider.categoryTitle}
              </span>
              <span aria-hidden="true">·</span>
              <span>{provider.experienceYears} yrs experience</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
              {provider.businessName}
            </h1>

            <p className="text-sm text-stone-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#F69E40] shrink-0" />
              {provider.address}, {provider.area}, {provider.city} – {provider.pincode}
            </p>

            <p className="text-base text-stone-700 leading-relaxed pt-2">{provider.description}</p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs text-stone-600">
              <span className="font-semibold text-stone-800">Subcategories offered:</span>
              <span>{provider.subcategories.join(' · ')}</span>
            </div>
          </div>

          {/* Contiguous Booking & Contact Action Box */}
          <div className="lg:col-span-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-stone-500">Starting Price</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                  ₹{provider.startingPriceInr}
                </span>
              </div>

              <div className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-200">
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#F69E40]" />
                  <span>Hours: {provider.operatingHours}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#F69E40]" />
                  <a href={`tel:${provider.publicPhone}`} className="hover:underline">
                    {provider.publicPhone}
                  </a>
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                to={`/book/${provider.id}`}
                className="block w-full text-center px-5 py-3 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-sm font-semibold transition-colors"
              >
                Request Appointment
              </Link>
              <button
                type="button"
                onClick={() => toggleFavourite(provider)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#F69E40] text-xs font-semibold text-stone-800 flex items-center justify-center gap-1.5"
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                {isSaved ? 'Saved in Favourites' : 'Save Provider'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services & Pricing Menu + Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8 space-y-5">
            <h2 className="text-2xl font-bold text-stone-900">Services &amp; Pricing (INR)</h2>
            <div className="divide-y divide-stone-200">
              {provider.servicesOffered.map((svc, idx) => (
                <div
                  key={idx}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900">{svc.name}</h3>
                      <span className="text-xs text-stone-500">· {svc.subcategory}</span>
                    </div>
                    <p className="text-xs text-stone-600">{svc.description}</p>
                    <p className="text-xs text-stone-400">
                      Estimated duration: {svc.durationMinutes} mins
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-base font-bold font-mono tabular-nums text-stone-900">
                      ₹{svc.priceInr}
                    </span>
                    <Link
                      to={`/book/${provider.id}?service=${encodeURIComponent(svc.name)}`}
                      className="px-4 py-2 rounded-lg bg-[#FFF7ED] text-[#9A4E0B] hover:bg-[#F69E40] hover:text-white text-xs font-semibold transition-colors"
                    >
                      Select
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genuine Customer Reviews */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8 space-y-5">
            <h2 className="text-2xl font-bold text-stone-900">
              Customer Reviews ({providerReviews.length})
            </h2>
            {providerReviews.length > 0 ? (
              <div className="space-y-4">
                {providerReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">{rev.authorName}</span>
                      <span className="font-mono inline-flex items-center gap-1 text-stone-800">
                        <Star className="w-3.5 h-3.5 text-[#F69E40] fill-[#F69E40]" />
                        {rev.rating}/5
                      </span>
                    </div>
                    <p className="text-sm text-stone-700">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-600">
                No customer reviews have been submitted for this provider yet. Only pet parents with
                a real booking can publish a review.
              </p>
            )}
          </div>
        </div>

        {/* Policies & FAQ Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <h3 className="text-lg font-bold text-stone-900">Cancellation Policy</h3>
            <p className="text-sm text-stone-600 leading-relaxed">{provider.cancellationPolicy}</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <h3 className="text-lg font-bold text-stone-900">Privacy &amp; Safety</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Identity documents and private payout details submitted during onboarding are held in
              restricted storage and are never displayed on public profiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. External Google Business Details Page (/google-places/:placeId)
 */
export const GooglePlaceDetailsPage: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const [place, setPlace] = useState<{
    placeId: string;
    name: string;
    category: string;
    subcategory: string;
    address: string;
    phone: string;
    website: string;
    googleMapsUrl: string;
    rating: number;
    userRatingCount: number;
    openNow: boolean | null;
    openingHoursText: string[];
    summary: string;
    reviews?: { authorName: string; rating: number; text: string; relativeTime: string }[];
  } | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!placeId) return;
    setLoading(true);
    fetch(`/api/places/${encodeURIComponent(placeId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.place) setPlace(data.place);
        setDemoMode(Boolean(data.demoMode));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [placeId]);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl border border-stone-200 p-10 animate-pulse space-y-4">
          <div className="h-4 w-40 bg-stone-200 rounded" />
          <div className="h-8 w-96 bg-stone-200 rounded" />
          <div className="h-20 w-full bg-stone-100 rounded" />
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold text-stone-900">Business Listing Unavailable</h1>
        <Link
          to="/search"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
        >
          Return to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-8">
      {/* Clear Attribution & External Listing Notice */}
      <div className="bg-[#FFF7ED] border border-orange-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#9A4E0B] uppercase">
            External Google Maps Listing {demoMode ? '· Demo Preview' : ''}
          </p>
          <p className="text-xs text-stone-700">
            This business is sourced from Google Maps discovery and is not yet a registered or
            verified TailsHug marketplace provider. Please contact the business directly via phone or
            website.
          </p>
        </div>
        <Link
          to="/become-a-provider"
          className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 hover:border-[#F69E40] whitespace-nowrap shrink-0"
        >
          Own this business? Join TailsHug →
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span>{place.category}</span>
            <span aria-hidden="true">·</span>
            <span>{place.subcategory}</span>
            {place.rating > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-stone-800 inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#F69E40] fill-[#F69E40]" />
                  {place.rating.toFixed(1)} ({place.userRatingCount} Google ratings)
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl font-bold text-stone-900">{place.name}</h1>
          <p className="text-sm text-stone-600">{place.address}</p>
          {place.summary && (
            <p className="text-base text-stone-700 leading-relaxed">{place.summary}</p>
          )}

          {place.openingHoursText && place.openingHoursText.length > 0 && (
            <div className="pt-4 border-t border-stone-200 space-y-2">
              <h2 className="text-sm font-bold text-stone-900">Opening Hours</h2>
              <ul className="space-y-1 text-xs text-stone-600">
                {place.openingHoursText.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 p-6 space-y-4 h-fit">
          <h2 className="text-base font-bold text-stone-900">Direct Business Contact</h2>
          {place.phone ? (
            <a
              href={`tel:${place.phone}`}
              className="w-full px-4 py-3 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call {place.phone}
            </a>
          ) : (
            <p className="text-xs text-stone-500">Telephone number not listed on Google Maps.</p>
          )}

          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#F69E40] text-xs font-semibold text-stone-800 flex items-center justify-center gap-1.5"
            >
              Visit Official Website <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#F69E40] text-xs font-semibold text-stone-800 flex items-center justify-center gap-1.5"
          >
            Open in Google Maps ↗
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. Real Booking Workflow (/book/:providerId)
 */
export const BookingPage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { user, profile, providers, pets, bookings, triggerMascot, mascotMood } = useApp();

  const provider = providers.find((p) => p.id === providerId);

  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');

  // Quick inline pet creation if user has no pets yet
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<'Dog' | 'Cat'>('Dog');
  const [newPetBreed, setNewPetBreed] = useState('Indie');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingConfirmedId, setBookingConfirmedId] = useState('');

  useEffect(() => {
    if (pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  if (!provider) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">
          In-Platform Booking Requires a Registered TailsHug Provider
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Only registered and approved TailsHug providers have configured booking workflows.
        </p>
        <Link
          to="/search"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
        >
          Browse Providers
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-5">
        <IllustratedDogMascot mood="curious" size="lg" />
        <h1 className="text-2xl font-bold text-stone-900">
          Sign In to Book with {provider.businessName}
        </h1>
        <p className="text-sm text-stone-600">
          Please log in to select your pet profile and submit your appointment request.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
        >
          Sign In to Continue
        </Link>
      </div>
    );
  }

  const chosenService =
    provider.servicesOffered[selectedServiceIndex] || provider.servicesOffered[0];

  const TIME_SLOTS = ['09:30 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:30 PM'];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user.emailVerified) {
      setError('Please verify your email address before submitting a booking request.');
      return;
    }

    const slotKey = `${provider.id}_${appointmentDate}_${appointmentTime}`
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 120);

    // Double-booking conflict check against active bookings
    const conflict = bookings.some(
      (b) =>
        b.slotKey === slotKey &&
        (b.status === 'pending' || b.status === 'confirmed' || b.status === 'rescheduled')
    );
    if (conflict) {
      setError('This time slot is already requested. Please pick another time slot.');
      triggerMascot('curious', 'That time slot is already taken—try picking another time!');
      return;
    }

    setSubmitting(true);
    try {
      let targetPetId = selectedPetId;
      let targetPetName = '';
      let targetPetSpecies = 'Dog';

      if (pets.length === 0) {
        if (!newPetName.trim()) {
          setError('Please enter your pet’s name.');
          setSubmitting(false);
          return;
        }
        const createdPetId = `pet_${user.uid}_${Date.now()}`.slice(0, 100);
        await setDoc(doc(db, 'pets', createdPetId), {
          ownerId: user.uid,
          name: newPetName.trim().slice(0, 75),
          species: newPetSpecies,
          breed: (newPetBreed.trim() || 'Companion').slice(0, 75),
          ageYears: 2,
          weightKg: 10,
          vaccinated: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        targetPetId = createdPetId;
        targetPetName = newPetName.trim().slice(0, 75);
        targetPetSpecies = newPetSpecies;
      } else {
        const foundPet = pets.find((p) => p.id === selectedPetId) || pets[0];
        targetPetId = foundPet.id;
        targetPetName = foundPet.name;
        targetPetSpecies = foundPet.species;
      }

      const bookingId = `bk_${Date.now()}_${user.uid.slice(0, 8)}`.replace(
        /[^a-zA-Z0-9_-]/g,
        '_'
      );

      await setDoc(doc(db, 'bookings', bookingId), {
        customerId: user.uid,
        customerName: (profile?.displayName || user.displayName || 'Pet Parent').slice(0, 90),
        providerId: provider.id,
        providerOwnerId: provider.ownerId,
        providerName: provider.businessName.slice(0, 110),
        petId: targetPetId,
        petName: targetPetName.slice(0, 75),
        petSpecies: targetPetSpecies.slice(0, 35),
        serviceName: chosenService.name.slice(0, 110),
        priceInr: Number(chosenService.priceInr) || provider.startingPriceInr,
        appointmentDate,
        appointmentTime,
        slotKey,
        ...(notes.trim() ? { notes: notes.trim().slice(0, 480) } : {}),
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setBookingConfirmedId(bookingId);
      triggerMascot(
        'celebrate',
        `Woof! Booking request #${bookingId.slice(-6)} sent to ${provider.businessName}!`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'bookings');
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingConfirmedId) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-14">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-5">
          <IllustratedDogMascot mood={mascotMood} size="lg" />
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F4D3A]">
            <CheckCircle2 className="w-4 h-4" /> Booking Request Submitted (Pay Directly at Service)
          </div>
          <h1 className="text-3xl font-bold text-stone-900">
            Appointment Requested with {provider.businessName}
          </h1>
          <p className="text-sm text-stone-600">
            Reference ID: <span className="font-mono font-semibold">{bookingConfirmedId}</span> ·{' '}
            {chosenService.name} on {appointmentDate} at {appointmentTime} (₹
            {chosenService.priceInr})
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/customer')}
              className="px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
            >
              View in Customer Dashboard
            </button>
            <Link
              to={`/provider/${provider.id}`}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700"
            >
              Back to Provider Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div>
        <Link to={`/provider/${provider.id}`} className="text-xs text-[#F69E40] hover:underline">
          ← Back to {provider.businessName}
        </Link>
        <h1 className="text-3xl font-bold text-stone-900 mt-2">
          Request Appointment · {provider.businessName}
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Booking-Request &amp; Pay-Directly Workflow · Currency: INR (₹)
        </p>
      </div>

      <form
        onSubmit={handleBookingSubmit}
        className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 space-y-6"
      >
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
            {error}
          </div>
        )}

        {/* Step 1: Select Service */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-stone-900">1. Select a Service</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {provider.servicesOffered.map((svc, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setSelectedServiceIndex(idx)}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  selectedServiceIndex === idx
                    ? 'border-[#F69E40] bg-[#FFF7ED]'
                    : 'border-stone-200 bg-[#FAF7F2] hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>{svc.name}</span>
                  <span className="font-mono tabular-nums">₹{svc.priceInr}</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">{svc.subcategory}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select or Add Pet */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-stone-900">2. Select Your Pet</label>
          {pets.length > 0 ? (
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species} · {pet.breed})
                </option>
              ))}
            </select>
          ) : (
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={newPetName}
                onChange={(e) => setNewPetName(e.target.value)}
                placeholder="Your Pet's Name (e.g. Bruno)"
                className="px-3.5 py-2.5 rounded-lg bg-white border border-stone-200 text-sm"
              />
              <select
                value={newPetSpecies}
                onChange={(e) => setNewPetSpecies(e.target.value as 'Dog' | 'Cat')}
                className="px-3.5 py-2.5 rounded-lg bg-white border border-stone-200 text-sm"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
              <input
                type="text"
                value={newPetBreed}
                onChange={(e) => setNewPetBreed(e.target.value)}
                placeholder="Breed (e.g. Indie / Persian)"
                className="px-3.5 py-2.5 rounded-lg bg-white border border-stone-200 text-sm"
              />
            </div>
          )}
        </div>

        {/* Step 3: Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="book-date" className="block text-sm font-bold text-stone-900">
              3. Preferred Date
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200">
              <Calendar className="w-4 h-4 text-[#F69E40]" />
              <input
                id="book-date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-900">4. Preferred Time Slot</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setAppointmentTime(slot)}
                  className={`py-2 px-2 rounded-lg text-xs font-mono border transition-colors ${
                    appointmentTime === slot
                      ? 'bg-[#F69E40] text-white border-[#F69E40]'
                      : 'bg-[#FAF7F2] text-stone-700 border-stone-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 5: Care Instructions */}
        <div className="space-y-2">
          <label htmlFor="book-notes" className="block text-sm font-bold text-stone-900">
            5. Care Notes or Special Instructions (Optional)
          </label>
          <textarea
            id="book-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share temperament, allergies, or pickup instructions..."
            className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm focus:outline-none focus:border-[#F69E40]"
          />
        </div>

        {/* Summary & Submit */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-stone-500">
              Estimated Total (Pay directly to provider upon service confirmation)
            </p>
            <p className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              ₹{chosenService.priceInr}
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting Request...' : 'Submit Booking Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Search,
  Star,
} from 'lucide-react';
import { BRAND_ASSETS, SERVICE_CATEGORIES } from '../data/categories';
import { useApp } from '../context/AppContext';
import {
  CategoryGraphic,
  IllustratedCatMascot,
  IllustratedDogMascot,
} from '../components/PetMascot';

interface DiscoveredPlace {
  placeId: string;
  name: string;
  category: string;
  subcategory: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  googleMapsUrl: string;
  rating: number;
  userRatingCount: number;
  openNow: boolean | null;
}

const HERO_SLIDES = [
  {
    image: BRAND_ASSETS.heroBanner,
    kicker: 'Grooming · Vets · Boarding',
    title: 'Trusted Neighbourhood Pet Care',
    ctaText: 'Explore Services',
    ctaLink: '/services',
  },
  {
    image: SERVICE_CATEGORIES[1]?.featuredImage || BRAND_ASSETS.heroBanner,
    kicker: 'Spa & Styling',
    title: 'Gentle Grooming for Dogs & Cats',
    ctaText: 'Book Grooming',
    ctaLink: '/services/grooming-and-hygiene',
  },
  {
    image: SERVICE_CATEGORIES[0]?.featuredImage || BRAND_ASSETS.heroBanner,
    kicker: '24/7 Health & Wellness',
    title: 'Compassionate Veterinary Care',
    ctaText: 'Find a Vet',
    ctaLink: '/services/health',
  },
  {
    image: SERVICE_CATEGORIES[2]?.featuredImage || BRAND_ASSETS.heroBanner,
    kicker: 'Safe Home Stays',
    title: 'Loving Boarding & Daycare',
    ctaText: 'Explore Boarding',
    ctaLink: '/services/boarding-and-daycare',
  },
];

const MARQUEE_HIGHLIGHTS = [
  'Grooming & Hygiene',
  'Veterinary & Health',
  '24/7 Pet Ambulance',
  'Boarding & Daycare',
  'Training & Behaviour',
  'Pet Transport & Relocation',
  'Recreation & Exercise',
  'Pet Supplies & Nutrition',
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { providers, siteConfig, mascotMood, triggerMascot } = useApp();

  const [serviceInput, setServiceInput] = useState('');
  const [locationInput, setLocationInput] = useState('Bengaluru');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Hero Visual Slider state
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Category Horizontal Slider Ref
  const categorySliderRef = useRef<HTMLDivElement>(null);


  // Provider / Discovery Tab & Slider Ref
  const [discoveryTab, setDiscoveryTab] = useState<'tailshug' | 'local'>('local');
  const [featuredPlaces, setFeaturedPlaces] = useState<DiscoveredPlace[]>([]);
  const discoverySliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    fetch('/api/places/search?q=pet+care&location=Bengaluru')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.places)) {
          setFeaturedPlaces(data.places.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (providers.length > 0) {
      setDiscoveryTab('tailshug');
    }
  }, [providers.length]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/places/autocomplete?input=${encodeURIComponent(locationInput)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions.slice(0, 5));
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [locationInput]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (serviceInput.trim()) params.set('q', serviceInput.trim());
    if (locationInput.trim()) params.set('location', locationInput.trim());
    navigate(`/search?${params.toString()}`);
  };

  const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (!ref.current) return;
    const amount = dir === 'left' ? -340 : 340;
    ref.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const currentHero = HERO_SLIDES[activeSlide];

  return (
    <div>
      {/* 1. Split Hero with Interactive Visual Carousel */}
      <section className="relative bg-gradient-to-b from-[#FFF7ED] to-[#FAF7F2] border-b border-stone-200/80 overflow-hidden">
        {/* Decorative Background SVG Graphic */}
        <svg
          viewBox="0 0 600 600"
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] opacity-25"
        >
          <circle cx="300" cy="300" r="220" fill="#F69E40" fillOpacity="0.18" />
          <circle cx="220" cy="180" r="28" fill="#F69E40" fillOpacity="0.25" />
          <circle cx="300" cy="150" r="28" fill="#F69E40" fillOpacity="0.25" />
          <circle cx="380" cy="180" r="28" fill="#F69E40" fillOpacity="0.25" />
        </svg>

        <div className="max-w-[1280px] mx-auto px-6 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Concise Headline & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-3">
                <IllustratedDogMascot mood={mascotMood} size="sm" />
                <span className="text-xs font-semibold tracking-wide text-[#9A4E0B] uppercase">
                  TailsHug · India’s Warm Pet-Care Marketplace
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-[#18181B] leading-[1.1] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Every Paw Deserves the{' '}
                <span className="text-[#F69E40] italic font-normal">Best Care.</span>
              </h1>

              <p className="text-base text-stone-600 max-w-xl">
                Book verified groomers, vets, boarders, and walkers near you in seconds.
              </p>

              {/* Compact Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-2.5 sm:p-3 rounded-2xl border border-stone-200 shadow-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  <div className="sm:col-span-5 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200/80 focus-within:border-[#F69E40]">
                    <Search className="w-4 h-4 text-[#F69E40] shrink-0" />
                    <input
                      type="text"
                      value={serviceInput}
                      onFocus={() => triggerMascot('curious', 'Pick a service for your pet!')}
                      onChange={(e) => setServiceInput(e.target.value)}
                      placeholder="Grooming, Vet, Boarding..."
                      className="w-full text-sm text-stone-900 bg-transparent focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-4 relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200/80 focus-within:border-[#F69E40]">
                    <MapPin className="w-4 h-4 text-[#F69E40] shrink-0" />
                    <input
                      type="text"
                      value={locationInput}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => window.setTimeout(() => setShowSuggestions(false), 180)}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="City or Area"
                      className="w-full text-sm text-stone-900 bg-transparent focus:outline-none"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-20 py-1">
                        {suggestions.map((loc) => (
                          <button
                            type="button"
                            key={loc}
                            onMouseDown={() => {
                              setLocationInput(loc);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-stone-700 hover:bg-[#FFF7ED] hover:text-[#F69E40]"
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Graphic Shortcut Links */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                <span className="font-semibold text-stone-800">Quick picks:</span>
                <button
                  type="button"
                  onClick={() => navigate('/search?q=Dog+groomers&location=Bengaluru')}
                  className="hover:text-[#F69E40] underline"
                >
                  Dog Grooming
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => navigate('/search?q=Veterinary+clinics&location=Indiranagar')}
                  className="hover:text-[#F69E40] underline"
                >
                  24/7 Vets
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => navigate('/search?q=Pet+boarding&location=Whitefield')}
                  className="hover:text-[#F69E40] underline"
                >
                  Home Boarding
                </button>
              </div>
            </div>

            {/* Right Column: Auto-Sliding Visual Carousel with Graphics */}
            <div
              className="lg:col-span-5"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative h-[360px] sm:h-[400px] rounded-3xl overflow-hidden border border-stone-200 bg-stone-900 shadow-md">
                <img
                  key={currentHero.image}
                  src={currentHero.image}
                  alt={currentHero.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {/* Top Graphic Floating Mascot Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-sm">
                  <IllustratedCatMascot size="sm" />
                </div>

                {/* Slide Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <p className="text-xs text-[#F69E40] font-semibold uppercase tracking-wide">
                    {currentHero.kicker}
                  </p>
                  <h2 className="text-xl font-bold mt-0.5">{currentHero.title}</h2>

                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      to={currentHero.ctaLink}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F69E40] hover:bg-[#e58e35] text-white px-4 py-2 rounded-xl transition-colors"
                    >
                      {currentHero.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Slider Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                        }
                        aria-label="Previous slide"
                        className="p-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1.5">
                        {HERO_SLIDES.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            aria-label={`Slide ${i + 1}`}
                            onClick={() => setActiveSlide(i)}
                            className={`h-1.5 rounded-full transition-all ${
                              activeSlide === i ? 'w-5 bg-[#F69E40]' : 'w-1.5 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                        aria-label="Next slide"
                        className="p-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Smooth Sliding Graphic Marquee Strip */}
      <div className="bg-[#18181B] text-white py-3 overflow-hidden border-b border-stone-800">
        <div className="animate-marquee flex items-center gap-10 text-xs font-medium tracking-wide">
          {[...MARQUEE_HIGHLIGHTS, ...MARQUEE_HIGHLIGHTS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F69E40] fill-current shrink-0">
                <circle cx="7" cy="7" r="2.2" />
                <circle cx="12" cy="5.5" r="2.2" />
                <circle cx="17" cy="7" r="2.2" />
                <ellipse cx="12" cy="14" rx="5" ry="4" />
              </svg>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Category Slider with Custom SVG Graphics */}
      <section className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-[#9A4E0B] uppercase tracking-wide">
              Swipe or Slide
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#18181B]">
              Pet Care Categories
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSlider(categorySliderRef, 'left')}
              aria-label="Slide categories left"
              className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#F69E40] text-stone-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider(categorySliderRef, 'right')}
              aria-label="Slide categories right"
              className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#F69E40] text-stone-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              to="/services"
              className="ml-2 text-xs font-semibold text-[#F69E40] hover:underline whitespace-nowrap"
            >
              View All →
            </Link>
          </div>
        </div>

        {/* Compact Category Slider: Exactly 2 visible on mobile, 3 on tablet, 4 on desktop */}
        <div
          ref={categorySliderRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2"
        >
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/services/${cat.slug}`}
              className="group w-[calc(50%-6px)] sm:w-[calc(33.33%-8px)] lg:w-[calc(25%-10px)] min-w-0 bg-white rounded-2xl border border-stone-200 hover:border-[#F69E40] overflow-hidden transition-all hover:-translate-y-0.5 flex flex-col justify-between shrink-0 shadow-xs snap-start"
            >
              {/* Reduced size compact thumbnail picture with exact icon badge */}
              <div className="relative h-18 sm:h-22 w-full bg-stone-100 overflow-hidden">
                <img
                  src={cat.featuredImage || BRAND_ASSETS.heroBanner}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-xs">
                  <CategoryGraphic slug={cat.slug} className="w-6 h-6" showBg={false} />
                </div>
                <span className="absolute bottom-1.5 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-black/60 text-white font-semibold">
                  {cat.number}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#F69E40] transition-colors leading-tight truncate">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 mt-1 truncate">
                    {cat.subcategories.slice(0, 2).join(' · ')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Official "Our Services" Grid matching exact user reference image */}
      <section className="max-w-[1280px] mx-auto px-6 pb-6">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
                Our Services
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Verified care across all 12 specialized pet disciplines.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/services"
                className="text-xs sm:text-sm font-semibold text-[#F69E40] hover:underline whitespace-nowrap"
              >
                View Directory →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 sm:gap-y-12 gap-x-4 sm:gap-x-8">
            {SERVICE_CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className="group flex flex-col items-center text-center relative"
              >
                <Link
                  to={`/services/${cat.slug}`}
                  className="flex flex-col items-center text-center focus:outline-none"
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                    <CategoryGraphic slug={cat.slug} className="w-16 h-16 sm:w-20 sm:h-20" showBg={false} />
                  </div>
                  <span className="mt-2.5 text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#F69E40] transition-colors text-center leading-snug max-w-[130px]">
                    {cat.title}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Visual 3-Step Graphic Strip (Minimal Text, Expressive Graphics) */}
      <section className="max-w-[1280px] mx-auto px-6 py-6">
        <div className="bg-[#FFF7ED] rounded-3xl border border-orange-200/70 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <IllustratedDogMascot mood="curious" size="sm" />
            <div>
              <p className="text-xs font-mono text-[#9A4E0B]">01 · Search</p>
              <h3 className="text-base font-bold text-stone-900">Pick a Pet Service</h3>
              <p className="text-xs text-stone-600">Compare local &amp; verified pros.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CategoryGraphic slug="boarding" className="w-14 h-14 shrink-0 bg-white" />
            <div>
              <p className="text-xs font-mono text-[#9A4E0B]">02 · Book</p>
              <h3 className="text-base font-bold text-stone-900">Choose Your Slot</h3>
              <p className="text-xs text-stone-600">Instant online appointment requests.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <IllustratedCatMascot size="sm" />
            <div>
              <p className="text-xs font-mono text-[#9A4E0B]">03 · Relax</p>
              <h3 className="text-base font-bold text-stone-900">Happy, Safe Paws</h3>
              <p className="text-xs text-stone-600">Loving care with verified reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Provider & Local Business Slider */}
      <section className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-200 w-fit">
            <button
              type="button"
              onClick={() => setDiscoveryTab('local')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                discoveryTab === 'local'
                  ? 'bg-[#F69E40] text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nearby Pet Care ({featuredPlaces.length})
            </button>
            <button
              type="button"
              onClick={() => setDiscoveryTab('tailshug')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                discoveryTab === 'tailshug'
                  ? 'bg-[#1F4D3A] text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Verified Providers ({providers.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSlider(discoverySliderRef, 'left')}
              aria-label="Slide listings left"
              className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#F69E40]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider(discoverySliderRef, 'right')}
              aria-label="Slide listings right"
              className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#F69E40]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              to="/search"
              className="ml-2 text-xs font-semibold text-[#F69E40] hover:underline"
            >
              Explore Map &amp; List →
            </Link>
          </div>
        </div>

        <div
          ref={discoverySliderRef}
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {discoveryTab === 'local' ? (
            featuredPlaces.map((place) => (
              <div
                key={place.placeId}
                className="min-w-[280px] sm:min-w-[310px] bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between space-y-4 shrink-0"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>{place.subcategory}</span>
                    {place.rating > 0 && (
                      <span className="inline-flex items-center gap-1 font-mono text-stone-800">
                        <Star className="w-3.5 h-3.5 text-[#F69E40] fill-[#F69E40]" />
                        {place.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-stone-900 truncate">{place.name}</h3>
                  <p className="text-xs text-stone-500 truncate">{place.address}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
                  <Link
                    to={`/google-places/${place.placeId}`}
                    className="text-stone-900 hover:text-[#F69E40]"
                  >
                    Details →
                  </Link>
                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      className="text-[#F69E40] inline-flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : providers.length > 0 ? (
            providers.map((p) => (
              <div
                key={p.id}
                className="min-w-[280px] sm:min-w-[310px] bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between space-y-4 shrink-0"
              >
                <div className="space-y-1.5">
                  <p className="text-xs text-[#1F4D3A] font-semibold">
                    {p.categoryTitle} · ₹{p.startingPriceInr}
                  </p>
                  <h3 className="text-base font-bold text-stone-900 truncate">{p.businessName}</h3>
                  <p className="text-xs text-stone-500 truncate">
                    {p.area}, {p.city}
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    to={`/provider/${p.id}`}
                    className="text-xs font-semibold text-stone-700 hover:text-[#F69E40]"
                  >
                    Profile
                  </Link>
                  <Link
                    to={`/book/${p.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F69E40] text-white text-xs font-semibold"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full bg-white rounded-2xl border border-stone-200 p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <IllustratedCatMascot size="sm" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Are you a Pet Care Professional?
                  </h3>
                  <p className="text-xs text-stone-500">
                    Join TailsHug to accept direct online bookings.
                  </p>
                </div>
              </div>
              <Link
                to="/become-a-provider"
                className="px-4 py-2 rounded-xl bg-[#F69E40] text-white text-xs font-semibold shrink-0"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 6. Compact Visual Founder Spotlight (Garima & Bekky) + Mobile App Graphic */}
      <section className="max-w-[1280px] mx-auto px-6 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Founder Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-40 sm:w-48 aspect-3/4 rounded-2xl overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
              <img
                src={siteConfig.founderPhotoUrl}
                alt="Garima with Bekky & Chiku — Founder, TailsHug"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#9A4E0B] uppercase tracking-wide">
                Founder’s Note
              </p>
              <h2 className="text-2xl font-bold text-stone-900 leading-snug">
                “Pets aren’t transactions. They’re family.”
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                I’m Garima (the human) while the real CEO of this company are my cats, Bekky &amp; Chiku. TailsHug was created to
                make pet care feel warm, safe, and human again.
              </p>
              <div className="pt-2 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#F69E40]">Garima, Bekky &amp; Chiku</p>
                  <p className="text-xs text-stone-500">Founder, TailsHug</p>
                </div>
                <Link
                  to="/about"
                  className="text-xs font-semibold text-stone-900 hover:text-[#F69E40] underline"
                >
                  Read Note →
                </Link>
              </div>
            </div>
          </div>

          {/* App Showcase Graphic Card */}
          <div className="lg:col-span-5 bg-[#18181B] text-white rounded-3xl p-6 sm:p-8 flex items-center justify-between gap-4 overflow-hidden">
            <div className="space-y-3 max-w-[220px]">
              <p className="text-xs font-semibold text-[#F69E40] uppercase tracking-wide">
                TailsHug App
              </p>
              <h3 className="text-xl font-bold leading-snug">
                Pet Care in Your Pocket
              </h3>
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href={siteConfig.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#F69E40] text-white text-xs font-semibold"
                >
                  Google Play ↗
                </a>
                <a
                  href={siteConfig.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  App Store ↗
                </a>
              </div>
            </div>
            <img
              src={BRAND_ASSETS.appShowcaseMobile}
              alt="TailsHug Mobile App"
              referrerPolicy="no-referrer"
              className="h-44 sm:h-52 w-auto object-contain shrink-0"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

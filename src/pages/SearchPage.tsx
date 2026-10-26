import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ExternalLink,
  Heart,
  LayoutGrid,
  List,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Star,
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/categories';
import { useApp } from '../context/AppContext';
import { CategoryGraphic, IllustratedCatMascot } from '../components/PetMascot';

interface GooglePlaceItem {
  placeId: string;
  name: string;
  category: string;
  subcategory: string;
  address: string;
  city: string;
  area: string;
  phone: string;
  website: string;
  googleMapsUrl: string;
  rating: number;
  userRatingCount: number;
  openNow: boolean | null;
  openingHoursText: string[];
  summary: string;
}

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { providers, favourites, toggleFavourite, triggerMascot } = useApp();

  const [queryInput, setQueryInput] = useState(searchParams.get('q') || '');
  const [locationInput, setLocationInput] = useState(searchParams.get('location') || 'Bengaluru');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'tailshug' | 'google'>(
    (searchParams.get('source') as 'all' | 'tailshug' | 'google') || 'all'
  );
  const [minRating, setMinRating] = useState<number>(0);
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price_asc'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [googlePlaces, setGooglePlaces] = useState<GooglePlaceItem[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [demoNotice, setDemoNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDiscoveryResults = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (queryInput.trim()) params.set('q', queryInput.trim());
      if (locationInput.trim()) params.set('location', locationInput.trim());
      if (selectedCategory) params.set('category', selectedCategory);

      const res = await fetch(`/api/places/search?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load business discovery listings.');
      }
      const data = await res.json();
      setGooglePlaces(Array.isArray(data.places) ? data.places : []);
      setDemoMode(Boolean(data.demoMode));
      setDemoNotice(data.notice || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch discovery results.');
      triggerMascot('error', 'Something went wrong fetching listings. Click Retry to try again!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoveryResults();
  }, [searchParams]);

  const handleApplySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (queryInput.trim()) next.set('q', queryInput.trim());
    if (locationInput.trim()) next.set('location', locationInput.trim());
    if (selectedCategory) next.set('category', selectedCategory);
    if (sourceFilter !== 'all') next.set('source', sourceFilter);
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setQueryInput('');
    setLocationInput('Bengaluru');
    setSelectedCategory('');
    setSourceFilter('all');
    setMinRating(0);
    setOpenNowOnly(false);
    setSortBy('relevance');
    setSearchParams({});
  };

  // Filter Registered TailsHug Providers
  const filteredTailsHugProviders = useMemo(() => {
    if (sourceFilter === 'google') return [];
    const q = queryInput.trim().toLowerCase();
    const loc = locationInput.trim().toLowerCase();
    const cat = selectedCategory.toLowerCase();

    return providers.filter((p) => {
      const matchQ =
        !q ||
        p.businessName.toLowerCase().includes(q) ||
        p.categoryTitle.toLowerCase().includes(q) ||
        p.subcategories.some((s) => s.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q);
      const matchCat =
        !cat || p.categoryTitle.toLowerCase() === cat || p.categorySlug.toLowerCase() === cat;
      const matchLoc =
        !loc ||
        loc === 'india' ||
        p.city.toLowerCase().includes(loc) ||
        p.area.toLowerCase().includes(loc) ||
        p.pincode.toLowerCase().includes(loc);
      const matchRating = minRating === 0 || p.ratingAvg >= minRating;
      return matchQ && matchCat && matchLoc && matchRating;
    });
  }, [providers, sourceFilter, queryInput, locationInput, selectedCategory, minRating]);

  // Filter External Google Places Listings (deduplicating any business with the same name as a registered TailsHug provider)
  const filteredGooglePlaces = useMemo(() => {
    if (sourceFilter === 'tailshug') return [];
    const registeredNames = new Set(providers.map((p) => p.businessName.toLowerCase().trim()));

    let list = googlePlaces.filter((g) => !registeredNames.has(g.name.toLowerCase().trim()));

    if (minRating > 0) {
      list = list.filter((g) => (g.rating || 0) >= minRating);
    }
    if (openNowOnly) {
      list = list.filter((g) => g.openNow === true);
    }
    if (sortBy === 'rating') {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [googlePlaces, providers, sourceFilter, minRating, openNowOnly, sortBy]);

  const totalResults = filteredTailsHugProviders.length + filteredGooglePlaces.length;

  useEffect(() => {
    if (!loading && totalResults === 0) {
      triggerMascot(
        'empty',
        "We couldn't find a match just yet. Try another location or service."
      );
    }
  }, [loading, totalResults]);

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-8">
      {/* Page Title & Search Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#9A4E0B] uppercase tracking-wide mb-1">
              Pet Care Business Discovery
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Find Trusted Pet Services &amp; Local Clinics
            </h1>
          </div>

          {/* Interactive Segmented Source Filter */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF7F2] border border-stone-200 rounded-xl self-start">
            <button
              type="button"
              onClick={() => setSourceFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                sourceFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Sources ({totalResults})
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter('tailshug')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                sourceFilter === 'tailshug'
                  ? 'bg-[#1F4D3A] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              TailsHug Providers ({filteredTailsHugProviders.length})
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter('google')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                sourceFilter === 'google'
                  ? 'bg-[#F69E40] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Google Maps ({filteredGooglePlaces.length})
            </button>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleApplySearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200">
            <Search className="w-4 h-4 text-[#F69E40] shrink-0" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Grooming, vet clinic, boarding, pet taxi..."
              className="w-full text-sm bg-transparent focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200">
            <MapPin className="w-4 h-4 text-[#F69E40] shrink-0" />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Bengaluru, Indiranagar, Mysuru..."
              className="w-full text-sm bg-transparent focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
              className="w-full h-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm text-stone-800 focus:outline-none"
            >
              <option value="">All 12 Categories</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-full px-5 py-2.5 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Icon Selector for all 12 Services matching reference image */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('');
              const next = new URLSearchParams(searchParams);
              next.delete('category');
              setSearchParams(next);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              !selectedCategory
                ? 'bg-[#18181B] text-white'
                : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-100'
            }`}
          >
            All Services
          </button>
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.title;
            return (
              <button
                type="button"
                key={cat.slug}
                onClick={() => {
                  const nextVal = isActive ? '' : cat.title;
                  setSelectedCategory(nextVal);
                  const next = new URLSearchParams(searchParams);
                  if (nextVal) next.set('category', nextVal);
                  else next.delete('category');
                  setSearchParams(next);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 border ${
                  isActive
                    ? 'border-[#F69E40] bg-[#FFF7ED] text-[#9A4E0B]'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <CategoryGraphic slug={cat.slug} className="w-5 h-5 shrink-0" showBg={false} />
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-200/80 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-stone-700">
              <span>Minimum Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white font-mono"
              >
                <option value={0}>Any</option>
                <option value={4}>4.0+</option>
                <option value={4.5}>4.5+</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={openNowOnly}
                onChange={(e) => setOpenNowOnly(e.target.checked)}
                className="rounded border-stone-300 text-[#F69E40] focus:ring-[#F69E40]"
              />
              <span>Open Now (Google Listings)</span>
            </label>

            <label className="flex items-center gap-2 text-stone-700">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'relevance' | 'rating' | 'price_asc')
                }
                className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Lowest Starting Price</option>
              </select>
            </label>

            {(queryInput || selectedCategory || minRating > 0 || openNowOnly || sourceFilter !== 'all') && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[#F69E40] hover:underline font-semibold"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-lg border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded ${
                viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Explicit Demo Mode / API Notice Banner */}
      {demoMode && demoNotice && (
        <div className="bg-[#FFF7ED] border border-orange-200/80 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-700">
          <p>{demoNotice}</p>
          <span className="font-mono text-[11px] text-[#9A4E0B] whitespace-nowrap">
            Source: Curated Demo Directory + Live Firestore
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center justify-between gap-4">
          <p className="text-sm text-red-800">{error}</p>
          <button
            type="button"
            onClick={fetchDiscoveryResults}
            className="px-4 py-2 rounded-xl bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 animate-pulse"
            >
              <div className="h-4 w-1/3 bg-stone-200 rounded" />
              <div className="h-6 w-3/4 bg-stone-200 rounded" />
              <div className="h-12 w-full bg-stone-100 rounded" />
              <div className="h-8 w-1/2 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State with Curious Cat Mascot ("Bekky") */}
      {!loading && totalResults === 0 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
          <IllustratedCatMascot size="lg" />
          <h2 className="text-2xl font-bold text-stone-900">
            We couldn’t find a match just yet. Try another location or service.
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Bekky the cat looked everywhere! Try clearing filters or searching for “Bengaluru”,
            “Grooming”, or “Veterinary care”.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
          >
            Reset Search Filters
          </button>
        </div>
      )}

      {/* Registered TailsHug Providers Section */}
      {!loading && filteredTailsHugProviders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">
              Registered TailsHug Marketplace Providers ({filteredTailsHugProviders.length})
            </h2>
            <span className="text-xs text-[#1F4D3A] font-semibold">
              In-Platform Booking Enabled
            </span>
          </div>

          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredTailsHugProviders.map((provider) => {
              const isSaved = favourites.some((f) => f.providerId === provider.id);
              return (
                <div
                  key={provider.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                      <span className="font-semibold text-[#1F4D3A]">
                        TailsHug Provider · {provider.verified ? 'Verified' : 'Registered'}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavourite(provider)}
                        aria-label="Save provider"
                        className="text-stone-400 hover:text-rose-500"
                      >
                        <Heart
                          className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`}
                        />
                      </button>
                    </div>

                    <Link
                      to={`/provider/${provider.id}`}
                      className="block text-xl font-bold text-stone-900 hover:text-[#F69E40] transition-colors"
                    >
                      {provider.businessName}
                    </Link>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                      <span>{provider.categoryTitle}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {provider.area}, {provider.city}
                      </span>
                      {provider.ratingAvg > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums text-stone-800 inline-flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-[#F69E40] fill-[#F69E40]" />
                            {provider.ratingAvg.toFixed(1)} ({provider.reviewCount})
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {provider.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-stone-500 block">Starting from</span>
                      <span className="text-sm font-bold font-mono tabular-nums text-stone-900">
                        ₹{provider.startingPriceInr}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/provider/${provider.id}`}
                        className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 hover:border-[#F69E40]"
                      >
                        Profile
                      </Link>
                      <Link
                        to={`/book/${provider.id}`}
                        className="px-4 py-2 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-xs font-semibold whitespace-nowrap"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* External Google Maps Business Listings Section */}
      {!loading && filteredGooglePlaces.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-stone-900">
              Google Maps Business Listings ({filteredGooglePlaces.length})
            </h2>
            <p className="text-xs text-stone-500">
              Externally sourced directory details · Direct phone, website &amp; map directions
            </p>
          </div>

          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredGooglePlaces.map((place) => (
              <div
                key={place.placeId}
                className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                    <span>Google Maps Listing</span>
                    <span aria-hidden="true">·</span>
                    <span>{place.subcategory || place.category}</span>
                    {place.openNow !== null && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            place.openNow ? 'text-emerald-700 font-medium' : 'text-stone-500'
                          }
                        >
                          {place.openNow ? 'Open Now' : 'Closed'}
                        </span>
                      </>
                    )}
                  </div>

                  <Link
                    to={`/google-places/${place.placeId}`}
                    className="block text-lg font-bold text-stone-900 hover:text-[#F69E40] transition-colors"
                  >
                    {place.name}
                  </Link>

                  {place.rating > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums text-stone-700">
                      <Star className="w-3.5 h-3.5 text-[#F69E40] fill-[#F69E40]" />
                      <span className="font-semibold">{place.rating.toFixed(1)}</span>
                      <span className="text-stone-500">({place.userRatingCount} Google reviews)</span>
                    </div>
                  )}

                  <p className="text-xs text-stone-600 leading-relaxed">{place.address}</p>
                  {place.summary && (
                    <p className="text-sm text-stone-600 line-clamp-2">{place.summary}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                  <Link
                    to={`/google-places/${place.placeId}`}
                    className="text-stone-900 hover:text-[#F69E40]"
                  >
                    View Details
                  </Link>

                  <div className="flex items-center gap-3">
                    {place.phone && (
                      <a
                        href={`tel:${place.phone}`}
                        className="text-stone-700 hover:text-[#F69E40] inline-flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    )}
                    {place.website && (
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-700 hover:text-[#F69E40] inline-flex items-center gap-1"
                      >
                        Website <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <a
                      href={place.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F69E40] hover:underline"
                    >
                      Directions ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

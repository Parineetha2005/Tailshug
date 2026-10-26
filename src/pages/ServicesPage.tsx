import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { BRAND_ASSETS, SERVICE_CATEGORIES } from '../data/categories';
import { useApp } from '../context/AppContext';
import { CategoryGraphic } from '../components/PetMascot';

export const ServicesPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { providers } = useApp();
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSpotlight = (dir: 'left' | 'right') => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
  };

  if (category) {
    const selected = SERVICE_CATEGORIES.find(
      (c) => c.slug === category || (category === 'pet-adoption-and-breeding' && c.slug === 'pet-adoption')
    );

    if (!selected) {
      return (
        <div className="max-w-[1280px] mx-auto px-6 py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold text-stone-900">Category Not Found</h1>
          <Link
            to="/services"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
          >
            All Categories
          </Link>
        </div>
      );
    }

    const matchingProviders = providers.filter((p) => p.categorySlug === selected.slug);

    return (
      <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-8">
        {/* Compact Visual Header with Exact Service Icon */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <CategoryGraphic slug={selected.slug} className="w-16 h-16 shrink-0" showBg={false} />
              </div>
              <div>
                <Link to="/services" className="text-xs text-stone-500 hover:text-[#F69E40]">
                  ← All Categories
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
                  {selected.title}
                </h1>
              </div>
            </div>

            <p className="text-sm text-stone-600 max-w-xl">{selected.shortDescription}</p>

            {/* Subcategory Interactive Quick Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {selected.subcategories.map((sub) => (
                <Link
                  key={sub}
                  to={`/search?q=${encodeURIComponent(sub)}&category=${encodeURIComponent(selected.title)}&location=Bengaluru`}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-stone-200 hover:border-[#F69E40] text-xs font-semibold text-stone-800 flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-[#F69E40]" />
                  {sub}
                </Link>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={`/search?category=${encodeURIComponent(selected.title)}&location=Bengaluru`}
                className="px-5 py-2.5 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-xs font-semibold"
              >
                Find {selected.title} Near You
              </Link>
              <Link
                to="/become-a-provider"
                className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 hover:border-[#F69E40] text-xs font-semibold text-stone-800"
              >
                Join as Provider
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-xs h-40 sm:h-44 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs">
              <img
                src={selected.featuredImage || BRAND_ASSETS.heroBanner}
                alt={selected.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Registered Providers in this Category */}
        {matchingProviders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {matchingProviders.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-stone-900">{p.businessName}</h3>
                  <p className="text-xs text-stone-500">
                    {p.city} · From ₹{p.startingPriceInr}
                  </p>
                </div>
                <Link
                  to={`/book/${p.id}`}
                  className="px-4 py-2 rounded-xl bg-[#F69E40] text-white text-xs font-semibold"
                >
                  Book
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-12">
      {/* 1. Category Spotlight Slider with Compact Pictures (At least 3-4 visible on desktop, 2 on mobile) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#9A4E0B] uppercase tracking-wide">
              Explore By Category
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Featured Pet Care
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSpotlight('left')}
              aria-label="Scroll left"
              className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#F69E40] text-stone-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollSpotlight('right')}
              aria-label="Scroll right"
              className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#F69E40] text-stone-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compact Carousel: Exactly 2 visible on mobile, 3 on tablet, 4 on desktop */}
        <div
          ref={sliderRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2"
        >
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/services/${cat.slug}`}
              className="group w-[calc(50%-6px)] sm:w-[calc(33.33%-8px)] lg:w-[calc(25%-10px)] min-w-0 bg-white rounded-2xl border border-stone-200 hover:border-[#F69E40] overflow-hidden shrink-0 transition-all hover:-translate-y-0.5 shadow-xs flex flex-col snap-start"
            >
              {/* Reduced height picture: 64px on mobile, 80px on desktop */}
              <div className="relative h-16 sm:h-20 w-full bg-stone-100 overflow-hidden">
                <img
                  src={cat.featuredImage || BRAND_ASSETS.heroBanner}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-xs">
                  <CategoryGraphic slug={cat.slug} className="w-5 h-5" showBg={false} />
                </div>
                <span className="absolute bottom-1.5 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-black/60 text-white font-semibold">
                  {cat.number}
                </span>
              </div>

              {/* Compact Caption */}
              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#F69E40] transition-colors leading-tight truncate">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 truncate">
                    {cat.subcategories.slice(0, 2).join(' · ')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Official "Our Services" Grid with the EXACT SAME ICONS from Reference Image */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Our Services
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Tap any service to find verified providers and emergency care across India.
            </p>
          </div>
        </div>

        {/* 4 Columns x 3 Rows = 12 Services matching reference image */}
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
      </section>
    </div>
  );
};

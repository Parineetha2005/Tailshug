import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SERVICE_CATEGORIES } from '../data/categories';
import { useApp } from '../context/AppContext';
import { CategoryGraphic, IllustratedDogMascot } from '../components/PetMascot';

interface ServiceItemDraft {
  name: string;
  subcategory: string;
  priceInr: number;
  durationMinutes: number;
  description: string;
}

const ONBOARDING_DRAFT_KEY = 'tailshug_provider_onboarding_draft_v1';

export const OnboardingPage: React.FC = () => {
  const { user, profile, triggerMascot, mascotMood } = useApp();

  const [step, setStep] = useState(1);
  const [applicantName, setApplicantName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [categorySlug, setCategorySlug] = useState(SERVICE_CATEGORIES[0].slug);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([
    SERVICE_CATEGORIES[0].subcategories[0],
  ]);
  const [services, setServices] = useState<ServiceItemDraft[]>([
    {
      name: 'Standard Consultation / Full Session',
      subcategory: SERVICE_CATEGORIES[0].subcategories[0],
      priceInr: 799,
      durationMinutes: 60,
      description: 'Complete session tailored to your pet’s comfort and health requirements.',
    },
  ]);

  const [city, setCity] = useState('Bengaluru');
  const [area, setArea] = useState('Indiranagar');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('560038');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [operatingHours, setOperatingHours] = useState('Mon–Sat: 9:30 AM – 7:00 PM');
  const [cancellationPolicy, setCancellationPolicy] = useState(
    'Free cancellation up to 24 hours before the scheduled appointment.'
  );

  // Private Verification Documents (Stored strictly in /providerApplications/{appId}/privateDocs/kyc)
  const [idDocumentType, setIdDocumentType] = useState('Aadhaar / PAN Card');
  const [idDocumentRef, setIdDocumentRef] = useState('');
  const [licenseDocumentName, setLicenseDocumentName] = useState('');
  const [upiOrPayoutNote, setUpiOrPayoutNote] = useState('');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const [existingStatus, setExistingStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');

  const activeCategory =
    SERVICE_CATEGORIES.find((c) => c.slug === categorySlug) || SERVICE_CATEGORIES[0];

  // Load saved local draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ONBOARDING_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.applicantName) setApplicantName(parsed.applicantName);
        if (parsed.businessName) setBusinessName(parsed.businessName);
        if (parsed.categorySlug) setCategorySlug(parsed.categorySlug);
        if (Array.isArray(parsed.selectedSubcategories) && parsed.selectedSubcategories.length > 0)
          setSelectedSubcategories(parsed.selectedSubcategories);
        if (Array.isArray(parsed.services) && parsed.services.length > 0)
          setServices(parsed.services);
        if (parsed.city) setCity(parsed.city);
        if (parsed.area) setArea(parsed.area);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.pincode) setPincode(parsed.pincode);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.description) setDescription(parsed.description);
      }
    } catch {
      // Ignore draft parse error
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (!applicantName) setApplicantName(profile?.displayName || user.displayName || '');
      if (!email) setEmail(user.email || '');
      const q = query(
        collection(db, 'providerApplications'),
        where('applicantId', '==', user.uid)
      );
      getDocs(q)
        .then((snap) => {
          if (!snap.empty) {
            const appData = snap.docs[0].data();
            setExistingStatus(appData.status || 'submitted');
          }
        })
        .catch(() => {});
    }
  }, [user, profile]);

  const handleCategoryChange = (slug: string) => {
    setCategorySlug(slug);
    const cat = SERVICE_CATEGORIES.find((c) => c.slug === slug) || SERVICE_CATEGORIES[0];
    setSelectedSubcategories([cat.subcategories[0]]);
  };

  const toggleSubcategory = (sub: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub)
        ? prev.length > 1
          ? prev.filter((s) => s !== sub)
          : prev
        : [...prev, sub].slice(0, 10)
    );
  };

  const addServiceRow = () => {
    if (services.length >= 20) return;
    setServices((prev) => [
      ...prev,
      {
        name: '',
        subcategory: activeCategory.subcategories[0],
        priceInr: 500,
        durationMinutes: 45,
        description: '',
      },
    ]);
  };

  const removeServiceRow = (idx: number) => {
    if (services.length <= 1) return;
    setServices((prev) => prev.filter((_, i) => i !== idx));
  };

  const saveLocalDraft = () => {
    localStorage.setItem(
      ONBOARDING_DRAFT_KEY,
      JSON.stringify({
        applicantName,
        businessName,
        categorySlug,
        selectedSubcategories,
        services,
        city,
        area,
        address,
        pincode,
        phone,
        description,
      })
    );
    setSavedNotice('Draft saved! You can resume anytime.');
    triggerMascot('celebrate', 'Progress saved! Take your time completing your application.');
    window.setTimeout(() => setSavedNotice(''), 3500);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please sign in first to submit your provider onboarding application.');
      return;
    }
    if (!user.emailVerified) {
      setError('Please verify your email address before submitting your provider application.');
      return;
    }
    if (
      applicantName.trim().length < 2 ||
      businessName.trim().length < 2 ||
      address.trim().length < 5 ||
      description.trim().length < 10
    ) {
      setError(
        'Please complete all required business details (Business Name, Address min 5 chars, Description min 10 chars).'
      );
      return;
    }
    if (!idDocumentRef.trim() || !phone.trim() || !declarationAccepted) {
      setError(
        'Please provide your contact number, verification document reference, and accept the provider declaration.'
      );
      return;
    }

    const validServices = services
      .filter((s) => s.name.trim().length > 0)
      .map((s) => ({
        name: s.name.trim().slice(0, 100),
        subcategory: s.subcategory.slice(0, 80),
        priceInr: Math.max(0, Number(s.priceInr) || 500),
        durationMinutes: Math.max(15, Number(s.durationMinutes) || 45),
        description: (s.description.trim() || 'Professional pet care service').slice(0, 300),
      }));

    if (validServices.length === 0) {
      setError('Please add at least one service with a valid name and price.');
      return;
    }

    const startingPriceInr = Math.min(...validServices.map((s) => s.priceInr));
    const appId = `app_${user.uid}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);

    setSubmitting(true);
    try {
      // 1. Write Public/Application Record to /providerApplications/{appId}
      await setDoc(doc(db, 'providerApplications', appId), {
        applicantId: user.uid,
        applicantName: applicantName.trim().slice(0, 95),
        businessName: businessName.trim().slice(0, 115),
        categorySlug: activeCategory.slug,
        categoryTitle: activeCategory.title,
        subcategories: selectedSubcategories.slice(0, 10),
        services: validServices.slice(0, 20),
        city: city.trim().slice(0, 75),
        area: area.trim().slice(0, 95),
        address: address.trim().slice(0, 290),
        pincode: pincode.trim().slice(0, 12),
        description: description.trim().slice(0, 1950),
        experienceYears: Math.min(80, Math.max(0, Number(experienceYears) || 1)),
        operatingHours: operatingHours.trim().slice(0, 190),
        cancellationPolicy: cancellationPolicy.trim().slice(0, 480),
        startingPriceInr,
        status: 'submitted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2. Write Restricted Private Verification Documents to /providerApplications/{appId}/privateDocs/kyc
      await setDoc(doc(db, 'providerApplications', appId, 'privateDocs', 'kyc'), {
        applicantId: user.uid,
        phone: phone.trim().slice(0, 24),
        email: (email.trim() || user.email || 'provider@tailshug.com').slice(0, 140),
        idDocumentType: idDocumentType.trim().slice(0, 75),
        idDocumentRef: idDocumentRef.trim().slice(0, 115),
        ...(licenseDocumentName.trim()
          ? { licenseDocumentName: licenseDocumentName.trim().slice(0, 190) }
          : {}),
        ...(upiOrPayoutNote.trim()
          ? { upiOrPayoutNote: upiOrPayoutNote.trim().slice(0, 115) }
          : {}),
        declarationAccepted: true,
        updatedAt: serverTimestamp(),
      });

      localStorage.removeItem(ONBOARDING_DRAFT_KEY);
      setSubmittedSuccess(true);
      setExistingStatus('submitted');
      triggerMascot(
        'celebrate',
        `Congratulations ${businessName}! Your provider application is now with our verification team.`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `providerApplications/${appId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-5">
          <IllustratedDogMascot mood={mascotMood} size="lg" />
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F4D3A]">
            <CheckCircle2 className="w-4 h-4" /> Application Submitted for Verification
          </div>
          <h1 className="text-3xl font-bold text-stone-900">
            Thank You for Applying to Join TailsHug, {businessName}!
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Your business details and private KYC verification references have been securely
            recorded. Once an administrator reviews and approves your application, your profile will
            go live for in-platform bookings.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard/provider"
              className="px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
            >
              Open Provider Dashboard
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Header & Mascot Guidance */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#9A4E0B] uppercase tracking-wide">
            Service Provider Onboarding Wizard
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Grow Your Pet-Care Practice with TailsHug
          </h1>
          <p className="text-sm text-stone-600">
            Complete the 4-stage onboarding wizard below. Your private verification documents are
            stored in restricted storage and never exposed publicly.
          </p>
          {existingStatus && (
            <p className="text-xs font-semibold text-[#1F4D3A]">
              Current Application Status on File: {existingStatus.toUpperCase()}
            </p>
          )}
        </div>
        <IllustratedDogMascot mood="curious" size="md" />
      </div>

      {!user && (
        <div className="bg-[#FFF7ED] border border-orange-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-stone-800">
            You can fill out and save your draft below right now. Please sign in with a verified
            account when you are ready to submit your application.
          </p>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-[#F69E40] text-white text-xs font-semibold whitespace-nowrap"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Step Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { num: 1, label: '1. Business & Category' },
          { num: 2, label: '2. Services & Pricing' },
          { num: 3, label: '3. Location & Policies' },
          { num: 4, label: '4. KYC & Declaration' },
        ].map((item) => (
          <button
            type="button"
            key={item.num}
            onClick={() => setStep(item.num)}
            className={`py-3 px-4 rounded-xl text-xs font-semibold border text-left transition-colors ${
              step === item.num
                ? 'bg-[#18181B] text-white border-[#18181B]'
                : step > item.num
                ? 'bg-[#FFF7ED] text-[#9A4E0B] border-orange-200'
                : 'bg-white text-stone-600 border-stone-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-medium">
          {savedNotice}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmitApplication}
        className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 space-y-6"
      >
        {/* STEP 1: Personal, Business & Category */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-stone-900">
              Stage 1: Personal, Business &amp; Service Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Dr. Rohan Rao / Priya Nair"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Business or Practice Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Indiranagar Pet Wellness & Spa"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Primary Service Category *
              </label>
              {/* Visual Category Grid with Exact Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = categorySlug === cat.slug;
                  return (
                    <button
                      type="button"
                      key={cat.slug}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#F69E40] bg-[#FFF7ED] shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <CategoryGraphic slug={cat.slug} className="w-10 h-10 mb-1.5" showBg={false} />
                      <span className={`text-xs font-semibold leading-tight line-clamp-1 ${
                        isSelected ? 'text-[#9A4E0B]' : 'text-stone-800'
                      }`}>
                        {cat.title}
                      </span>
                    </button>
                  );
                })}
              </div>
              <select
                value={categorySlug}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.number}. {cat.title} ({cat.subcategories.join(', ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Select Subcategories Offered *
              </label>
              <div className="flex flex-wrap gap-2">
                {activeCategory.subcategories.map((sub) => {
                  const active = selectedSubcategories.includes(sub);
                  return (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => toggleSubcategory(sub)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        active
                          ? 'bg-[#F69E40] text-white border-[#F69E40]'
                          : 'bg-[#FAF7F2] text-stone-700 border-stone-200'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Business Description &amp; Pet Care Philosophy (min 10 chars) *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your facility, qualifications, safety protocols, and experience with dogs, cats, or other pets..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Multiple Services & Pricing */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Stage 2: Services &amp; INR Pricing
                </h2>
                <p className="text-xs text-stone-500">
                  Add all services you offer under {activeCategory.title}.
                </p>
              </div>
              <button
                type="button"
                onClick={addServiceRow}
                className="px-3.5 py-2 rounded-xl bg-[#FFF7ED] border border-orange-200 text-xs font-semibold text-[#9A4E0B] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Service
              </button>
            </div>

            <div className="space-y-4">
              {services.map((svc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">Service #{idx + 1}</span>
                    {services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeServiceRow(idx)}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-stone-500 mb-1">Service Name *</label>
                      <input
                        type="text"
                        required
                        value={svc.name}
                        onChange={(e) => {
                          const next = [...services];
                          next[idx].name = e.target.value;
                          setServices(next);
                        }}
                        placeholder="e.g. Full Breed Grooming & Bath"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Subcategory</label>
                      <select
                        value={svc.subcategory}
                        onChange={(e) => {
                          const next = [...services];
                          next[idx].subcategory = e.target.value;
                          setServices(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-sm"
                      >
                        {activeCategory.subcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Price (₹ INR) *</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={svc.priceInr}
                        onChange={(e) => {
                          const next = [...services];
                          next[idx].priceInr = Number(e.target.value);
                          setServices(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={svc.description}
                    onChange={(e) => {
                      const next = [...services];
                      next[idx].description = e.target.value;
                      setServices(next);
                    }}
                    placeholder="What is included in this service?"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Address, Operating Hours & Cancellation Policy */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-stone-900">
              Stage 3: Location, Contact &amp; Operating Hours
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Neighbourhood / Area *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Street Address / Service Area *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Building, street name, landmark..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  min={0}
                  max={80}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Operating Hours &amp; Availability *
                </label>
                <input
                  type="text"
                  required
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cancellation Policy *
                </label>
                <input
                  type="text"
                  required
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Category-Specific Documents & Final Declaration */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-stone-900">
              Stage 4: Verification Credentials &amp; Declaration
            </h2>

            <div className="p-4 rounded-2xl bg-[#FFF7ED] border border-orange-200 space-y-2">
              <p className="text-xs font-bold text-[#9A4E0B] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Required Credentials for {activeCategory.title}:
              </p>
              <ul className="text-xs text-stone-700 list-disc pl-5 space-y-1">
                {activeCategory.requiredDocs.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="text-[11px] text-stone-500 pt-1">
                Security Notice: Document references are stored in restricted private storage (
                <code>/privateDocs/kyc</code>) accessible only to you and TailsHug administrators.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Identity Document Type *
                </label>
                <select
                  value={idDocumentType}
                  onChange={(e) => setIdDocumentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                >
                  <option value="Aadhaar / PAN Card">Aadhaar / PAN Card</option>
                  <option value="Passport / Driving License">Passport / Driving License</option>
                  <option value="Veterinary Council Registration">
                    Veterinary Council Registration (VCI)
                  </option>
                  <option value="NGO / Trust Registration">NGO / Trust Registration</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Document Reference / Last 4 Digits / License ID *
                </label>
                <input
                  type="text"
                  required
                  value={idDocumentRef}
                  onChange={(e) => setIdDocumentRef(e.target.value)}
                  placeholder="e.g. KA-VCI-4821 or XXXX-9012"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Upload Credential / Certificate File (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setLicenseDocumentName(file.name);
                  }}
                  className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#FFF7ED] file:text-[#9A4E0B]"
                />
                {licenseDocumentName && (
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Attached: {licenseDocumentName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Optional UPI Handle or Payout Preference
                </label>
                <input
                  type="text"
                  value={upiOrPayoutNote}
                  onChange={(e) => setUpiOrPayoutNote(e.target.value)}
                  placeholder="Optional (e.g. Direct Pay at Clinic)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 pt-2 cursor-pointer text-xs text-stone-700">
              <input
                type="checkbox"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-[#F69E40]"
              />
              <span>
                I declare that the business details, category credentials, and safety commitments
                provided above are authentic and comply with TailsHug’s Terms of Use and animal
                welfare standards.
              </span>
            </label>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700"
              >
                ← Previous Step
              </button>
            )}
            <button
              type="button"
              onClick={saveLocalDraft}
              className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-semibold text-stone-800 hover:border-[#F69E40]"
            >
              Save Draft
            </button>
          </div>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-[#18181B] text-white text-xs font-semibold"
            >
              Next Step →
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application for Review'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

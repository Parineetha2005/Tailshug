import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, CheckCircle2, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SERVICE_CATEGORIES } from '../data/categories';
import { useApp } from '../context/AppContext';
import {
  CategoryGraphic,
  IllustratedCatMascot,
  IllustratedDogMascot,
} from '../components/PetMascot';

/**
 * 1. About TailsHug & Founder's Note (/about)
 * Faithfully reflects the official TailsHug document and PDF
 */
export const AboutPage: React.FC = () => {
  const { siteConfig, updateFounderPhoto } = useApp();

  return (
    <div className="max-w-[1140px] mx-auto px-6 py-12 space-y-14">
      {/* Hero: At TailsHug Manifesto */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2">
          <IllustratedCatMascot size="sm" />
          <span className="text-xs font-semibold text-[#9A4E0B] uppercase tracking-wide">
            Our Story &amp; Purpose
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
          About Us
        </h1>
        <p className="text-xl sm:text-2xl text-[#18181B] font-medium leading-snug">
          At TailsHug, we believe pets are family, not just companions.
        </p>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          And when life gets busy, finding the right care for them should feel reassuring, simple, and human.
        </p>
        <p className="text-base text-stone-700 leading-relaxed">
          TailsHug is a pet care marketplace designed to connect pet parents with trusted pet service providers across a wide range of everyday needs. From grooming, boarding, sitting, walking, and training to vet clinics, pet transport, pet ambulance, rescue organisations, events, and custom pet products, TailsHug brings pet care services together on one easy-to-use platform.
        </p>
      </div>

      {/* Founder's Note Card (Page 2 of PDF: Garima, Bekky & Chiku) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Garima, Bekky & Chiku Portrait */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-3/4 bg-stone-100 shadow-sm">
              <img
                src={siteConfig.founderPhotoUrl}
                alt="Garima with Bekky & Chiku — Founder, TailsHug"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-stone-500">Garima, Bekky &amp; Chiku · Founder, TailsHug</p>
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F69E40] hover:underline cursor-pointer">
                <Camera className="w-3.5 h-3.5" />
                Change Photo
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
          </div>

          {/* Full Founder's Note Copy from PDF */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#9A4E0B] uppercase tracking-wide mb-1">
                Founder’s Note
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
                Hello from TailsHug 👋
              </h2>
            </div>

            <div className="space-y-4 text-base text-stone-700 leading-relaxed">
              <p>
                I’m Garima (the human) while the real CEO of this company are my cats,{' '}
                <strong className="text-stone-900">Bekky &amp; Chiku</strong>. They supervise naps, audit
                treats, and remind me daily why pets deserve nothing but love and patience.
              </p>
              <p>
                Having worked across e-commerce, consumer tech, and large platforms, I’ve seen how powerful
                marketplaces can be when they are built with empathy. Yet, when it came to pet care, something
                always felt missing, trust, warmth, and a sense of community. Pets aren’t transactions.
                They’re family.
              </p>
              <p>
                TailsHug was created to make pet care feel human again. A place where pet parents can feel
                reassured, and where service providers who genuinely love animals can grow with dignity and
                respect.
              </p>
              <p>
                My vision is simple:{' '}
                <strong className="text-stone-900">
                  to spread more love in the world through animals.
                </strong>{' '}
                Because pets soften us, heal us, and connect us in ways nothing else can. If TailsHug can make
                even one pet feel safer, one parent feel calmer, or one caregiver feel valued — we’re on the
                right path.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <p className="font-semibold text-stone-900">With love,</p>
              <p className="text-xl font-bold text-[#F69E40]">Garima, Bekky &amp; Chiku</p>
              <p className="text-xs text-stone-500">Founder, TailsHug</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars from PDF: Built for Pet Parents, Powered by Pet Lovers, Simple Safe Community, Our Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Built for Pet Parents */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <IllustratedDogMascot size="sm" />
            <h2 className="text-2xl font-bold text-stone-900">Built for Pet Parents</h2>
          </div>
          <p className="text-base text-stone-600 leading-relaxed">
            We understand how hard it is to leave your pet in someone else’s care. That’s why TailsHug focuses on transparency and choice. Pet parents can explore service options, view provider profiles, compare offerings, and connect directly with providers before making a decision. Whether you need short-term help or ongoing support, TailsHug helps you find care that fits your pet’s routine and your comfort.
          </p>
        </div>

        {/* Powered by Pet Lovers */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <CategoryGraphic slug="boarding" className="w-14 h-14 shrink-0" />
            <h2 className="text-2xl font-bold text-stone-900">Powered by Pet Lovers</h2>
          </div>
          <p className="text-base text-stone-600 leading-relaxed">
            TailsHug service providers are individuals and businesses who genuinely care about animals. From professional groomers and trainers to home-based sitters and walkers, providers on TailsHug offer services in real homes and familiar environments whenever possible, helping pets feel relaxed and cared for.
          </p>
          <p className="text-base text-stone-600 leading-relaxed">
            Service providers can create detailed profiles, manage bookings, communicate with pet parents, and grow their visibility through the platform all while doing what they love.
          </p>
        </div>

        {/* Simple, Safe, and Community-First */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#1F4D3A] shrink-0" />
            <h2 className="text-2xl font-bold text-stone-900">Simple, Safe, and Community-First</h2>
          </div>
          <p className="text-base text-stone-600 leading-relaxed">
            TailsHug is built to make pet care discovery and coordination easier:
          </p>
          <ul className="space-y-2.5 text-base text-stone-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#F69E40] shrink-0 mt-0.5" />
              <span>Browse and discover pet services near you</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#F69E40] shrink-0 mt-0.5" />
              <span>Communicate directly within the platform</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#F69E40] shrink-0 mt-0.5" />
              <span>Manage bookings and payments securely</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#F69E40] shrink-0 mt-0.5" />
              <span>Build trust through profiles and user feedback</span>
            </li>
          </ul>
          <p className="text-sm text-stone-600 pt-2 border-t border-stone-100">
            We are committed to creating a safe, respectful, and supportive ecosystem for both pet parents and service providers.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-[#FFF7ED] rounded-3xl border border-orange-200 p-8 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <IllustratedCatMascot size="sm" />
              <h2 className="text-2xl font-bold text-stone-900">Our Mission</h2>
            </div>
            <p className="text-lg text-stone-800 leading-relaxed font-medium">
              “Our mission is to make pet care more accessible, transparent, and community-driven so that pets receive the attention they deserve, even when their humans can’t be there.”
            </p>
            <p className="text-base text-stone-700 leading-relaxed">
              TailsHug is not just about services. It’s about peace of mind, empathy, and building a connected pet-loving community.
            </p>
          </div>

          <div className="pt-4 border-t border-orange-200/80 flex items-center justify-between">
            <Link
              to="/services"
              className="text-sm font-semibold text-[#F69E40] hover:underline"
            >
              Explore 12 Service Categories →
            </Link>
            <Link
              to="/become-a-provider"
              className="px-4 py-2 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-xs font-semibold transition-colors"
            >
              Join as Provider
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. How TailsHug Works (/how-it-works)
 */
export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-[1140px] mx-auto px-6 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#9A4E0B] uppercase tracking-wide">
            3 Simple Steps
          </p>
          <h1 className="text-3xl font-bold text-stone-900">How TailsHug Works</h1>
        </div>
        <Link
          to="/search"
          className="px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-xs font-semibold w-fit"
        >
          Find Pet Care Now →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            step: '01',
            slug: 'grooming',
            title: 'Discover Nearby Pros',
            desc: 'Browse verified TailsHug providers and local pet-care clinics.',
          },
          {
            step: '02',
            slug: 'boarding',
            title: 'Pick Your Slot',
            desc: 'Select your pet profile, transparent INR package, and preferred time.',
          },
          {
            step: '03',
            slug: 'training',
            title: 'Relax & Review',
            desc: 'Enjoy loving care for your pet and share verified feedback.',
          },
        ].map((item) => (
          <div
            key={item.step}
            className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <CategoryGraphic slug={item.slug} />
              <span className="text-sm font-mono font-bold text-[#F69E40]">{item.step}</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900">{item.title}</h2>
            <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FFF7ED] rounded-3xl border border-orange-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <IllustratedDogMascot size="sm" />
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Are You a Pet Care Professional?
            </h2>
            <p className="text-xs text-stone-600">
              Complete our quick 4-step onboarding to receive bookings in your area.
            </p>
          </div>
        </div>
        <Link
          to="/become-a-provider"
          className="px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-xs font-semibold whitespace-nowrap"
        >
          Become a Provider →
        </Link>
      </div>
    </div>
  );
};

/**
 * 3. Contact & Enquiries Page (/contact)
 */
export const ContactPage: React.FC = () => {
  const { user, siteConfig, triggerMascot } = useApp();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0].title);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (honeypot) return; // Spam prevention

    if (!user || !user.emailVerified) {
      setError(
        'Please sign in with a verified account to submit an online support ticket, or email us directly at care@tailshug.com.'
      );
      return;
    }

    if (name.trim().length < 2 || subject.trim().length < 3 || message.trim().length < 10) {
      setError('Please enter your name, a subject (min 3 chars), and message (min 10 chars).');
      return;
    }

    setSubmitting(true);
    const enqId = `enq_${Date.now()}_${user.uid.slice(0, 6)}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    try {
      await setDoc(doc(db, 'enquiries', enqId), {
        userId: user.uid,
        name: name.trim().slice(0, 95),
        email: email.trim().slice(0, 140),
        ...(phone.trim() ? { phone: phone.trim().slice(0, 24) } : {}),
        category: category.slice(0, 75),
        subject: subject.trim().slice(0, 140),
        message: message.trim().slice(0, 1950),
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
      triggerMascot('celebrate', 'We received your message! Our team will get back to you soon.');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `enquiries/${enqId}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1140px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Column: Authentic TailsHug Contact Details */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <p className="text-xs font-semibold text-[#9A4E0B] uppercase tracking-wide mb-1">
            Get In Touch
          </p>
          <h1 className="text-3xl font-bold text-stone-900">We’d Love to Hear From You</h1>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Have questions about finding pet care, onboarding your pet-care business, or managing a
            booking? Reach out to the TailsHug team in Bengaluru.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#F69E40] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-stone-500">Phone</p>
              <a
                href={`tel:${siteConfig.phone}`}
                className="text-base font-bold text-stone-900 hover:text-[#F69E40]"
              >
                {siteConfig.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#F69E40] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-stone-500">Email</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-base font-bold text-stone-900 hover:text-[#F69E40]"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#F69E40] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-stone-500">Location</p>
              <p className="text-base font-bold text-stone-900">{siteConfig.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Validated Backend Enquiry Form */}
      <div className="lg:col-span-7">
        {submitted ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-[#1F4D3A] mx-auto" />
            <h2 className="text-2xl font-bold text-stone-900">Enquiry Submitted</h2>
            <p className="text-sm text-stone-600">
              Thank you for contacting TailsHug. Your enquiry has been logged in our support system.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setSubject('');
                setMessage('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#F69E40] text-white text-xs font-semibold"
            >
              Send Another Enquiry
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleEnquirySubmit}
            className="bg-white rounded-3xl border border-stone-200 p-6 lg:p-8 space-y-4"
          >
            <h2 className="text-xl font-bold text-stone-900">Send an Enquiry</h2>
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                {error}
              </div>
            )}

            {/* Honeypot field */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Relevant Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
                >
                  <option value="General Support">General Support</option>
                  <option value="Provider Onboarding">Provider Onboarding</option>
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Message (min 10 chars) *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your enquiry or feedback here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-sm font-semibold transition-colors"
            >
              {submitting ? 'Sending...' : 'Submit Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/**
 * 4. Original TailsHug Privacy & Cookie Policy (/privacy)
 */
export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 lg:p-12 space-y-6 text-sm text-stone-700 leading-relaxed">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
          <h1 className="text-3xl font-bold text-stone-900">Privacy &amp; Cookie Policy</h1>
          <span className="text-xs font-semibold text-stone-500">
            Effective Date: 5 November 2025
          </span>
        </div>

        <p>
          TailsHug (“TailsHug”, “we”, “our”, or “us”) respects your privacy and is committed to
          protecting your personal information. This Privacy Policy explains what information we
          collect when you visit or use our website www.tailshug.com, mobile application, or any
          related communication tools (collectively, the “Platform”), how we use that information,
          and under what circumstances we may share it while you use our pet-care marketplace and
          related services.
        </p>

        <h2 className="text-lg font-bold text-stone-900 pt-2">1. Information Collection Sources</h2>
        <p>
          <strong>Pet Parents (Consumers):</strong> During account setup, we collect basic details
          such as your name, your pet(s) details, phone number, email address, and PIN or ZIP code.
        </p>
        <p>
          <strong>Service Providers (Pet Professionals):</strong> When you register as a pet service
          provider, we collect your name, business or brand name, contact number, service location,
          service descriptions, and email address, as well as private verification credentials.
        </p>

        <h2 className="text-lg font-bold text-stone-900 pt-2">2. How We Use Information</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Providing Services:</strong> To create and manage your account, verify your
            identity, and deliver all Platform features and pet-care services you request.
          </li>
          <li>
            <strong>Customer Support:</strong> To respond to your queries, handle concerns, and
            offer timely assistance.
          </li>
          <li>
            <strong>Compliance &amp; Security:</strong> To prevent fraud, resolve disputes, protect
            community safety, and enforce our Terms of Use.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-stone-900 pt-2">
          3. Legal Information &amp; Contact Details
        </h2>
        <p>
          For data protection and privacy-related matters, TailsHug acts as the Data Controller
          responsible for managing and safeguarding your information. Contact our Data Protection
          Team at <strong>tailshug25@gmail.com</strong> or <strong>care@tailshug.com</strong>,
          Bengaluru - 64, India.
        </p>
      </div>
    </div>
  );
};

/**
 * 5. Original TailsHug Terms of Use & Cancellation/Refund Policy (/terms)
 */
export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 lg:p-12 space-y-6 text-sm text-stone-700 leading-relaxed">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
          <h1 className="text-3xl font-bold text-stone-900">
            Terms of Use &amp; Cancellation / Refund Policy
          </h1>
          <span className="text-xs font-semibold text-stone-500">
            Effective Date: December 01, 2025
          </span>
        </div>

        <h2 className="text-lg font-bold text-stone-900">1. About TailsHug</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            TailsHug is a marketplace platform that connects pet owners (“Pet Parents”) with
            independent pet service providers (“Service Providers”) offering pet-related services.
          </li>
          <li>
            TailsHug acts as a facilitator; Service Providers are independent individuals or
            businesses.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-stone-900">2. Accounts and Verification</h2>
        <p>
          You must be at least 18 years old to use TailsHug and provide accurate personal and
          contact details. TailsHug may request identity verification or conduct background checks
          for community safety.
        </p>

        <h2 className="text-lg font-bold text-stone-900">
          3. Shipping, Cancellation &amp; Refund Policy
        </h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Services:</strong> No physical shipping is involved for services such as
            grooming, boarding, sitting, walking, training, or consultations.
          </li>
          <li>
            <strong>Cancellations by Pet Parents:</strong> Pet parents may cancel a booking within
            the time window specified on the service listing or booking confirmation.
          </li>
          <li>
            <strong>Cancellations by Service Providers:</strong> If a service provider cancels a
            confirmed booking, TailsHug assists in finding an alternative provider.
          </li>
          <li>
            <strong>Contact Us:</strong> +91 93539 78831 · support@tailshug.com · Bengaluru, India.
          </li>
        </ul>
      </div>
    </div>
  );
};

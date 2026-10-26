/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { SearchPage } from './pages/SearchPage';
import {
  BookingPage,
  GooglePlaceDetailsPage,
  ProviderProfilePage,
} from './pages/ProviderAndBookingPages';
import { OnboardingPage } from './pages/OnboardingPage';
import { ForgotPasswordPage, LoginPage, SignupPage } from './pages/AuthPages';
import {
  AdminDashboardPage,
  CustomerDashboardPage,
  ProviderDashboardPage,
} from './pages/DashboardsPage';
import {
  AboutPage,
  ContactPage,
  HowItWorksPage,
  PrivacyPolicyPage,
  TermsPage,
} from './pages/InfoAndLegalPages';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:category" element={<ServicesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/provider/:id" element={<ProviderProfilePage />} />
            <Route path="/google-places/:placeId" element={<GooglePlaceDetailsPage />} />
            <Route path="/book/:providerId" element={<BookingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/become-a-provider" element={<OnboardingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard/customer" element={<CustomerDashboardPage />} />
            <Route path="/dashboard/provider" element={<ProviderDashboardPage />} />
            <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/terms-conditions" element={<TermsPage />} />
            <Route path="/refund-policy" element={<TermsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

// src/pages/LandingPage.jsx
import React from 'react';
import Header from '../components/Header';
import GradientButton from '../components/Button';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-primary">
      <Header>
        <GradientButton to="/convert">Dashboard</GradientButton>
        <GradientButton to="/about">About</GradientButton>
      </Header>
      <main className="flex-grow flex flex-col">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}

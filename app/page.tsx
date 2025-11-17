'use client';

import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import TeamInfo from "./components/TeamInfo";
import TeamFeatures from "./components/TeamFeatures";
import TeamSpirit from "./components/TeamSpirit";
import SocialLinks from "./components/SocialLinks";
export default function Home() {
  return (
    <div className="relative min-h-screen bg-neutral-900">
      {/* Fixed navigation */}
      <Navigation />
      
      {/* Main content sections */}
      <main className="relative">
        {/* Hero Section */}
        <section id="hero">
          <Hero />
        </section>
        
        {/* Team Info Section */}
        <section id="team-info" className="bg-neutral-900">
          <TeamInfo />
        </section>
        
        {/* Team Features Section */}
        <section id="features" className="bg-neutral-900">
          <TeamFeatures />
        </section>
        
        {/* Team Spirit Section */}
        <section id="spirit">
          <TeamSpirit />
        </section>
        
        {/* Social Links Footer */}
        <section id="social" className="bg-neutral-900">
          <SocialLinks />
        </section>
      </main>
    </div>
  );
}

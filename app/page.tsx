'use client';

import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import TeamInfo from "./components/TeamInfo";
import TeamFeatures from "./components/TeamFeatures";
import TeamSpirit from "./components/TeamSpirit";
import SocialLinks from "./components/SocialLinks";
import CursorGlow from "./components/ui/CursorGlow";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-neutral-900">
      {/* Global cursor glow effect */}
      <CursorGlow />
      
      {/* Fixed navigation */}
      <Navigation />
      
      {/* Main content sections */}
      <main className="relative">
        {/* Hero Section */}
        <section id="hero">
          <Hero />
        </section>
        
        {/* Team Info Section */}
        <section id="team-info" className="py-20 bg-neutral-900">
          <TeamInfo />
        </section>
        
        {/* Team Features Section */}
        <section id="features" className="py-20 bg-neutral-900">
          <TeamFeatures />
        </section>
        
        {/* Team Spirit Section */}
        <section id="spirit" className="py-20">
          <TeamSpirit />
        </section>
        
        {/* Social Links Footer */}
        <section id="social" className="py-20 bg-neutral-900">
          <SocialLinks />
        </section>
      </main>
    </div>
  );
}

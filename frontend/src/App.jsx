import React from 'react';
import { LayoutWrapper } from './components/LayoutWrapper';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';

export function App() {
  return (
    <LayoutWrapper>
      <Hero />
      <AboutSection />
    </LayoutWrapper>
  );
}

export default App;

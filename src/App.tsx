import { useState } from 'react';
import { MysteryBoxGame } from './components/MysteryBoxGame';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <MysteryBoxGame />
    </div>
  );
}
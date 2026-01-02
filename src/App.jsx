import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import PokemonPage from './PokemonPage';
import PokemonDetails from './PokemonDetails';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<PokemonPage />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App

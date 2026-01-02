import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PokemonPage() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}pokemon?limit=40`);
        setPokemonList(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokemon');
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pokemon-page">
      <h1>Pokemon List</h1>
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <Link to={`/pokemon/${pokemon.name}`} key={pokemon.name} className="pokemon-card-link">
            <div className="pokemon-card">
              <h3>{pokemon.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PokemonPage;

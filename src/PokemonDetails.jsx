import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PokemonDetails() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}pokemon/${name}`);
        setPokemon(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokemon details');
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!pokemon) return null;

  return (
    <div className="pokemon-details-page">
      <Link to="/" className="back-link">← Back to List</Link>
      <div className="pokemon-details-card">
        <h1>{pokemon.name}</h1>
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="pokemon-sprite"
        />
        <div className="pokemon-types">
          {pokemon.types.map((type) => (
            <span key={type.type.name} className="type-badge">
              {type.type.name}
            </span>
          ))}
        </div>
        <div className="pokemon-stats">
          <h3>Stats</h3>
          <ul>
            {pokemon.stats.map((stat) => (
              <li key={stat.stat.name}>
                <strong>{stat.stat.name}:</strong> {stat.base_stat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;

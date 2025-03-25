import React, { useEffect, useState } from "react";
import "./styles.css";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => setCountries(data));
  }, []);
  const handleBorderClick = (borderCode) => {
    const borderCountry = countries.find((c) => c.cca3 === borderCode);
    if (borderCountry) {
      setSelectedCountry(borderCountry);
    }
  };
  
  const filteredCountries = countries
    .filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((country) =>
      selectedContinent ? country.continents?.includes(selectedContinent) : true
    );

  const continents = [...new Set(countries.flatMap((c) => c.continents || []))];

  return (
    <div className="container">
      {selectedCountry ? (
        <div className="detail-container">
          <button className="back-button" onClick={() => setSelectedCountry(null)}>← Back</button>
          <div className="detail-content">
            <div className="detail-flag">
              <img src={selectedCountry.flags.png} alt={selectedCountry.name.common} className="flag-large" />
            </div>
            <div className="detail-info">
              <h1 className="country-name">{selectedCountry.name.common}</h1>
              <p><strong>Native Name:</strong> {Object.values(selectedCountry.name.nativeName || {})[0]?.common || "N/A"}</p>
              <p><strong>Top Level Domain:</strong> {selectedCountry.tld?.join(", ") || "N/A"}</p>
              <p><strong>Population:</strong> {selectedCountry.population.toLocaleString()}</p>
              <p><strong>Region:</strong> {selectedCountry.region}</p>
              <p><strong>Capital:</strong> {selectedCountry.capital?.[0] || "N/A"}</p>
              <p><strong>Currency:</strong> {Object.values(selectedCountry.currencies || {}).map(cur => cur.name).join(", ") || "N/A"}</p>
              <p><strong>Languages:</strong> {Object.values(selectedCountry.languages || {}).join(", ") || "N/A"}</p>

              <div>
              <strong>Borders:</strong>
             {selectedCountry.borders ? (
              selectedCountry.borders.map((border) => (
              <button key={border} className="badge" onClick={() => handleBorderClick(border)}>
              {border}
              </button>
              ))
              )  : (
                  <span>No borders...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <nav className="navbar">
            <input
              type="text"
              placeholder="Search country..."
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter"
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
            >
              <option value="">All Continents</option>
              {continents.map((continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
          </nav>

          <div className="grid">
            {filteredCountries.map((country) => (
              <div
                key={country.cca3}
                className="card"
                onClick={() => setSelectedCountry(country)}
              >
                <img src={country.flags.png} alt={country.name.common} className="flag" />
                <h2 className="country-title">{country.name.common}</h2>
                <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> {country.region}</p>
                <p><strong>Capital:</strong> {country.capital?.[0] || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

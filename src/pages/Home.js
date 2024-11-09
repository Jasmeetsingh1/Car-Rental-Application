import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const Home = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("Please select a country first.");
  const [countries, setCountries] = useState([]);

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedCity("");
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
  };

  const handleSubmit = () => {
    if (!userId) {
      alert("Please sign in to continue.");
      return;
    }
    navigate(`/carRentPage`, {
      state: { country: selectedCountry, city: selectedCity },
    });
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/countries")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-cover bg-no-repeat bg-[url('https://utfs.io/f/4fa96a94-87d8-418f-9c29-2f3a2bc36b40-1nq2cb.jpg')]">
      <Layout />
      <div className="mx-auto h-screen flex items-center mt-20 flex-col ">
        <div className="my-5 text-center space-y-4 ">
          <h1 className="text-6xl font-bold">Welcome to ZoomCar</h1>
        </div>
        <div className="mt-2 mb-4">
          <h1 className="text-4xl font-bold">Select your country/city</h1>
        </div>
        <div className="flex space-x-4">
          <select
            className="w-1/2 px-16 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="Country"
            onChange={handleCountryChange}
            required
          >
            <option value="" disabled selected hidden>
              Select country
            </option>
            {countries.map((country) => (
              <option key={country._id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <select
            className="w-1/2 px-16 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="City"
            onChange={handleCityChange}
            required
            disabled={!selectedCountry}
          >
            <option value="" disabled selected hidden>
              {selectedCountry ? "Select city" : "Please select a country first"}
            </option>
            {selectedCountry &&
              countries.find((country) => country.name === selectedCountry)?.cities.map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-green-600 text-white text-xl font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="submit"
            onClick={handleSubmit}
            disabled={!selectedCity}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useEffect, useState, useCallback } from "react";
import Layout from "./Layout";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";

const CarRentPage = () => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cars, setCars] = useState([]);
  const location = useLocation();
  const { country, city } = location.state || {};

  useEffect(() => {
    console.log("Auth state:", { isLoaded, isSignedIn, userId });
  }, [isLoaded, isSignedIn, userId]);

  const fetchCars = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !userId) {
      return;
    }

    try {
      console.log("Fetching cars...");
      const response = await fetch("http://localhost:8080/api/cars");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Cars data:", data);

      // Filter cars based on the selected city
      const filteredCars = data.filter(car => car.carCity === city);
      setCars(filteredCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cars. Please try again later.",
        type: "error",
      });
    }
  }, [isLoaded, isSignedIn, userId, city, toast]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log("User not authenticated, redirecting to home...");
      navigate("/");
    } else if (isLoaded && isSignedIn) {
      console.log("User authenticated, fetching cars...");
      fetchCars();
    }
  }, [isLoaded, isSignedIn, navigate, fetchCars]);

  const handleRent = async (carId) => {
    if (!isLoaded || !isSignedIn || !userId) {
      return;
    }

    try {
      console.log(`Renting car with ID: ${carId}`);
      const response = await fetch(`http://localhost:8080/api/car/rent/${carId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserId: userId }),
      });

      if (response.ok) {
        console.log("Car rented successfully!");
        toast({
          title: "Car rented successfully!",
          description: "You have successfully rented the car.",
          type: "success",
        });
        fetchCars();
      } else {
        console.error("Error renting car:", response.statusText);
        toast({
          title: "Error",
          description: "There was an error renting the car.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error renting car:", error);
      toast({
        title: "Error",
        description: "There was an error renting the car.",
        type: "error",
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Layout />
      <div className="container mx-auto mt-10">
        <h1 className="text-4xl font-bold text-center mb-6">Available Cars in {city}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cars.length === 0 && <p className="text-center">No cars available in this city.</p>}
          {cars.map((car) => (
            <div key={car._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={`http://localhost:8080/${car.carImage}`} // Adjust the image path
                alt={car.carName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{car.carName}</h2>
                <p className="text-gray-700 mb-2">Model: {car.carModel}</p>
                <p className="text-gray-700 mb-2">Type: {car.carType}</p>
                <p className="text-gray-700 mb-2">Seats: {car.carSeats}</p>
                <p className="text-gray-700 mb-2">Fuel: {car.carFuelType}</p>
                <p className="text-gray-700 mb-2">Price: {car.carPrice}</p>
                <p className="text-gray-700 mb-2">Location: {car.carCity}, {car.carCountry}</p>
                <p className="text-gray-700 mb-2">Rent Date: {formatDate(car.startDate)}</p>
                <p className="text-gray-700 mb-2">Return Date: {formatDate(car.endDate)}</p>
                <button
                  onClick={() => handleRent(car._id)}
                  className="mt-4 bg-indigo-500 text-white rounded-md px-4 py-2 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarRentPage;

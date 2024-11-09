import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";

const Host = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    UserId: userId,
    carName: "",
    carNumber: "",
    carModel: "",
    carType: "",
    carSeats: "",
    carFuelType: "",
    carDeliveryType: "",
    carPrice: "",
    carCountry: "",
    carCity: "",
    carImage: null,
    startDate: "",
    endDate: "",
    available: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "startDate" || name === "endDate" ? new Date(value).toISOString().split("T")[0] : value,
    }));

    if (name === "carCountry") {
      const selectedCountry = countries.find((country) => country.name === value);
      setFormData((prevData) => ({
        ...prevData,
        carCity: selectedCountry.cities[0],
      }));
    }
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      carImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await fetch("http://localhost:8080/api/car/add", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("Car added successfully!");
        setFormData({
          UserId: userId,
          carName: "",
          carNumber: "",
          carModel: "",
          carType: "",
          carSeats: "",
          carFuelType: "",
          carDeliveryType: "",
          carPrice: "",
          carCountry: "",
          carCity: "",
          carImage: null,
          startDate: "",
          endDate: "",
          available: true,
        });
        toast({
          title: "Car added successfully!",
          description: "Your car has been added successfully.",
          type: "background",
        });
      } else {
        const errorText = await response.text();
        console.error("Error adding car:", errorText);
        toast({
          title: "Error adding car",
          description: errorText,
          type: "foreground",
        });
      }
    } catch (error) {
      console.error("Error adding car:", error);
      toast({
        title: "Error adding car",
        description: error.message,
        type: "foreground",
      });
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/countries")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  return (
    <div>
      <Layout />
      <div className="flex flex-col items-center justify-center text-gray-900 font-mono space-y-10 my-10 bg-no-repeat bg-cover bg-center bg-[url('https://www.zoomcar.com/build/fb65fcc43b8bededb813e093ea2d47d3.svg')]">
        <div className="flex flex-col items-center justify-center text-gray-900 font-mono space-y-5">
          <h1 className="text-6xl font-bold">Welcome Host</h1>
          <h3 className="text-3xl font-normal">
            Please Submit the details of the car you want to rent out!
          </h3>
        </div>
        <div className="mt-10 flex items-center justify-center text-gray-900 font-mono">
          <form
            className="flex flex-col items-center justify-center"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4 grid grid-cols-2 items-center justify-center">
              <label htmlFor="carName">Car Name:</label>
              <input
                type="text"
                onChange={handleChange}
                value={formData.carName}
                id="carName"
                name="carName"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                focus:ring-2 focus:ring-indigo-400"
                required
              />

              <label htmlFor="carNumber">Car Number:</label>
              <input
                type="text"
                onChange={handleChange}
                value={formData.carNumber}
                id="carNumber"
                name="carNumber"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                focus:ring-2 focus:ring-indigo-400"
                required
              />

              <label htmlFor="carModel">Car Model:</label>
              <input
                type="text"
                onChange={handleChange}
                value={formData.carModel}
                id="carModel"
                name="carModel"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                          focus:ring-2 focus:ring-indigo-400"
                required
              />

              <label htmlFor="carType">Car Type:</label>
              <select
                id="carType"
                name="carType"
                onChange={handleChange}
                value={formData.carType}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                          focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="" disabled hidden>
                  Select type
                </option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
              </select>

              <label htmlFor="carSeats">Car Seats:</label>
              <input
                type="number"
                onChange={handleChange}
                value={formData.carSeats}
                id="carSeats"
                name="carSeats"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                            focus:ring-2 focus:ring-indigo-400"
                required
              />

              <label htmlFor="carFuelType">Fuel Type:</label>
              <select
                id="carFuelType"
                name="carFuelType"
                onChange={handleChange}
                value={formData.carFuelType}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                          focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="" disabled hidden>
                  Select fuel type
                </option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>

              <label htmlFor="carDeliveryType">Delivery Type:</label>
              <select
                id="carDeliveryType"
                name="carDeliveryType"
                onChange={handleChange}
                value={formData.carDeliveryType}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                            focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="" disabled hidden>
                  Select delivery type
                </option>
                <option value="Self">Self</option>
                <option value="Doorstep">Doorstep</option>
              </select>

              <label htmlFor="carPrice">Price:</label>
              <input
                type="text"
                onChange={handleChange}
                value={formData.carPrice}
                id="carPrice"
                name="carPrice"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                            focus:ring-2 focus:ring-indigo-400"
                required
              />

              <label htmlFor="carCountry">Country:</label>
              <select
                id="carCountry"
                name="carCountry"
                onChange={handleChange}
                value={formData.carCountry}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                          focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="" disabled hidden>
                  Select country
                </option>
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>

              <label htmlFor="carCity">City:</label>
              <select
                id="carCity"
                name="carCity"
                onChange={handleChange}
                value={formData.carCity}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                          focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="" disabled hidden>
                  Select city
                </option>
                {countries.map((country) =>
                  country.cities.map((city, i) => (
                    <option key={i} value={city}>
                      {city}
                    </option>
                  ))
                )}
              </select>

              <label htmlFor="carImage">Car Image:</label>
              <input
                type="file"
                id="carImage"
                name="carImage"
                onChange={handleImageChange}
                accept="image/*"
                required
              />

              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                focus:ring-2 focus:ring-indigo-400"
                required
              />

              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none 
                focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="mt-4 flex space-x-4">
              <input
                type="submit"
                value="Submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md focus:outline-none 
                focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="reset"
                value="Reset"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md focus:outline-none 
                focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md focus:outline-none 
                focus:ring-2 focus:ring-indigo-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Host;

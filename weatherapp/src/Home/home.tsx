import React, { useState, useEffect } from "react";
import axios from "axios";
import '../App.css'

const Home = () => {

  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [note, setNote] = useState(""); 
  const [notes, setNotes] = useState([]); 

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeather(lat, lon);
      });
    }
  }, []);

  const getWeather = async (lat, lon) => {
    try {
      const apiKey = "b83c34073e715df55d87c2ea9a15a1aa";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      setLocation(response.data.name);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };


  const handleInputChange = (event) => {
    setNote(event.target.value);
  };


  const handleSaveNote = () => {
    if (note.trim()) {
      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      setNote(""); 

      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    }
  };

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(savedNotes);
  }, []);

  return (
    <div className="app">
      <h1>Mood Journal</h1>
      
      {/* Weather Section */}
      <div className="weather-section">
        <h2>Weather</h2>
        {weatherData ? (
          <div>
            <h3>{location}</h3>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Weather: {weatherData.weather[0].description}</p>
          </div>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>

      <div className="journal-section">
        <h2>Mood Journal</h2>
        <textarea
          value={note}
          onChange={handleInputChange}
          placeholder="Write your journal note here..."
          rows={4}
          cols={50}
        />
        <button onClick={handleSaveNote}>Save Note</button>

        <h3>Your Saved Journal Notes:</h3>
        <ul>
          {notes.map((savedNote, index) => (
            <li key={index}>{savedNote}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

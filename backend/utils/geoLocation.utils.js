import axios from "axios";

// Function to get geolocation based on IP
export const getGeoLocation = async (ip) => {
    try {
      // Call the external geolocation API to get location based on IP
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      
      if (response.data.status === 'success') {
        return {
          city: response.data.city,
          country: response.data.country,
        };
      } else {
        return {
          city: 'Unknown',
          country: 'Unknown',
        };
      }
    } catch (error) {
      console.error('Error fetching geolocation:', error);
      return {
        city: 'Unknown',
        country: 'Unknown',
      };
    }
  };
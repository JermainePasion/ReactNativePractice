import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

export default function App() {
  const [flexValue, setFlexValue] = useState('Fetching...');
  const ip = '192.168.100.239'; // Replace with your ESP8266 IP
  const path = '/read';

  const fetchFlexValue = async () => {
    try {
      const response = await axios.get(`http://${ip}${path}`);
      setFlexValue(response.data);
    } catch (error) {
      setFlexValue('Error reading sensor');
      console.log('Error:', error.message);
    }
  };

  // Auto-update using setInterval
  useEffect(() => {
    fetchFlexValue(); // Initial fetch
    const interval = setInterval(fetchFlexValue, 1000); // Update every 1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Flex Sensor Reading</Text>
      <Text style={{ marginTop: 20, fontSize: 28 }}>{flexValue}</Text>
    </View>
  );
}

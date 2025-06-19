import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import axios from 'axios';
import Tflite from 'tflite-react-native';
const tflite = new Tflite();

export default function App() {
  const [flexValue, setFlexValue] = useState('Fetching...');
  const [numericValue, setNumericValue] = useState(null);
  const ip = '192.168.100.63'; // ESP8266 IP
  const path = '/read';

  const fetchFlexValue = async () => {
    try {
      const response = await axios.get(`http://${ip}${path}`);
      const rawValue = response.data;
      const parsed = parseInt(rawValue.match(/\d+/)); // Extract number
      setFlexValue(rawValue);
      setNumericValue(parsed);
    } catch (error) {
      setFlexValue('Error reading sensor');
      console.log('Error:', error.message);
    }
  };

  const setBaseline = async () => {
    if (numericValue !== null) {
      try {
        const response = await axios.get(`http://192.168.100.8:3000/set_baseline?value=${numericValue}`);
        Alert.alert("Success", `Baseline set to ${numericValue}`);
      } catch (error) {
        Alert.alert("Error", "Could not set baseline");
        console.log('Error:', error.message);
      }
    } else {
      Alert.alert("Wait", "No valid sensor value yet");
    }
  };

  useEffect(() => {
    fetchFlexValue(); // Initial fetch
    const interval = setInterval(fetchFlexValue, 1000); // Update every 1 second

    return () => clearInterval(interval); // Cleanup
  }, []);

tflite.loadModel({
  model: 'posture_model.tflite',
  labels: 'labels.txt', // optional — only if you have one
},
(err, res) => {
  if (err) console.error('Model load error:', err);
  else console.log('Model loaded.');
});

// Now call this when you want a prediction
const input = [21]; // your input value(s)

tflite.runModelOnInput({
  input: input,
  shape: [1, 1], // e.g., shape for [batchSize, features]
  type: 'float32',
},
(err, res) => {
  if (err) console.error('Prediction error:', err);
  else console.log('Prediction result:', res);
});
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20, textAlign: 'center' }}>
        Sit straight and press the button to register posture.
      </Text>

      <Text style={{ fontSize: 18 }}>Flex Sensoreading:</Text>
      <Text style={{ marginTop: 10, fontSize: 28 }}>{flexValue}</Text>

      <View style={{ marginTop: 40 }}>
        <Button
          title="Set Baseline"
          onPress={async () => {
            try {
              const response = await axios.get(`http://192.168.100.8:3000/set_baseline?value=${numericValue}`);
              console.log(response.data);
              Alert.alert("Success", `Baseline set to ${numericValue}`);
            } catch (error) {
              console.error("Failed to set baseline", error);
              Alert.alert("Error", "Could not set baseline");
            }
          }}
        />
        <Button title="Predict Posture" onPress={() => runPrediction(21)} />
      </View>
    </View>
  );
}

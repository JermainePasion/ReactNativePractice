import tensorflow as tf

# Load the Keras model
model = tf.keras.models.load_model('posture_model.h5')

# Convert to TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save the .tflite model
with open('posture_model.tflite', 'wb') as f:
    f.write(tflite_model)

print("Model converted to TensorFlow Lite!")

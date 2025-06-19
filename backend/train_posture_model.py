import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Step 1: Load and clean data
df = pd.read_csv("flex_log.csv")
df = df.dropna()  # Just in case

# Step 2: Encode labels (good=1, bad=0)
label_encoder = LabelEncoder()
df['label'] = label_encoder.fit_transform(df['label'])

# Step 3: Prepare features and labels
X = df[['flex_value']].values  # features: 1D flex value
y = df['label'].values         # labels: good/bad

# Step 4: Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 5: Build a simple neural network
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(1,)),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(8, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')  # Binary output
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Step 6: Train the model
model.fit(X_train, y_train, epochs=50, batch_size=4, validation_data=(X_test, y_test))

# Step 7: Save the model
model.save("posture_model.h5")
print("Model saved as posture_model.h5")

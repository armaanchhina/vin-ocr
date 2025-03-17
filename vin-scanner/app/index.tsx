import React, { useState, useRef } from "react";
import { View, Alert, Image, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { uploadToS3 } from "@/scripts/s3Upload"; // Upload function
import 'react-native-get-random-values';
import CameraView from "@/components/CameraView";
import RoomKeyInput from "@/components/RoomKeyInput";
import styles from "@/components/styles"

export default function VINScannerApp() {
  const [roomKey, setRoomKey] = useState<string | null>(null);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {roomKey === null ? (
          <RoomKeyInput onRoomKeyEntered={setRoomKey} />
        ) : (
          <CameraView roomKey={roomKey} changeRoomKey={() => setRoomKey(null)} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
  
}







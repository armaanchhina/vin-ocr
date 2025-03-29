import React, { useState, useRef, useEffect } from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import "react-native-get-random-values";
import CameraView from "@/components/CameraView";
import RoomKeyInput from "@/components/RoomKeyInput";
import styles from "@/components/styles";
import { LinearGradient } from "expo-linear-gradient";

export default function VINScannerApp() {
  const [roomKey, setRoomKey] = useState<string | null>(null);

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {roomKey === null ? (
            <RoomKeyInput onRoomKeyEntered={setRoomKey} />
          ) : (
            <CameraView
              roomKey={roomKey}
              changeRoomKey={() => setRoomKey(null)}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

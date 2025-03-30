import React, { memo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import styles from "./styles";
import { useState } from "react";
import * as Haptics from "expo-haptics";

interface RoomKeyInputProps {
  onRoomKeyEntered: (roomKey: string) => void;
}

const RoomKeyInput: React.FC<RoomKeyInputProps> = ({ onRoomKeyEntered }) => {
  const [roomKey, setRoomKey] = useState("");

  const enterRoomKey = () => {
    if (!roomKey.trim())
      return Alert.alert("Error", "Please enter a Room Key ID.");
    Haptics.selectionAsync();
    onRoomKeyEntered(roomKey);
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>Enter Room Key</Text>
      <TextInput
        placeholder="Room ID"
        style={styles.input}
        value={roomKey}
        onChangeText={setRoomKey}
        onSubmitEditing={enterRoomKey}
        returnKeyType="done"
      />
      <TouchableOpacity onPress={enterRoomKey} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(RoomKeyInput);

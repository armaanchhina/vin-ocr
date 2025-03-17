import React, { memo } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard } from "react-native";
import styles from "./styles";
import { useState } from "react";

interface RoomKeyInputProps {
  onRoomKeyEntered: (roomKey: string) => void;
}

const RoomKeyInput: React.FC<RoomKeyInputProps> = ({ onRoomKeyEntered }) => {
    const [roomKey, setRoomKey] = useState("");
    
    const enterRoomKey = () => {
        if (!roomKey.trim()) return Alert.alert("Error", "Please enter a Room Key ID.");
        onRoomKeyEntered(roomKey);
        Keyboard.dismiss();
      };

    return (
        <View style={{alignItems: "center"}}>
        <Text style={styles.label}>Enter Room Key ID:</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter Room Key"
            value={roomKey}
            onChangeText={setRoomKey}
            keyboardType="default"
            returnKeyType="done"
            onSubmitEditing={enterRoomKey}
        />
        <TouchableOpacity onPress={enterRoomKey} style={styles.button}>
            <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
        </View>
    );
};

export default memo(RoomKeyInput);

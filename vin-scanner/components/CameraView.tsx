import React, { memo } from "react";
import { View, Text, Image, Alert } from "react-native";
import { Camera } from "react-native-vision-camera"
import { uploadToS3 } from "@/scripts/s3Upload";
import Button from "./Button";
import styles from "./styles";
import { useState, useRef } from "react";
import { useCameraDevice } from "react-native-vision-camera";

interface CameraViewProps {
    roomKey: string;
    changeRoomKey: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({
    roomKey,
    changeRoomKey
}) => {
    const cameraRef = useRef<Camera>(null);
    const device = useCameraDevice("back");
    const [photo, setPhoto] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const takePicture = async () => {
        if (!cameraRef.current) return Alert.alert("Camera not available");

        try {
        const photo = await cameraRef.current.takePhoto();
        setPhoto(photo.path);
        } catch (error: any) {
        Alert.alert("Error taking picture", error.message);
        }
    };

    const handleUpload = async () => {
        if (!photo) return;
        setUploading(true);
        setUploadError(null);

        const result = await uploadToS3(photo, roomKey);

        setUploading(false);

        if (!result.success) {
            setUploadError("Upload failed. Please try again.");
        }
    };

    return (
        <View style={styles.viewContainer}>
        <Text style={styles.label}>Room ID: {roomKey}</Text>
        <Button onPress={changeRoomKey} text="🔄 Change Room Key" style={styles.changeRoomButton} />
        {uploadError && (
            <Text style={styles.errorText}>{uploadError}</Text>
        )}
        {photo ? (
            <>
            <Image source={{ uri: photo }} style={styles.mediaView} />

            <View style={styles.buttonRow}>
                <Button onPress={() => { setPhoto(null); setUploadError(null); }} text="❌ Retake" style={{...styles.cancelButton, ...styles.button}} />
                <Button onPress={handleUpload} text={uploading ? "Uploading..." : "✅ Send"} style={{...styles.uploadButton, ...styles.button}} />
            </View>
            </>
        ) : (
            <>
            {device && <Camera ref={cameraRef} style={styles.mediaView} device={device} photo isActive />}
            <Button onPress={takePicture} text="Capture VIN" style={styles.button} />
            </>
        )}
        </View>
    );
};

export default memo(CameraView);

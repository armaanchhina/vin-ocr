import { TouchableOpacity, Text } from "react-native"

interface ButtonProps {
    onPress: () => void;
    text: string;
    style?: any
}

export default function Button({ onPress, text, style }: ButtonProps){
    return (
        <TouchableOpacity onPress={onPress} style={style}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{text}</Text>
        </TouchableOpacity>
    )
}
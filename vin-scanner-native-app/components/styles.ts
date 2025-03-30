import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  // Room Key Input
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  inputWrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: "80%",
    borderRadius: 5,
    backgroundColor: "white",
    textAlign: "center",
    marginBottom: 10,
  },

  // Unified Camera & Preview Container
  viewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    width: "100%",
  },

  mediaView: {
    width: "90%",
    height: "55%",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
  },

  // Buttons
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },

  cancelButton: { backgroundColor: "red", flex: 1, marginRight: 10 },
  uploadButton: { backgroundColor: "green", flex: 1, marginLeft: 10 },
  changeRoomButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 8,
    width: "60%",
    alignItems: "center",
    marginBottom: 10,
  },

  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    width: "80%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default styles;

import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useFonts } from "expo-font";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [loaded] = useFonts({
    Figure: require("./assets/fonts/Figure.ttf"),
    Grafies: require("./assets/fonts/Grafies.otf"),
    Denike: require("./assets/fonts/Denike.otf"),
  });

  const viewShot = useRef();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark");

  const handleTheme = () => {
    if (theme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const handleSave = () => {
    viewShot.current
      .capture()
      .then((uri) => {
        MediaLibrary.saveToLibraryAsync(uri);
      })
      .then(() => Alert.alert("Success", "Photo saved to gallery"))
      .catch((err) => console.log(err));
  };
  const FetchQuote = async () => {
    setLoading(true);
    const url = "https://api.quotable.io/random?minLength=100&maxLength=140";
    await fetch(url)
      .then((res) => res.json())
      .then((res) => setData(res))
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    FetchQuote();
  }, []);
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme == "dark" ? "#2f2f2f" : "#f2f2f2" },
      ]}
    >
      <TouchableOpacity
        style={{ position: "absolute", top: 50, right: 20, zIndex: 2 }}
        onPress={() => handleTheme()}
      >
        <Feather
          name="sun"
          size={24}
          color={theme == "dark" ? "#f2f2f2" : "#2f2f2f"}
        />
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <>
          <ViewShot
            style={{
              paddingHorizontal: "10%",
              backgroundColor: theme == "dark" ? "#2f2f2f" : "#f2f2f2",
              flex: 1,
              justifyContent: "center",
            }}
            ref={viewShot}
            options={{ format: "jpg", quality: 0.9 }}
          >
            <Text
              style={{
                fontFamily: "Grafies",
                textAlign: "left",
                color: theme == "dark" ? "#f2f2f2" : "#2f2f2f",
              }}
            >
              {data?.content}
            </Text>
            <Text
              style={{
                fontFamily: "Denike",
                fontWeight: "bold",
                textAlign: "right",
                marginTop: 20,
                color: theme == "dark" ? "#f2f2f2" : "#2f2f2f",
                textTransform: "uppercase",
              }}
            >
              {`~ ${data?.author}`}
            </Text>
          </ViewShot>
          <View
            style={{ position: "absolute", bottom: 50, alignSelf: "center" }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme == "dark" ? "#444444" : "#d9d9d9",
                alignSelf: "center",
                paddingHorizontal: 66,
                borderRadius: 8,
                paddingBottom: 8,
                paddingTop: 8,
              }}
              onPress={() => handleSave()}
            >
              <MaterialIcons
                name="save-alt"
                size={24}
                color={theme == "dark" ? "#f2f2f2" : "#2f2f2f"}
                style={{ paddingBottom: 5, marginRight: 5 }}
              />
              <Text
                style={{
                  color: theme == "dark" ? "#f2f2f2" : "#2f2f2f",
                  fontSize: 16,
                }}
              >
                Save to gallery
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <StatusBar style={theme == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: "center",
  },
});

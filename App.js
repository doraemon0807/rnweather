import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "3ec86a0a89d6e94d14b1d06d3d9fbb8e";

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [ok, setOk] = useState(true);
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    setCity(location[0].city);

    // const json = await fetch(
    //   `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`
    // ).then((data) => data.json());

    const json = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&appid=${API_KEY}`
      )
    ).json();

    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator style={{ marginTop: 10 }} size="large" />
          </View>
        ) : ok ? (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.date}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}°
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    flex: 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Fontisto
                    size={90}
                    name={icons[day.weather[0].main]}
                    color="black"
                  />
                </View>
                <View
                  style={{
                    flex: 2,
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.desc}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>
                    {day.weather[0].description}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>NO weather for you!</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "black",
    fontSize: 68,
    fontWeight: "600",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  date: {
    fontSize: 22,
  },
  temp: {
    fontSize: 110,
    fontWeight: "600",
  },
  desc: {
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
  },
});

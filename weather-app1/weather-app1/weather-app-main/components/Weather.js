import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import {
  clear_day,
  clear_night,
  cloud_day,
  cloud_night,
  haze_day,
  haze_night,
  rain_day,
  rain_night,
  snow_day,
  snow_night,
} from "../assets/backgrounds/index";

const API_KEY = "2e28c1852dd6c6f9e197fe877c6ebe75";

const Weather = (props) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState("");
  const [background, setBackground] = useState("");

  async function getWeatherData(cityName) {
    setLoading(true);
    const API = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
    let res = await fetch(API);
    if (res.status === 200) {
      res = await res.json();
      setWeatherData(res);
    } else {
      setWeatherData(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    const iconObj = {
      snow: <FontAwesome name="snowflake-o" size={48} color="white" />,
      clear: <Ionicons name="sunny" size={48} color="white" />,
      rain: <Ionicons name="rainy" size={48} color="white" />,
      haze: <Fontisto name="day-haze" size={48} color="white" />,
      cloud: <Ionicons name="cloudy" size={48} color="white" />,
    };

    if (weatherData != null) {
      const now = new Date();
      const sunrise = new Date(weatherData.sys.sunrise * 1000);
      const sunset = new Date(weatherData.sys.sunset * 1000);
      const isDaytime = now > sunrise && now < sunset;

      switch (weatherData.weather[0].main) {
        case "Clouds":
          setIcon(iconObj.cloud);
          isDaytime ? setBackground(cloud_day) : setBackground(cloud_night);
          break;
        case "Snow":
          setIcon(iconObj.snow);
          isDaytime ? setBackground(snow_day) : setBackground(snow_night);
          break;
        case "Clear":
          setIcon(iconObj.clear);
          isDaytime ? setBackground(clear_day) : setBackground(clear_night);
          break;
        case "Rain":
          setIcon(iconObj.rain);
          isDaytime ? setBackground(rain_day) : setBackground(rain_night);
          break;
        case "Haze":
          setIcon(iconObj.haze);
          isDaytime ? setBackground(haze_day) : setBackground(haze_night);
          break;
        default:
          setIcon(iconObj.haze);
          isDaytime ? setBackground(haze_day) : setBackground(haze_night);
      }
      props.background(background);
    }
  }, [weatherData]);

  useEffect(() => {
    if (props.cityName !== "") {
      getWeatherData(props.cityName);
    }
  }, [props.cityName]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  } else if (weatherData == null) {
    return (
      <View>
        <Text style={{ marginTop: 20, fontSize: 24, textAlign: "center" }}>
          Enter City Name
        </Text>
      </View>
    );
  } else {
    const temperatureC = (weatherData.main.temp - 273.15).toFixed(1);

    return (
      <View style={styles.container}>
        <View style={styles.background}></View>
        <Text style={styles.tempText}>{temperatureC}°C</Text>
        <Text style={styles.humidityText}>
          Humidity: {weatherData.main.humidity}%
        </Text>
        <View>{icon}</View>
      </View>
    );
  }
};

export default Weather;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 70,
    paddingLeft: "auto",
    paddingRight: "auto"
  },
  tempText: {
    fontSize: 50,
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  humidityText: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  background: {
    position: "absolute",
    top: 10,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "black",
    opacity: 0.3,

  },
});

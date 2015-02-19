package service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bean.City;

/**
 * Simple util with methods for retrieving information about cities.
 */

public class CityUtils {
	private Map<String, City> biggestCities = new HashMap<String, City>();

	public CityUtils() {
		biggestCities = new HashMap<String, City>();
		storeCity("New York", 0, 8250567);
		storeCity("Moskou", -3, 3849368);
		storeCity("Brussel", -1, 2873326);
		storeCity("Seoel", -1, 2144491);
		storeCity("Sao Paulo", -2, 1512986);
		storeCity("Delhi", 0, 1448396);
		storeCity("Mexico-city", -1, 1296682);
		storeCity("San Diego", -3, 1256951);
		storeCity("Bombay", -1, 1232940);
		storeCity("Peking", -3, 929936);
		storeCity("San Jose", 0, 918849);
		storeCity("Bangkok", 0, 794555);
		storeCity("Indianapolis", 0, 785597);
		storeCity("San Francisco", -3, 744041);
		storeCity("Osaka", 0, 733203);
		storeCity("London", -1, 709893);
		storeCity("Memphis", -1, 670902);
		storeCity("Lagos", -1, 653320);
		storeCity("Calcutta", 0, 640961);
		storeCity("Istanboel", 0, 630478);
		storeCity("El Paso", -2, 609415);
		storeCity("Rio De Janeiro", -1, 602782);
		storeCity("Boston", 0, 590763);
		storeCity("Paris", -3, 582454);
		storeCity("Washington DC", 0, 581530);
		storeCity("Las Vegas", -3, 552539);
		storeCity("Miami", 0, 404048);
		cityTypeMap = makeCityMap();

	}

	public Map<String, City> getCityMap() {
		return (biggestCities);
	}

	private void storeCity(String name, int timeZone, int population) {
		City city = new City(name, timeZone, population);
		name = name.toUpperCase();
		biggestCities.put(name, city);
	}

	public City getCity(String name) {
		name = name.toUpperCase();
		return (biggestCities.get(name));
	}

	public City getCityOrDefault(String name) {
		City city = getCity(name);
		if (city == null) {
			name = name + " (unknown: assuming Antwerp)";
			city = new City(name, 0, 0);
		}
		return (city);
	}

	private Map<String, String[]> cityTypeMap;

	private Map<String, String[]> makeCityMap() {
		String[] topFiveCities = { "New York", "Seoel", "Paris", "Sao Paulo", "El Paso" };
		String[] secondFiveCities = { "Washington DC", "Bombay", "San Diego", "Delhi", "Brussel" };
		String[] citiesStartingWithS = { "Seoel", "San Diego", "San Jose", "San Francisco", "Sao Paulo" };
		Map<String, String[]> cityTypeMap = new HashMap<String, String[]>();
		cityTypeMap.put("top-5-cities", topFiveCities);
		cityTypeMap.put("second-5-cities", secondFiveCities);
		cityTypeMap.put("cities-starting-with-s", citiesStartingWithS);
		return (cityTypeMap);
	}

	public Map<String, String[]> getCityTypeMap() {
		return (cityTypeMap);
	}

	public List<City> findCities(String cityType) {
		String[] cityNames = cityTypeMap.get(cityType);
		if (cityNames == null) {
			String[] twoCities = { "New York", "Paris" };
			cityNames = twoCities;
		}
		List<City> cities = new ArrayList<City>();
		for (String cityName : cityNames) {
			cities.add(getCity(cityName));
		}
		return (cities);
	}
}

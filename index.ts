import { parse } from "https://deno.land/std@0.61.0/flags/mod.ts";
import { fromUnixTime, format } from "https://deno.land/x/date_fns@v2.15.0/index.js";
import AsciiTable from 'https://deno.land/x/ascii_table@v0.1.0/mod.ts';
import { config } from "https://deno.land/x/dotenv/mod.ts";

// Parse required arg "city"
const args = parse(Deno.args);
if (args.city === undefined) {
  console.error('No city supplied');
  Deno.exit();
}

// Fetch weather forecast for this city
const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${args.city}`
  + `&units=metric&appid=${config().API_KEY}`);
const data = await res.json();

// Describe an interface for the items in data.list
interface forecastItem {
  dt: string; // timestamp
  main: { temp: number; }; // temperature
  weather: { description: string; }[]; // weather description
}

// Format data for display
const forecast = data.list.slice(0,8).map((item: forecastItem) => [
  format(fromUnixTime(item.dt), "do LLL, k:m", {}),
  `${item.main.temp.toFixed(1)}C`,
  item.weather[0].description,
]);

// Create an ascii table to print the final results
const table = AsciiTable.fromJSON({
  title: `${data.city.name} Forecast`,
  heading: ['Time', 'Temp', 'Weather'],
  rows: forecast,
});

// Print the table
console.log(table.toString());
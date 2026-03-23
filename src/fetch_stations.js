import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

const SOURCES = [
  {
    url: 'https://api-public.odpt.org/api/v4/gbfs/docomo-cycle-tokyo/station_information.json',
    name: 'docomo_cycle_tokyo_station',
  },
  {
    url: 'https://api-public.odpt.org/api/v4/gbfs/docomo-cycle/station_information.json',
    name: 'docomo_cycle_station',
  },
  {
    url: 'https://api-public.odpt.org/api/v4/gbfs/hellocycling/station_information.json',
    name: 'hellocycling_station',
  },
];

function flattenObject(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val, fullKey));
    } else {
      acc[fullKey] = val ?? '';
    }
    return acc;
  }, {});
}

function toCSV(stations) {
  const flattened = stations.map(s => flattenObject(s));
  const headers = [...new Set(flattened.flatMap(Object.keys))];
  const escape = v => {
    const s = String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const rows = flattened.map(s => headers.map(h => escape(s[h] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}

function toGeoJSON(stations) {
  const features = stations.map(s => {
    const props = flattenObject(s);
    const lon = parseFloat(props.lon);
    const lat = parseFloat(props.lat);
    return {
      type: 'Feature',
      properties: props,
      geometry: {
        type: 'Point',
        coordinates: [lon, lat],
      },
    };
  });
  return { type: 'FeatureCollection', features };
}

async function fetchAndSave({ url, name }) {
  console.log(`Fetching ${url} ...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const data = await res.json();
  const stations = data.data.stations;
  console.log(`  ${stations.length} stations`);

  mkdirSync(DATA_DIR, { recursive: true });

  writeFileSync(join(DATA_DIR, `${name}.csv`), toCSV(stations), 'utf8');
  writeFileSync(join(DATA_DIR, `${name}.geojson`), JSON.stringify(toGeoJSON(stations), null, 2), 'utf8');
  console.log(`  Saved ${name}.csv / ${name}.geojson`);
}

for (const source of SOURCES) {
  await fetchAndSave(source);
}
console.log('Done.');

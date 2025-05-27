// --- CONFIG ---
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- MAP INIT ---
const map = L.map('map').setView([40, -100], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
  edit: { featureGroup: drawnItems },
  draw: { polygon: true, polyline: false, rectangle: false, circle: false, marker: false, circlemarker: false }
});
map.addControl(drawControl);

let lastPolygon = null;

map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;
  drawnItems.clearLayers();
  drawnItems.addLayer(layer);
  lastPolygon = layer;
});

// --- SUBMIT POLYGON ---
document.getElementById('submit-geojson').onclick = async () => {
  if (!lastPolygon) {
    alert('Draw a polygon first.');
    return;
  }
  const geojson = lastPolygon.toGeoJSON();
  const name = document.getElementById('feature-name').value || 'Unnamed';
  const geojsonStr = JSON.stringify(geojson.geometry);
  const timestamp = new Date().toISOString();
  const { error } = await supabase.from('features').insert([
    { name, geo: geojsonStr, timestamp }
  ]);
  if (error) {
    alert('Error saving: ' + error.message);
  } else {
    alert('Polygon saved!');
    fetchAndDisplayPolygons();
    drawnItems.clearLayers();
    lastPolygon = null;
  }
};

// --- FETCH AND DISPLAY POLYGONS ---
async function fetchAndDisplayPolygons() {
  drawnItems.clearLayers();
  lastPolygon = null;
  const { data, error } = await supabase.from('features').select('*');
  if (error) {
    alert('Error fetching: ' + error.message);
    return;
  }
  data.forEach(f => {
    try {
      const geom = JSON.parse(f.geo);
      const feature = {
        type: 'Feature',
        geometry: geom,
        properties: { name: f.name }
      };
      const color = randomColor();
      const layer = L.geoJSON(feature, {
        style: { color, weight: 3, fillOpacity: 0.4 },
        onEachFeature: (feat, lyr) => {
          lyr.bindTooltip(f.name || 'Feature');
        }
      });
      layer.addTo(drawnItems);
    } catch (e) { /* skip invalid */ }
  });
}

function randomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

fetchAndDisplayPolygons();

// --- DOWNLOAD GEOJSON ---
document.getElementById('download-geojson').onclick = () => {
  if (!lastPolygon) {
    alert('Draw a polygon first.');
    return;
  }
  const geojson = lastPolygon.toGeoJSON();
  const blob = new Blob([JSON.stringify(geojson, null, 2)], {type: 'application/json'});
  saveAs(blob, 'polygon.geojson');
};

// --- DOWNLOAD PDF ---
document.getElementById('download-pdf').onclick = () => {
  if (!lastPolygon) {
    alert('Draw a polygon first.');
    return;
  }
  const geojson = lastPolygon.toGeoJSON();
  const coords = geojson.geometry.coordinates[0];
  let area = L.GeometryUtil ? L.GeometryUtil.geodesicArea(coords.map(c => L.latLng(c[1], c[0]))) : 'N/A';
  if (area !== 'N/A') area = (area / 1e6).toFixed(2) + ' km²';
  let text = 'Polygon Coordinates:\n';
  coords.forEach((c, i) => {
    text += `${i+1}: [${c[1].toFixed(6)}, ${c[0].toFixed(6)}]\n`;
  });
  text += `Area: ${area}`;
  const doc = new jspdf.jsPDF();
  doc.text(text, 10, 10);
  doc.save('polygon-report.pdf');
};

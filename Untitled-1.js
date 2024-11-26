// Izveidojam karti un centrējam uz Latviju
var map = L.map('map').setView([56.8796, 24.6032], 7);
// Pievienojam pamata OpenStreetMap slāni L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 18,
attribution: 'Kartes dati no OpenStreetMap' }).addTo(map);
// Ielādējam JSON failu ar vietām fetch('geomap.json')
.then(function(response) { return response.json();
}) .then(function(data) {
// Apstrādājam katru vietu JSON failā data.features.forEach(function(feature) {
var koordinātas = feature.geometry.coordinates; var nosaukums = feature.properties.PLACENAME;
// Pievienojam marķieri ar vietas koordinātēm
var marker = L.marker([koordinātas[1], koordinātas[0]]).addTo(map);
// Kad klikšķina uz marķiera, parādām informāciju
marker.bindPopup("<b>" + nosaukums + "</b><br>Šī ir lieliska vieta, ko apmeklēt!");
}); })
.catch(function(error) {
    console.log("Kļūda ielādējot datus:", error);
    });
    
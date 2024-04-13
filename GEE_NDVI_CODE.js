var BOUNDARY = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[79.54683104454824, 11.752548715394767],
          [79.54683104454824, 11.745153855632275],
          [79.56249514519521, 11.745153855632275],
          [79.56249514519521, 11.752548715394767]]], null, false);
var SENTINEL = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filterDate('2024-03-01','2024-03-15')
.filterBounds(BOUNDARY)
.median();
print(SENTINEL);

//COMPUTING NDVI (FORMULA: NIR-RED/NIR+RED)
var NIR=SENTINEL.select('B8');
var RED=SENTINEL.select('B4');

var ndvi= NIR.subtract(RED).divide(NIR.add(RED)).rename('NDVI');
var NDVI=ndvi.clip(BOUNDARY);

// RGB composite
var RGB = SENTINEL.select(['B4', 'B3', 'B2']); // Selecting Red, Green, and Blue bands
var RGBVis = {
  min: 0.0,
  max: 3000,
  bands: ['B4', 'B3', 'B2']
};

var ndviparam = {min : -1 , max : 1 , palette : ['red','yellow','green']};

// Adding layers to the map
Map.addLayer(NDVI, ndviparam, 'NDVI');
Map.addLayer(RGB, RGBVis, 'RGB');

// Export the NDVI and RGB composite
Export.image.toDrive({
  image: NDVI.toFloat(),
  description: 'NDVI_Panruti',
  folder: 'GEE_exports',
  fileNamePrefix: 'NDVI_Panruti', 
  region: BOUNDARY,
  scale: 10,
});

Export.image.toDrive({
  image: RGB.toFloat(),
  description: 'RGB_Panruti',
  folder: 'GEE_exports',
  fileNamePrefix: 'RGB_Panruti',
  region: BOUNDARY,
  scale: 10,
});

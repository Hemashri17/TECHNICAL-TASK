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
          
// Initialize the Earth Engine API
//ee.initialize();

var aoi = ee.Geometry.Rectangle([-74.05, 40.70, -73.85, 40.90]);

var start_date = '2020-01-01';
var end_date = '2020-12-31';

var sentinel_collection = ee.ImageCollection('COPERNICUS/S2').filterBounds(aoi).filterDate(start_date, end_date);

var composite = sentinel_collection.median().clip(aoi);

var pre_period = sentinel_collection.filterDate('2020-01-01', '2020-06-30').median();
var post_period = sentinel_collection.filterDate('2020-07-01', '2020-12-31').median();
var ndvi_pre = pre_period.normalizedDifference(['B8', 'B4']);
var ndvi_post = post_period.normalizedDifference(['B8', 'B4']);
var ndvi_change = ndvi_post.subtract(ndvi_pre);

// Estimate soil organic carbon (SOC) changes
var soc_change = ndvi_change.multiply(0.2);

// Calculate carbon credits
var total_soc_change = soc_change.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30
});
var total_soc_credits = total_soc_change.get('nd');

print("Total Soil Organic Carbon Credits (in tonnes of CO2e):", total_soc_credits);
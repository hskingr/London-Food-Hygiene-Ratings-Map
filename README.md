# Hygiene Ratings Map (Heat Map & Pointers)

![Map Screenshot One](docs/hygiene_rating_1.png)
![Map Screenshot One](docs/hygiene_rating_2.png)
## Introduction

This is a work-in-progress application that takes data from the `api.ratings.food.gov.uk` datastore and compiles a NoSql database using MongoDB. The locations are then Geocoded into latitude and longitude  using the provided postcodes. The latitudes and longitudes are then used with leaflet.js and Mapbox to display the data visually.

Some filters have been introduced in the map, which can separate and combine the hygiene ratings for different displays on the heat map.

Todo:

- Implement a responsive frontend solution
- Add filters for markers and what they display
- Add a search bar to move the map based on the input provided.
- Create a check for changed data (such as ratings or whether a business still exists) and reflect those changes in the Database.





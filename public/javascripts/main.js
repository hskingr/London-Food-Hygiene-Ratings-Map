let data = []
let zero = [],
    one = [],
    two = [],
    three = [],
    four = [],
    five = []
let hygieneZero = L.layerGroup(zero)
let hygieneOne = L.layerGroup(one)
let hygieneTwo = L.layerGroup(two)
let hygieneThree = L.layerGroup(three)
let hygieneFour = L.layerGroup(four)
let hygieneFive = L.layerGroup(five)






const fetchData = async () => {
    try {
        const options = {
            method: 'GET',
        }
        const response = await fetch('/api', options)
        const body = await response.text()
        data = JSON.parse(body)

        //setup points that only load in view...

        let heat = L.heatLayer([], {
            radius: 25,
            max: 5,
            blur: 5,
            maxZoom: 14
        }).addTo(mymap);
        data.forEach(x => {
            if (x != null && x.Geocode[0].Longitude != null) {
                try {
                    const options = {
                        title: `${x.BusinessName}`,
                    }
                    const lng = x.Geocode[0].Longitude
                    const lat = x.Geocode[0].Latitude
                    if (x.RatingValue == 0) {
                        zero.push(L.marker([lat, lng], options))
                        heat.addLatLng([lat, lng, x.RatingValue.text])
                    } else if (x.RatingValue == 1) {
                        one.push(L.marker([lat, lng], options))
                    } else if (x.RatingValue == 2) {
                        two.push(L.marker([lat, lng], options))
                    } else if (x.RatingValue == 3) {
                        three.push(L.marker([lat, lng], options))
                    } else if (x.RatingValue == 4) {
                        four.push(L.marker([lat, lng], options))
                    } else if (x.RatingValue == 5) {
                        five.push(L.marker([lat, lng], options))
                    }
                } catch (error) {
                    console.log(error)
                }

            }

        })
    } catch (error) {
        console.log(error)
    }
}

const fetchDataWithOptions = async (dataOps, activeLayer) => {


    try {
        let heat = L.heatLayer([], {
            radius: 25,
            max: 1,
            blur: 30,
            maxZoom: 18
        }).addTo(activeLayer);

        var markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            removeOutsideVisibleBounds: true,
            disableClusteringAtZoom: 17
        });

        const options = {
            method: 'GET',
        }
        const rating = dataOps.rating
        const response = await fetch(`/apiOps?rating=${rating}`, options)
        const body = await response.text()
        data = JSON.parse(body)
        data.forEach(x => {
            const dataOptions = {
                title: `${x.BusinessName}`,
            }
            const lng = x.Geocode[0].Longitude
            const lat = x.Geocode[0].Latitude
            if (x != null && x.Geocode[0].Longitude != null) {
                // markers.addLayer(L.marker([lat, lng], options).bindPopup(dataOptions.title));
                // markers.addTo(activeLayer)
                heat.addLatLng([lat, lng, x.RatingValue.text])
                // marker = L.marker([lat, lng], options).bindPopup(dataOptions.title)
                // marker.addTo(activeLayer)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

function onClick(e) {
    console.log('hi');
}


const setupMap = async () => {
    try {


        let mymap = L.map('mapid', {
            center: [51.48616300000000, -0.04536800000000],
            zoom: 14,
            renderer: L.canvas(),
            // layers: [hygieneZero, hygieneOne, hygieneTwo, hygieneThree, hygieneFour, hygieneFive]
        });

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: await getApiToken()
        }).addTo(mymap);


        let overlayMaps = {
            hygieneZero,
            hygieneOne,
            hygieneTwo,
            hygieneThree,
            hygieneFour,
            hygieneFive
        }

        overlayMaps.hygieneZero.code = '0'
        overlayMaps.hygieneOne.code = '1'
        overlayMaps.hygieneTwo.code = '2'
        overlayMaps.hygieneThree.code = '3'
        overlayMaps.hygieneFour.code = '4'
        overlayMaps.hygieneFive.code = '5'

        L.control.layers(null, overlayMaps).addTo(mymap);

        mymap.on('overlayadd', (e) => {
            const options = {
                rating: e.layer.code
            }
            fetchDataWithOptions(options, e.layer)
        })

        mymap.on('overlayremove', (e) => {
            e.layer.clearLayers()
        })
    } catch (error) {
        console.log(error)
    }

}


const getApiToken  = async () => {
    try {
        const options = {
            method: 'GET',
        }
        const response =  await fetch(`/mapBoxApi`, options)
        return await response.text()
    } catch (error) {
        console.log(error)
    }

}

const main = async () => {

    // await fetchData()
    // const options = {
    //     rating: '2'
    // }
    // fetchDataWithOptions(options)
    await setupMap()


}

main()
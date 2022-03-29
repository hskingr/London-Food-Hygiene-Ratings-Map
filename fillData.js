const fetch = require('node-fetch');
const convert = require('xml-js');
const jsonfile = require('jsonfile')
const Restaurant = require('./models/restaurant.js')
const mongoose = require('mongoose')
const fs = require('fs-extra')
const file = './data/data.json'

let latlangs = []
let authorityFileUrls = []


const main = async () => {
    await getData()
    const data = readFileJSON()
    return data
}

const getData = async () => {
    try {
        const options = {
            compact: true,
            reversible: true,
            ignoreDeclaration: true,
            trim: true,
            textKey: 'text'
        }


        // const londonAuthorities = await (getLondonAuthorities())
        // await writeFileJson(londonAuthorities, 'londonAuthorities.json')
        // const listOfEstablishmentsFromAuthorities = await getEstablishmentsFromAuthorities(londonAuthorities)

        // const dataFiles = await fs.readdir('./data/authorityData/')
        // for (x of dataFiles) {
        //     await fillRestaurantDatabase(await readFileJson(`./data/authorityData/${x}`))
        // }


        //TESTING LOOP GRAB ESTABLISHMENTS BY LOCAL AUTHORITY ID

        // let data = []

        // data.push(await fetch('https://ratings.food.gov.uk/OpenDataFiles/FHRS523en-GB.json', fetchOptions))
        // // data.push(await fetch('https://ratings.food.gov.uk/OpenDataFiles/FHRS528en-GB.xml'))
        // let fetchedData = await data[0].text()
        // //HAVE TO SLICE THE FIRST CHARACTER BECAUSE IT WOULDN'T CONVERT TO A JSON OTHERWISE
        // fetchedData = fetchedData.slice(1, fetchedData.count)
        // let arr = await JSON.parse(fetchejdData)
        // // console.log(arr.FHRSEstablishment.EstablishmentCollection)
        // // console.log(jsonData)

        // // fs.writeFile(file, jsonData)


    } catch (error) {
        console.log(error)
    }
}

const getOneRestaurant = async () => {
try {
    const doc = await Restaurant.findOne({
        LocalAuthorityBusinessID: 'PI/000297090'
    })
    if (doc) {
        console.log(doc)
    }
} catch (error) {
    console.log(error)
}
}

const getLondonAuthorities = async () => {
    let londonAuthorities = []
    try {
        const fetchOptions = {
            method: 'get',
            headers: {
                'x-api-version': '2',
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        }
        let getAllAuthorities = await fetch('https://api.ratings.food.gov.uk/Authorities', fetchOptions)

        let authorities = await getAllAuthorities.json()
        authorities.authorities.forEach(property => {
            if (property.RegionName === 'London') {
                londonAuthorities.push({
                    property
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
    return londonAuthorities
}

const getEstablishmentsFromAuthorities = async (londonAuthorities) => {
    let authoritiesArr = []
    try {
        for (property of londonAuthorities) {
            const authorityFetchOptions = {
                method: 'get',
                headers: {
                    'x-api-version': '2',
                    'content-type': 'application/json',
                    'accept': 'application/json',
                }
            }
            const authorityID = await property.property.LocalAuthorityId;
            const authorityInfo = await fetch(`https://api.ratings.food.gov.uk/Establishments?localAuthorityId=${authorityID}`, authorityFetchOptions)
            let authorityInfoText = await authorityInfo.json()
            writeFileJson(authorityInfoText, `${authorityID}.json`)
        }
    } catch (error) {
        console.log(error)
    }
    return authoritiesArr
}

const fetchAgain = async (id) => {

    const authorityFetchOptions = {
        method: 'get',
        headers: {
            'x-api-version': '2',
            'content-type': 'application/json',
            'accept': 'application/json',
        }
    }
    let authorityInfo = await fetch(`https://api.ratings.food.gov.uk/Authorities/${id}`, authorityFetchOptions);
    if (await authorityInfo.status.toString() === '403') {
        let newId = id
        await fetchAgain(newId)
    } else {
        let newAuthorityInfo = await authorityInfo.json()
        authorityFileUrls.push(authorityInfoJson.FileName)
    }

}

const getLondonAuthorityFiles = async (londonAuthorities) => {
    //FINDING THE LASTEST LONDON AUTHORITY FILES
    try {
        for (property of londonAuthorities) {

            const authorityFetchOptions = {
                method: 'get',
                headers: {
                    'x-api-version': '2',
                    'content-type': 'application/json',
                    'accept': 'application/json',
                }
            }
            const authorityID = property.LocalAuthorityId;
            const authorityInfo = await fetch(`https://api.ratings.food.gov.uk/Authorities/${authorityID}`, authorityFetchOptions)
            if (await authorityInfo.status != '403') {
                authorityInfoJson = await authorityInfo.json();
                authorityFileUrls.push(authorityInfoJson.FileName)
            } else {
                await fetchAgain(authorityID)
            }
        }
        return authorityFileUrls
    } catch (error) {
        console.log(error);
    }

}

const fillRestaurantDatabase = async (data) => {
    try {
        refinedDataArr = data.establishments
        await refinedDataArr.forEach(async element => {
            const restaurant = new Restaurant(await formatObject(element))

            //testing to see if document exists
            try {
                const restaurantDoc = await Restaurant.findOne({
                    FHRSID : restaurant.FHRSID
                })
                if (restaurantDoc) {
                    // console.log('Document Exists...Skipping')
                } else {
                    const savedDoc = await restaurant.save()
                    console.log(savedDoc)
                }
            } catch (e) {
                console.log(e)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const formatObject = async (item) => {
    try {
        const newItem = {
            "FHRSID": checkIfNull(item.FHRSID),
            "LocalAuthorityBusinessID": checkIfNull(item.LocalAuthorityBusinessID),
            "BusinessName": checkIfNull(item.BusinessName),
            "BusinessType": checkIfNull(item.BusinessType),
            "BusinessTypeID": checkIfNull(item.BusinessTypeID),
            "AddressLine1": checkIfNull(item.AddressLine1),
            "AddressLine2": checkIfNull(item.AddressLine2),
            "AddressLine3": checkIfNull(item.AddressLine3),
            "AddressLine4": checkIfNull(item.AddressLine4),
            "PostCode": checkIfNull(item.PostCode),
            "RatingValue": checkIfNull(item.RatingValue),
            "RatingKey": checkIfNull(item.RatingKey),
            "RatingDate": checkIfNull(item.RatingDate),
            "LocalAuthorityCode": checkIfNull(item.LocalAuthorityCode),
            "LocalAuthorityName": checkIfNull(item.LocalAuthorityName),
            "LocalAuthorityWebSite": checkIfNull(item.LocalAuthorityWebSite),
            "LocalAuthorityEmailAddress": checkIfNull(item.LocalAuthorityEmailAddress),
            "Scores": [{
                "Hygiene": checkIfNull(item.scores.Hygiene),
                "Structural": checkIfNull(item.scores.Structural),
                "ConfidenceInManagement": checkIfNull(item.scores.ConfidenceInManagement),
            }],
            "SchemeType": checkIfNull(item.SchemeType),
            "NewRatingPending": checkIfNull(item.NewRatingPending),
            "Geocode": [{
                "Longitude": checkIfNull(item.geocode.longitude),
                "Latitude": checkIfNull(item.geocode.latitude),
            }]
        }
        return newItem
    } catch (error) {
        console.log(error)
    }

}

const checkIfNull = (item) => {
    try {
        if (typeof (item) === 'undefined') {
            return item = ''
        }
        return item
    } catch (e) {

    }

}


// const readFileJSON = async () => {
//     try {
//         let count = 0
//         let postcodes = ''
//         const data = await fs.readJson(file)
//         const refinedDataArr = data.FHRSEstablishment.EstablishmentCollection.EstablishmentDetail

//         await refinedDataArr.forEach(x => {
//             if (typeof (x.PostCode) != 'undefined' && typeof (x.Geocode.Longitude) != 'undefined') {
//                 const postcode = Object.values(x.PostCode)[0]
//                 postcodes += ` ${postcode}`
//                 latlangs.push(x)
//             }


//         })
//         console.log(`Amount of Listings: ${refinedDataArr.length}`)
//         // console.log(latlangs[0])
//         // latlangs[1].apiFetch = await fetchReverseGeocode(latlangs[0].Geocode.Latitude.text , latlangs[0].Geocode.Longitude.text)
//         // console.log(latlangs[0])
//         return latlangs
//     } catch (error) {
//         console.log(error)
//     }
// }

const readFileJson = async (filename) => {
    try {
        const file = await fs.readJson(`${filename}`)
        return file
    } catch (error) {
        console.log(error)
    }
}

const writeFileJson = async (data, filename) => {
    try {
        await fs.writeJson(`data/${filename}`, data)
    } catch (error) {
        console.log(error)
    }
}

const fetchReverseGeocode = async (lat, lng) => {
    try {
        // console.log(`lat here ${lat}`)
        // console.log(`lng here ${lng}`)
        let accessToken = process.env.LOCATIONIQ_ACCESSTOKEN
        const options = {
            method: 'GET',
            namedetails: 1
        }
        let data = await fetch(`https://eu1.locationiq.com/v1/reverse.php?key=${accessToken}&lat=${lat}&lon=${lng}&format=json`, options)

        console.log(`........Getting Reverse Geocode Data.......`)
        console.log(await data.json())
        console.log(`........Finshed Getting Reverse Geocode Data.......`)
        return await data.json()
    } catch (error) {
        console.log(`oh no! \n${error}`)
    }
}

exports.getData = getData
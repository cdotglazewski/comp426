
const finalizeButton = document.getElementById('finalizeInfo');
let stateList = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
var originLat;
var originLng;
var destinationLat;
var destinationLng;
var distMeters;
var timeSecs;

// autocomplete for origin state field
const stateFromInput = document.getElementById('stateFrom');
const stateFromWrapper = document.querySelector('.wrapper');
const stateFromResultsWrapper = document.querySelector('.results');

stateFromWrapper.addEventListener('keyup', (e) => {
    let results = [];
    let input = stateFromInput.value;
    if (input.length) {
        results = stateList.filter((state) => {
            return state.includes(input);
        });
    }
    showFromResults(results);
});

function showFromResults(results) {
    if (!results.length) {
        return stateFromWrapper.classList.remove('show');
    }
    let stateContent = results.map((state) => {
        return `<li>${state}</li>`
    }).join('');
    stateFromWrapper.classList.add('show');
    stateFromResultsWrapper.innerHTML = `<ul>${stateContent}</ul>`;
    var lists = document.querySelectorAll('li');
    if (lists.length > 0) {
        for(var i=0; i<lists.length; i++) {
            lists[i].addEventListener('click', function() {
                document.getElementById('stateFrom').value = this.innerText;
                stateFromWrapper.classList.remove("show");
            })
        }
    }
};

// API call to get coordinates (origin and destination) based on address entered 
// that are passed into distance API
function getOriginCoordinates(originAddress, destinationAddress) {
    axios.get('https://google-maps-geocoding.p.rapidapi.com/geocode/json', {
        params: {address: originAddress},
        headers: {
            'x-rapidapi-key': '79d27c911fmsh0f0d867d3395747p1c3f18jsne1db4fbd0748',
            'x-rapidapi-host': 'google-maps-geocoding.p.rapidapi.com'
        }
    })
    .then(response => {
        const origLatData = response.data.results[0].geometry.location.lat;
        console.log(origLatData);
        const origLngData = response.data.results[0].geometry.location.lng;
        console.log(origLngData);
        getDestinationCoordinates(destinationAddress, origLatData, origLngData)
    }).catch(function (error) {
        console.log(error);
    })
};

function getDestinationCoordinates(destinationAddress, originLat, originLng) {
    axios.get('https://google-maps-geocoding.p.rapidapi.com/geocode/json', {
        params: {address: destinationAddress},
        headers: {
            'x-rapidapi-key': '79d27c911fmsh0f0d867d3395747p1c3f18jsne1db4fbd0748',
            'x-rapidapi-host': 'google-maps-geocoding.p.rapidapi.com'
        }
    })
    .then(response => {
        const destLatData = response.data.results[0].geometry.location.lat;
        console.log(destLatData);
        const destLngData = response.data.results[0].geometry.location.lng;
        console.log(destLngData);
        // API call to get distance between origin and destination coordinates
        function getDistanceBetweenCoordinates(originLat, originLng, destLat, destLng) {
                axios.get('https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix', {
                    params: {
                        origins: "" + originLat + ", " + originLng,
                        destinations: "" + destLat + ", " + destLng
                    }, 
                    headers: {
                        'x-rapidapi-key': '79d27c911fmsh0f0d867d3395747p1c3f18jsne1db4fbd0748',
                        'x-rapidapi-host': 'trueway-matrix.p.rapidapi.com'
                    }
                })
                .then(function (response) {
                    // everything in here is related to populating things on screen
                    // creating html elements, variables with distance data, etc
                    var distanceMiles = response.data.distances[0] / 1609;
                    distanceMiles = Math.round(distanceMiles);
                    console.log(distanceMiles);
                    var timeHrs = response.data.durations[0] / 3600;
                    timeHrs = Math.round(timeHrs);
                    console.log(timeHrs);
                    var originCity = document.getElementById('cityFrom').value;
                    var originState = document.getElementById('stateFrom').value;
                    var destinationCity = document.getElementById('cityTo').value;
                    var destinationState = document.getElementById('stateTo').value;
                    document.getElementById('finalizeDetails').style.visibility = "hidden";
                    document.getElementById('finalizeInfo').style.visibility = "hidden";
                    var tempInfo = document.createElement("h3");
                    var lineBreak = document.createElement("br");
                    // tempInfo.innerHTML = "The current temperature in " + destinationCity + " is " + " degrees.";
                    var distanceInfo = document.createElement("h3");
                    distanceInfo.innerHTML = "Your trip from " + originCity + ", " + originState + " to " + destinationCity + ", " + destinationState + " will be about " + distanceMiles + " miles.";
                    var timeInfo = document.createElement("h3");
                    timeInfo.innerHTML = "It'll take you about " + timeHrs + " hours to arrive in " + destinationCity + ".";
                    document.body.append(lineBreak);
                    document.body.appendChild(tempInfo);
                    document.body.appendChild(lineBreak);
                    document.body.appendChild(distanceInfo);
                    document.body.appendChild(lineBreak);
                    document.body.appendChild(timeInfo);
                    document.body.appendChild(lineBreak);
                }).catch(function (error) {
                    console.log(error);
                })
        };
        getDistanceBetweenCoordinates(originLat, originLng, destLatData, destLngData)
    }).catch(function (error) {
        console.log(error);
    })
}


// function to offset timing so API has time to get info before other functions are run
const asyncFunction = () => {
    var combinedAddressFrom = document.getElementById('addressFrom').value + ", " + document.getElementById('cityFrom').value + ", " + document.getElementById('stateFrom').value;
    var combinedAddressTo = document.getElementById('addressTo').value + ", " + document.getElementById('cityTo').value + ", " + document.getElementById('stateTo').value;
    setTimeout(function() {getOriginCoordinates(combinedAddressFrom, combinedAddressTo)}, 1000);
}

finalizeButton.addEventListener('click', asyncFunction);
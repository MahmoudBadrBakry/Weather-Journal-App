/* Global Variables */
const weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?zip={zipcode}&units=metric&appid={APIkey}'
const weatherApiKey = '3f60b258043d4b468f17d985b88dbfbb'

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// post weather to sever
const postData = async(url, data = { date, temperature, userResponse }) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        return response;
    } catch (error) {
        console.log(error)
    }
}

// get weather from OWM
const getWeather = async(baseUrl, data = {}) => {

    if (!data.zipcode) {
        throw "Please enter zipcode!"
    }

    let url = baseUrl.replace('\{zipcode\}', data.zipcode).replace('\{APIkey\}', data.APIkey)
    const response = await (await fetch(url)).json()

    if (response.cod != '200') {
        throw response.message
    }

    let result = {}
    result.description = response.weather[0].description
    result.temperature = response.main.temp
    result.humidity = response.main.humidity

    return result;
}

// udpate UI
const updateUI = async(baseUrl) => {
    // get project data from the server    
    const response = await (await fetch(baseUrl)).json()

    // select UI elements to update
    const dateDiv = document.querySelector('#date')
    const tempratureDiv = document.querySelector('#temp')
    const contentDiv = document.querySelector('#content')

    // update UI elements
    dateDiv.innerHTML = `Date: ${response.date}`
    tempratureDiv.innerHTML = `Temprature: ${response.temperature}`
    if (!response.userResponse == '') {
        contentDiv.innerHTML = `Response: ${response.userResponse}`
    }

}

// clear old data 
const clearOldData = () => {

    // select UI elements to update
    const dateDiv = document.querySelector('#date')
    const tempratureDiv = document.querySelector('#temp')
    const contentDiv = document.querySelector('#content')

    // clear old entry
    contentDiv.innerHTML = ''
    dateDiv.innerHTML = ''
    tempratureDiv.innerHTML = ''

}

const generateBtn = document.querySelector('#generate')

// adding button functionality
generateBtn.addEventListener('click', async(e) => {

    const zipcode = document.querySelector('#zip').value

    try {
        clearOldData()
        const weather = await getWeather(weatherApiUrl, { zipcode, APIkey: weatherApiKey })
        if (!weather.temperature) {
            throw 'error fetching the weather'
        }

        // prepare project data
        let reply = {}
        reply.temperature = weather.temperature + ' C°';
        reply.date = newDate
        reply.userResponse = document.querySelector('#feelings').value

        // post the data to the sever
        await postData('/data', reply)

        await updateUI('/data')
    } catch (error) {
        const errorArea = document.querySelector('#error')
        errorArea.classList.remove('hide')
        errorArea.textContent = error
        setTimeout(() => {
            errorArea.classList.add('hide')
        }, 3000);
        // console.log(error)
    }

})
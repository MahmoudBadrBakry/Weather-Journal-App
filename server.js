// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Start up an instance of app
const app = express()

// selecting port
const port = 3000

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// Cors for cross origin allowance

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server 
app.listen(port, () => {
    console.log(`listening to port: ${port}`)
})

app.get('/data', (req, res) => {

    // Command Line feedback
    console.log('fetching data')

    res.send(projectData).status(200)
})

app.post('/data', (req, res) => {

    // save data
    projectData.date = req.body.date
    projectData.temperature = req.body.temperature
    projectData.userResponse = req.body.userResponse

    // Command Line feedback
    console.log('current app data:')
    console.log(projectData)

    res.send('saved correctly').status(201)
})
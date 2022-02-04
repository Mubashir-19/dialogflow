const express = require('express')
const bodyParser = require('body-parser')
const {WebhookClient} = require('dialogflow-fulfillment');
const axios = require("axios");

//http://api.openweathermap.org/data/2.5/weather?q=karachi&appid=6250064582403ea29ba67d13d4b9bde1
const app = express()
app.use(bodyParser.json())
const port = process.env.PORT || 3000

let a = '';
let b = '';
let temp;

app.get("/", async (req,res) => {
    if (b == '') {
        res.send("reload page after command !");

    }else {

        try {
            let weather = `http://api.openweathermap.org/data/2.5/weather?q=${b}&appid=6250064582403ea29ba67d13d4b9bde1`;
            let r = await axios.get(weather);
            temp = r.data.main.temp;

            console.log(r.data.main.temp)

            res.json({city: b, temperature: temp-273});

        } catch (error) {
            console.log(error);
        }
    }
})

app.post('/dialogflow-fulfillment', (request, response) => {
    dialogflowFulfillment(request, response)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const dialogflowFulfillment = (request, response) => {
    try {
        const agent = new WebhookClient({request: request, response: response});

        async function sayHello(agent){
            b = request.body.queryResult.parameters["geo-city"];

            let weather = `http://api.openweathermap.org/data/2.5/weather?q=${b}&appid=6250064582403ea29ba67d13d4b9bde1`;
            let r = await axios.get(weather);
            temp = r.data.main.temp;

            a = `Weather in ${b} is ${(temp-273)}.2f celsius`;
            await agent.add(a);
        }
    
        let intentMap = new Map();

        intentMap.set("Weather", sayHello)

        agent.handleRequest(intentMap)
    } catch (error) {
        console.log("ERror in fulfilment: ", error)
    }

}
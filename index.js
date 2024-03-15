import express from "express";
import axios from "axios";
import dotenv from 'dotenv';

const port = 3000;
const app = express();
const months = ["January", "Februar", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
const appid = process.env.app_id;
let city="yamunanagar";
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.post("/submit",(req, res)=>{
    city = req.body["city"];
    console.log(city);
    res.redirect("/");
});
app.get("/", async (req, res)=>{
    const result = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`);
    const coordinates = result.data;
    const latitude = coordinates.results[0].latitude;
    const longitude = coordinates.results[0].longitude;
    const result1 = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${appid}`);
    const weath = result1.data;
    console.log(weath);
    const month = new Date();




    res.render("index.ejs",{
        temp: weath.main.temp,
        place: weath.name,
        month: months[month.getMonth()],
        date: month.getDate(),
        year: month.getFullYear(),
        hours: String(month.getHours()).padStart(2,0),
        minute: String(month.getMinutes()).padStart(2, 0),
        img: weath.weather[0].icon,
        feels: weath.main.feels_like,
        humidity: weath.main.humidity,
        pressure: weath.main.pressure,
        visibility: weath.visibility,
        wind: weath.wind.speed,
        status: weath.weather[0].main,
        
    });
});
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});

const imgday = [113,116,119];
const rainimg = [296,302,308];

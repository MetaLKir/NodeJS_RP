import {getRandomIndex} from "./tools.js";
import {userNames} from './constants.js';
import axios from "axios";

const index = getRandomIndex(userNames.length);
console.log(userNames[index]);
async function fetchData(){
    try {
        const res = await axios.get("https://api.kanye.rest/");
        console.log(res.data);
    } catch (e) {
        console.error(e.message);
    }
}
fetchData();
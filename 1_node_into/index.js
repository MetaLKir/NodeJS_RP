/*
1. timers: setTimeout setInterval

micro-tasks

2. pending callbacks: TCP error

microtasks

3. prepare libuv

microtasks

4. poll: callbacks (fs net http)

microtasks

5. check

microtasks

6. close: closing all callbacks

//====================================//
browser     vs      node
___________________________
macrotasks  vs   timers, poll, check
microtasks  vs   microtasks
DOM events  vs   poll
rendering   vs   ------ (nothing)

//====================================//

GLOBAL OBJECTS IN NODE.JS:
global
process
console
set...
URL...
TextDecoder TextEncoder
module export

//====================================//
MODULE VARIATIONS:
js
cjs
mjs

 */

// const {sum} = require("./math1.js"); // old version
import {sum1} from "./math2.js";

// console.log(sum(10, 20));
console.log(sum1(10, 20));

console.log("Shabat Shalom")
// console.log(global)
// console.log(process)
const PORT = process.env.PORT || 3000;
console.log(process.execPath);
console.log(process.cwd());

console.log(process.argv);

// https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=43s&list=PL123#comments

const url = new URL("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=43s&list=PL123#comments");
console.log("full ref: ", url.href);
console.log("protocol: ", url.protocol);
console.log("host: ", url.host);
console.log("host name: ", url.hostname);
console.log("port: ", url.port);
console.log("pathname: ", url.pathname);
console.log("search: ", url.search);
console.log("hash: ", url.hash);

console.log("list: ", url.searchParams.get("list"));

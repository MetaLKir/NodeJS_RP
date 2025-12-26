const args = process.argv.slice(2);
const [name, mode] = args;

if (!name) {
    console.log("Usage: node greet.js <name> [mode]");
    process.exit(1);
}
if (mode === "upper") {
    console.log(`Hello, ${name.toUpperCase()}!`);
} else {
    console.log(`Hello, ${name}!`);
}
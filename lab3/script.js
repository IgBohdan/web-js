let names = [
  "Bill",
  "John",
  "Jen",
  "Jason",
  "Paul",
  "Frank",
  "Steven",
  "Larry",
  "Paula",
  "Laura",
  "Jim",
];

for (let name of names) {
  const firstChar = name.charAt(0).toLowerCase();
  firstChar === "j" ? speekGoodBye(name) : speekHello(name);
}
console.log("=====");

const threshold = 110;

console.log("Ascii:");

for (let name of names) {
  const asciiSum = name
    .charAt(name.length - 1)
    .toLowerCase()
    .charCodeAt(0);
  console.log(`${name} (ascii sum last letters: ${asciiSum})`);

  asciiSum > threshold ? speekHello(name) : speekGoodBye(name);
}

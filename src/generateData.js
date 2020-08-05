import Item from "./Item";

const generateKeys = (size = 26) => {
  const start = "a".charCodeAt(0);
  const end = "z".charCodeAt(0);
  const letters = [];
  const keys = [];

  for (let i = start; i <= end; i++) {
    letters.push(String.fromCharCode(i));
  }
  if (size > letters.length || size <= 0) size = letters.length;

  for (let i = 0; i < size; i++) {
    const [randomLetter] = letters.splice(
      Math.floor(Math.random() * letters.length),
      1
    );
    keys.push(randomLetter);
  }

  return keys;
};

const generateData = (size) => {
  const keys = generateKeys(size);
  const data = keys.map(
    (key) => new Item(key, Math.floor(Math.random() * 200))
  );

  return data;
};

export default generateData;

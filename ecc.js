// ECC Parameters
const a = 1;
const b = 2;
const p = 1013; // Changed to a higher prime number

// Function to find points on the elliptic curve
function findPoints(a, b, p) {
  let points = [];
  for (let x = 0; x < p; x++) {
    for (let y = 0; y < p; y++) {
      if ((y * y) % p === (x * x * x + a * x + b) % p) {
        points.push([x, y]);
      }
    }
  }
  console.log("Points on the curve:", points);
  return points;
}

// Function to calculate modular inverse using extended Euclidean algorithm
function modInverse(a, m) {
  let m0 = m, t, q;
  let x0 = 0, x1 = 1;

  if (m === 1) return 0;

  while (a > 1) {
    q = Math.floor(a / m);
    t = m;
    m = a % m;
    a = t;
    t = x0;
    x0 = x1 - q * x0;
    x1 = t;
  }

  if (x1 < 0) x1 += m0;

  return x1;
}

// Function to multiply a point by a scalar on the elliptic curve
function pointMultiply(point, scalar, p) {
  let [x, y] = point;
  let result = [0, 0];
  let temp = [x, y];
  while (scalar > 0) {
    if (scalar % 2 === 1) {
      if (result[0] === 0 && result[1] === 0) {
        result = temp;
      } else {
        result = pointAdd(result, temp, p);
      }
    }
    temp = pointAdd(temp, temp, p);
    scalar = Math.floor(scalar / 2);
  }
  return result;
}

// Function to add two points on the elliptic curve
function pointAdd(point1, point2, p) {
  if (point1[0] === 0 && point1[1] === 0) return point2;
  if (point2[0] === 0 && point2[1] === 0) return point1;

  let [x1, y1] = point1;
  let [x2, y2] = point2;

  let lambda;
  if (x1 === x2 && y1 === y2) {
    lambda = ((3 * x1 * x1 + a) * modInverse(2 * y1, p)) % p;
  } else {
    lambda = ((y2 - y1) * modInverse((x2 - x1 + p) % p, p)) % p;
  }

  if (lambda < 0) lambda += p;

  const x3 = (lambda * lambda - x1 - x2) % p;
  const y3 = (lambda * (x1 - x3) - y1) % p;

  return [(x3 + p) % p, (y3 + p) % p];
}

// Function to generate prime numbers less than a given number
function generatePrimes(n) {
  const primes = [];
  for (let i = 2; i < n; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

// Function to generate keys (E1, E2, and d) for encryption and decryption
function keyGeneration(points, p) {
  const E1 = points[Math.floor(Math.random() * points.length)]; // Choose a random point from 'points' array
  const primes = generatePrimes(p);
  // const d = primes[Math.floor(Math.random() * primes.length)]; // Choose a random prime scalar (private key)
  const d = 571;
  const E2 = pointMultiply(E1, d, p);

  console.log("Generated keys: d =", d, ", E1 =", E1, ", E2 =", E2);
  return { d, E2, E1 };
}

// Find points on the elliptic curve
const points = findPoints(a, b, p);

// Generate keys using the points
const { d, E2, E1 } = keyGeneration(points, p);

// Function to encrypt a point
function encrypt(point, E2, E1, p) {
  const primes = generatePrimes(p);
  const r = primes[Math.floor(Math.random() * primes.length)]; // Generate a random prime scalar for each encryption iteration
  console.log("r is:"+r);
  const C1 = pointMultiply(E1, r, p);
  const C2 = pointAdd(point, pointMultiply(E2, r, p), p);
  return { C1, C2 };
}

// Function to encrypt an array of points using E1, E2, and p
function encryptField(points, E2, E1, p) {
  const encrypted = points.map(point => encrypt(point, E2, E1, p));
  return encrypted.map(({ C1, C2 }) => `${C1[0]}-${C1[1]}-${C2[0]}-${C2[1]}`).join('|');
}

// Function to decrypt a point
function decrypt(C1, C2, d, p) {
  const S = pointMultiply(C1, d, p);
  const plainPoint = pointAdd(C2, [S[0], (p - S[1]) % p], p);
  return plainPoint;
}

// Function to decrypt a string of encrypted points using d and p
function decryptField(data, d, p) {
  if (typeof data !== 'string') {
    throw new TypeError('Data must be a string');
  }

  const encryptedPairs = data.split('|').map(item => {
    const [c1x, c1y, c2x, c2y] = item.split('-').map(Number);
    return { C1: [c1x, c1y], C2: [c2x, c2y] };
  });

  return encryptedPairs.map(({ C1, C2 }) => decrypt(C1, C2, d, p));
}

// Function to handle encryption and decryption for a given string
function handleEncryptionDecryption(inputString, points) {
  // Create a map to store the character to point mapping
  const charToPointMap = {};
  const unicodePoints = [];

  // Map each character in the input string to its corresponding point based on Unicode value
  inputString.split('').forEach(char => {
    const unicode = char.charCodeAt(0);
    const point = points[unicode % points.length];
    charToPointMap[unicode] = point;
    unicodePoints.push(point);
  });

  console.log("Points to encrypt:", unicodePoints);

  // Encrypt the points
  const encryptedData = encryptField(unicodePoints, E2, E1, p);
  console.log("Encrypted Data:", encryptedData);

  // Decrypt the points
  const decryptedPoints = decryptField(encryptedData, d, p);
  console.log("Decrypted Points:", decryptedPoints);

  // Reconstruct the string from the decrypted points
  const decryptedString = decryptedPoints.map(point => {
    const char = Object.keys(charToPointMap).find(key => {
      const mappedPoint = charToPointMap[key];
      return mappedPoint[0] === point[0] && mappedPoint[1] === point[1];
    });
    return String.fromCharCode(char);
  }).join('');

  return {
    encryptedData,
    decryptedString
  };
}



module.exports = { handleEncryptionDecryption, decryptField, findPoints, keyGeneration, a, b, p, d};
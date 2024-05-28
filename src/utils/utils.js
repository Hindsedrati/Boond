import CryptoJS from "crypto-js";

const base64UrlEncode = (input) => {
  const encoded = btoa(input);

  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

const hashHmacSHA256 = (data, key) => {
  return CryptoJS.HmacSHA256(data, key).toString(CryptoJS.enc.Latin1);
};

export const jwtEncode = (payload, ClientKey) => {
  const header = { type: "JWT", alg: "HS256" };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = hashHmacSHA256(signingInput, ClientKey);
  const encodedSignature = base64UrlEncode(signature);

  return `${signingInput}.${encodedSignature}`;
};

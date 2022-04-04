//Encoding solution proposed by Johan Sundström

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str));
}

function UnicodeDecodeB64(str) {
  return decodeURIComponent(atob(str));
}

export { b64EncodeUnicode as encode64, UnicodeDecodeB64 as decode64 };

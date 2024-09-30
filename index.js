const crypto = require('crypto');
const fs = require('fs');
const md5File = require('md5-file');
const uuid = require('uuid');

function generate128BitHexKey() {
  let key = "";
  for (let i = 0; i < 32; i++) {
    const randomHexDigit = Math.floor(Math.random() * 16).toString(16);
    key += randomHexDigit;
  }
  return key;
}

let null_iv = Buffer.from('00000000000000000000000000000000', 'hex');
var key = generate128BitHexKey()

function encrypt(filename, keyBuffer) {
  let id = uuid.v4();

  let contents = fs.readFileSync(filename);
  let cipher = crypto.createCipheriv('aes-128-ctr', keyBuffer, null_iv);

  let encrypted = cipher.update(contents);
  fs.writeFileSync(id, encrypted);

  console.log(`questionMedia`, {
    key,
    type: "video",
    mediaId: id,
    contentType: "video/mp4"
  });
  console.log(`scheduleObject media`, {
    hash: md5File.sync(id),
    mediaId: id,
    mediaUrl: "https://cdn.canobal.com/hqtv/media/" + id,
    size: fs.statSync(id)["size"]
  });
}

// Media is preferably MP4 format, 13 seconds long, 690x1034
encrypt('media.mp4', Buffer.from(key, 'hex'));
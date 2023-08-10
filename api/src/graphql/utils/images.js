const fs = require('fs');
const path = require('path');

const getFullPath = (imgPath) => path.join(__baseDir, 'public', imgPath);

function validateBase64(base64data) {
    const matches = base64data.match(/^data:image\/(jpg|jpeg|png);base64,(.+)$/);
    if (matches?.length !== 3) {
        throw new Error('Invalid image file (must be png/jpg/jpeg)');
    }
    return matches[2];
}

function saveToPublic(imgPath, base64data) {
    const data = Buffer.from(validateBase64(base64data), 'base64');
    fs.writeFileSync(getFullPath(imgPath), data);
}

function renameInPublic(imgPath, newImgPath, cb = console.log) {
    fs.rename(getFullPath(imgPath), getFullPath(newImgPath), cb);
}

function deleteFromPublic(imgPath, cb = console.log) {
    fs.unlink(getFullPath(imgPath), cb);
}

module.exports = { saveToPublic, deleteFromPublic, renameInPublic, validateBase64 };
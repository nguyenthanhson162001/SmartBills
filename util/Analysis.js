var fetch = require("fetch");

async function analysis(image) {
    console.log(image)
    const formData = new FormData();
    formData.append('image', image);
    var retult = await fetch('https://tolbill.herokuapp.com/detect', {
        method: 'POST',
        body: formData
    })
    return retult.json()
}
module.exports = analysis
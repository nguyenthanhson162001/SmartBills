// var fetch = require("node-fetch");
const axios = require('axios').default;
var FormData = require('form-data');


async function analysis(image) {
    const formData = new FormData();
    formData.append('image', image);
    var retult = await axios('https://tolbill.herokuapp.com/detect', {
        method: 'POST',
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
    })
    console.log(retult)
    return retult.json()
}
module.exports = analysis
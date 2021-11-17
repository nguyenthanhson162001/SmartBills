var fetch = require("node-fetch");
var fs = require('fs');
const axios = require('axios').default;
var FormData = require('form-data');
async function analysis(image) {
    let formData = new FormData();
    formData.append("image", image, "image.png");
    var retult = await fetch('http://localhost:5000/detect', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
        },
        body: formData,
    });
    return retult
}
module.exports = analysis
var fetch = require("node-fetch");
var fs = require('fs');
const axios = require('axios').default;
var FormData = require('form-data');
async function analysis(image) {
    // const formData = new FormData();
    // formData.append('image', image, 'image.jpg');
    // const retult = await axios.post('https://tolbill.herokuapp.com/detect', formData, {
    //     headers: {
    //         ...formData.getHeaders()
    //     },
    // });
    let formData = new FormData();
    formData.append("image", image, "image.png");
    var retult = await fetch('https://tolbill.herokuapp.com/detect', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
        },
        body: formData,
    });
    return retult
}
module.exports = analysis
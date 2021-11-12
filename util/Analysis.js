// var fetch = require("node-fetch");
var fs = require('fs');
const axios = require('axios').default;
var FormData = require('form-data');
async function analysis(image) {
    const formData = new FormData();
    formData.append('image', image, 'image.jpg');
    const retult = await axios.post('https://tolbill.herokuapp.com/detect', formData, {
        headers: {
            ...formData.getHeaders(),
            Authentication: 'Bearer ...',
            'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTc0YjNhMjIyYjg0MjFkMzRiMDZlN2IiLCJpYXQiOjE2MzY2OTM5MTcsImV4cCI6MTYzNjcwODMxN30.mMuB6f1oVjgHMW-3nI0eFXW7z0G9_Qhbtfzs3reSwAM'
        },
    });
    return retult
}
module.exports = analysis
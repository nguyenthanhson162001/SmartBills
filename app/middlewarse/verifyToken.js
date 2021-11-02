const jwt = require('jsonwebtoken');
module.exports =
    function (req, res, next) {
        const token = req.headers["auth-token"]
        if (!token)
            return res.status(401).send('Login require')
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.userID = verified
            next()
        } catch (error) {
            res.status(400).send('Invalid token')
        }
    }


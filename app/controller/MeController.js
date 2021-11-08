const User = require('..//models/user')
class MeController {
    //[GET] api/me/infomation
    async infomation(req, res) {
        const user = await User.findOne({ _id: req.userID }).select('firstName lastName email')
        res.status(200).json(user);
    }
    //[PUT] api/me/infomation
}
module.exports = new MeController();


module.exports = {
    paginatoin_soft: (req, res, limit) => {
        var page = req.query.page
        if (page == undefined || page < 1) {
            page = 1
        }
        var column = res.locals.soft.column
        var type = res.locals.soft.type
        var param = '?'
        if (res.locals.soft.enabled) {
            param = '?soft=' + res.locals.soft.column + '&type=' + res.locals.soft.type + '&'
        } else {
            column = 'createdAt'
        }
        return {
            option: { page: page, limit: limit, sort: { [column]: type } },
            param,
            page
        }
    }
}
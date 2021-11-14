const Bill = require('..//app/models/bill')
class StatisticalBill {
    async getDayStatistical(owner, month, year) {
        var bills = await Bill.aggregate([
            { $match: { owner: owner } },
            {
                $match: {
                    $and: [
                        { $expr: { $eq: [{ $month: '$createdAt' }, month] } },
                        { $expr: { $eq: [{ $year: '$createdAt' }, year] } }]
                }
            }, {
                $group: {
                    _id: { $dayOfMonth: '$createdAt' },
                    sumTotal: { $sum: '$total' }, countBill: { $sum: 1 }
                }
            }, {
                $sort: { _id: 1 }
            },
            {
                $project: { _id: 0, date: '$_id', sumTotal: 1, countBill: 1 }
            }])

        return bills;
    }
    async getMonthStatistical(owner, year) {
        return await Bill.aggregate([
            { $match: { owner: owner } },
            {
                $match: {
                    $and: [
                        { $expr: { $eq: [{ $year: '$createdAt' }, year] } }]
                }
            }, {
                $group: {
                    _id: { $month: '$createdAt' },
                    sumTotal: { $sum: '$total' }, countBill: { $sum: 1 }
                }
            }, {
                $sort: { _id: 1 }
            },
            {
                $project: { _id: 0, date: '$_id', sumTotal: 1, countBill: 1 }
            }])
    }
    async getYearStatistical(owner) {
        return await Bill.aggregate([
            { $match: { owner: owner } },
            {
                $group: {
                    _id: { $year: '$createdAt' },
                    sumTotal: { $sum: '$total' }, countBill: { $sum: 1 }
                }
            }, {
                $sort: { _id: 1 }
            },
            {
                $project: { _id: 0, date: '$_id', sumTotal: 1, countBill: 1 }
            }])
    }
    // cacurator precent growth rate total Between prevent month and month present
    async getGrowthRateTotalWithMonth(owner, month, year) {
        var preventMonth = month - 1
        var result = await Bill.aggregate([
            { $match: { owner: owner } }, {
                $match: {
                    $and: [
                        { $expr: { $eq: [{ $year: '$createdAt' }, year] } },
                        {
                            $or: [{ $expr: { $eq: [{ $month: '$createdAt' }, month] } },
                            { $expr: { $eq: [{ $month: '$createdAt' }, preventMonth] } },]
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    sumTotal: { $sum: '$total' }
                }
            }, {
                $sort: { _id: -1 }
            },
            {
                $project: { _id: 0, date: '$_id', sumTotal: 1 }
            }])
        // console.log()
        var percent
        if (result[1] == undefined) {
            if (result[0] == undefined) {
                percent = 0
            } else {
                percent = 0
            }
        } else {
            percent = (((result[0].sumTotal - result[1].sumTotal) / result[1].sumTotal) * 100).toFixed(2)
        }
        return {
            percent
        }

    }
    async overview(owner) {
        // ,
        return await Bill.aggregate([{ $match: { owner: owner } },
        {
            $group: {
                _id: null,
                sumTotalBill: { $sum: '$total' }, countBill: { $sum: 1 }
            }
        }, {
            $sort: { _id: 1 }
        },
        {
            $project: { _id: 0, sumTotalBill: 1, countBill: 1 }
        }])
    }
}
module.exports = new StatisticalBill();
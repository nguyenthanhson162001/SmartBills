
module.exports = {
    convert: function (bill) {
        return {
            id: bill._id,
            total: bill.total,
            address: bill.address,
            dateTime: bill.dateTime,
            imageKey: bill.imageKey,
            owner: bill.owner,
            items: bill.items,
            createdAt: bill.createdAt
        }
    },
    convertPagintions: function (bills) {
        var result = [];
        bills.docs.forEach(function (bill) {
            result.push({
                id: bill._id,
                total: bill.total,
                address: bill.address,
                dateTime: bill.dateTime,
                imageKey: bill.imageKey,
                owner: bill.owner,
                items: bill.items,
                createdAt: bill.createdAt
            })
        })
        return {
            docs: result,
            totalDocs: bills.totalDocs,
            limit: bills.limit,
            totalPages: bills.totalPages,
            page: bills.page,
            pagingCounter: bills.pagingCounter,
            hasPrevPage: bills.hasPrevPage,
            hasNextPage: bills.hasNextPage,
            prevPage: bills.prevPage,
            nextPage: bills.nextPage,
        }
    }
}
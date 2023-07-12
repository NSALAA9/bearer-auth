'use strict'

module.exports = (error, req, res, next) => {
    res.status(500).json({
        massege: `Server Error: ${error.massege}`,
        router: req.originalUrl
    })
}
'use strict'

module.exports = (req, res) => {

    res.status(404).json({
        code: 404,
        massege: 'Page Not Found!',
        router: req.originalUrl
    })

}
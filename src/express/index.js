/**
 * User: ggarrido
 * Date: 8/01/20 19:57
 * Copyright 2019 (c) Lightstreams, Granada
 */

const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

module.exports.start = (port) => {
    app.listen(port,
        () => console.log(`RoomBooking dApp listening on port ${port}!`)
    )
}

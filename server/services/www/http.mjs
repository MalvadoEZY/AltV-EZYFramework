import express from 'express'
import alt from 'alt-server'
const app = express()
const port = 7789
import bodyParser from 'body-parser';
// To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// To parse json data
app.use(bodyParser.json());

app.get('/', (req, res) => {
    if(alt.hasMeta('server:onlinePlayers')) {
        const onlinePlayers = alt.getMeta('server:onlinePlayers')
        res.send(String(onlinePlayers))
    }
})

app.listen(port, '127.0.0.1');
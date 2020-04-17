const express = require("express");
const bodyParser = require('body-parser');

const rootRouter = require('./routes/root.routes');
const app = express();
const port = 3000;
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/',rootRouter);

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

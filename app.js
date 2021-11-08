const express = require('express');
const serverPort = 8000;
const app = express();

app.get("/", (req, res) => {
    res.send("Welcome");
});

app.listen(serverPort, () => console.log('Express server is running'));
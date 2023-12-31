const express = require('express');
const websiteConnect = require('./data/websiteConnect.js');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const adminRouter = require('./routes/adminRouter.js');
const contestantRouter = require('./routes/contestantRouter.js');
const dashboardRouter = require('./routes/dashboardRouter.js');
// connect to database
websiteConnect();


app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use('/api/admins', adminRouter);
app.use('/api/contestants', contestantRouter);
app.use('/dashboard', dashboardRouter);
app.use('*', (req, res, next) => {
    res.status(404).send(`</br> </br> <h1> Page Not Found </h1>`);
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 400).json({
        status: err.status || "Error",
        message: err.message,
        statusCode: err.statusCode || 400,
        data: null 
    });
});

const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Listening on port ${port}`))
const mongoose = require('mongoose');

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    },
    () => console.log('DB Connected')
);

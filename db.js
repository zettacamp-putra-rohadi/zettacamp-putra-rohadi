const mongoose = require('mongoose');

exports.connect = function () {
      let uri = process.env.DB_URI;
          uri = uri.replace('<user>', process.env.DB_USER);
          uri = uri.replace('<pass>', process.env.DB_PASS);

      mongoose.connect(uri)
            .then(() => {
                  console.log('Database connected!');
            })
            .catch(error => {
                  console.error('Database connection failed: ', error.message);
            });
};

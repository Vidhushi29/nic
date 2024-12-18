const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload');
const jwt = require('./app/_middleware/jwt');
const errorHandler = require('./app/_middleware/error-handler');
const decryption = require('./app/_middleware/decryption');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
var sizeOf = require('image-size');
global.sizeOf = require('image-size');
require('dotenv').config()
Frontend_Base_URL = process.env.Frontend_Base_URL

//For Response Header Security
app.use(helmet());
app.use(function (req, res, next) {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'deny');
  next();
});


//For Response Header Security END
const data = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Calcutta'
});

// app.use('/api',express.static('assets/images'));
// app.use('/api',express.static('assets/secure'));
app.use(fileUpload());

app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: Frontend_Base_URL }));

const allowedMethods = ['GET', 'POST']
app.use((req, res, next) => {
  if (!allowedMethods.includes(req.method)) {
    let jsonData = {
      "code": 400,
      "failed": "Method not Allowed"
    }
    return res.send({ "EncryptedResponse": jsonData })
  }
  return next()
})

// app.use('/api',express.static('public'));
// app.use('/uploads',express.static('uploads'));
require("./app/routes/user.routes.js")(app);
require("./app/routes/breeder.routes.js")(app);
require('./app/routes/bsp1.routes')(app);
require('./app/routes/bsp2.routes')(app);
require("./app/routes/bsp3.routes")(app);
require("./app/routes/bsp4.routes")(app);
require("./app/routes/bsp5a.routes")(app);
require("./app/routes/bsp5b.routes")(app);
require("./app/routes/bsp6.routes")(app);
require("./app/routes/indenter.routes")(app);
require("./app/routes/allocation_to_indentor")(app);
require("./app/routes/allocation_to_spa")(app);
require("./app/routes/breeder_certificate.route")(app);
require("./app/routes/monitioring_team.routes")(app);
require("./app/routes/seed-testing-laboratory.routes")(app);
require("./app/routes/label_number_for_breederseed.routes")(app);
require("./app/routes/generated_label_numbers.routes")(app);
require("./app/routes/generate_bill.routes")(app);
require("./app/routes/bspc_to_plants.route")(app);
require("./app/routes/bsp4_to_plant.routes")(app);
require("./app/routes/util.routes")(app);
require("./app/routes/produced_breeder_seed_details.routes")(app)
require("./app/routes/spa_to_indentor.routes")(app)
require("./app/routes/spa-lifting.route.js")(app)
require("./app/routes/lot-number-creation.route.js")(app)
require("./app/routes/dashboardData.route.js")(app)
require("./app/routes/bsp_proforma_one.routes")(app)


app.use(errorHandler);
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});





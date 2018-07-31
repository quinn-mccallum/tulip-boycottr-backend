const express = require("express"),
      bodyParser = require('body-parser');
const morgan = require("morgan");
const admin = require("firebase-admin");




const router = require("./api");
const { logger } = require("./utils/logger");
const { errorHandler } = require("./middleware/error-handler");
const serviceAccount = require("../firebase-credentials.json");

// initialize firebase store
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Create a new express application instance
const app = express();


//the 2 app.use lines below are directly from npm (including comments)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  next();
})


//1. bring in our external router
const boycottLocationsRouter = require('./routes/BoycottLocations/boycottLocationsRouter');

//2. we mount those routes on '/coffees'
app.use('/boycotts', boycottLocationsRouter)

//TO ACCESS THE GET ROUTE FOR BOYCOTT LOCATIONS:
  // _____/boycotts/boycottLocation

// The port the express app will listen on
const port = process.env.PORT || 8081;

logger.info("🤖 Initializing middleware");

app.use(morgan("tiny", { stream: logger.stream }));
app.use("/", router);
app.use(errorHandler);

// Serve the application at the given port
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    logger.info(`🎧 Listening at http://localhost:${port}/`);
  });
}

module.exports = {
  app
};

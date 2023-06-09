const port = process.env.PORT || 5000;
const dbConnect = require("./Dbconnect/dbconnect");
const app = require("./app")
require("dotenv").config();


// db connection
dbConnect()



app.listen(port, ()=>{
    console.log("Server is running on port", port);
})
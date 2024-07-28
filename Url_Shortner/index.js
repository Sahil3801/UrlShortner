const express = require('express');
const staticRouter = require('./routes/staticRouter');
const path = require('path');
const { connectToMondoDB } = require('./connection')
const urlRoute = require('./routes/url')
const URL = require("./models/url");

const app = express();
const PORT = 8000;

connectToMondoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log('MongoDB Connected!'))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// app.get('/test',async(req,res)=>{
//   const allUrls=await URL.find({});
//   // console.log(allUrls);   
//   return res.render("home",{
//     urls:allUrls,
//   });

// })


app.use('/url', urlRoute);
app.use('/', staticRouter)

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectUrl);
});
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
var express = require('express');
var router = express.Router();



var dbCon = require('../module/db/con');
var database=require('../module/db/bdModule')
var auto_incriment=require('../module/db/autoIncriment');
var dotenv=require('dotenv').config();



 

/* GET home page. */
router.get('/', function(req, res, next) {
 
  res.render('index', { title: 'Mr Review' });
});

router.post('/searchproperty', async function(req, res, next) {
  var postCode=req.body.postCode.replace(/\s/g, '').toUpperCase();
  await dbCon.connectDB();

  //{landlordName:{$regex: '.*' + req.body.landlordName + '.*'}

  const property= await database.property.find({postCode:postCode, $or: [{landlordName:{$regex: '.*' + req.body.landlordName + '.*'}}]})

  await dbCon.closeDB();
  res.json(property)
  
});

router.post('/showDetailsPropertyFeedback', async function(req, res, next) {
  await dbCon.connectDB();
  const feedbac=await database.feedbac.find({propertyID:req.body.propertyID}).sort({_id: -1}).limit(20);
    
  await dbCon.closeDB();
  res.send({feedbac:feedbac})
  
  
});

router.post('/searchtenant', async function(req, res, next) {
  var postCode=req.body.tenantPostCode.replace(/\s/g, '').toUpperCase();
  await dbCon.connectDB();

  //{landlordName:{$regex: '.*' + req.body.landlordName + '.*'}

  const tenant= await database.tenant.find({postCode:postCode, $or: [{name:{$regex: '.*' + req.body.tenantName + '.*'}}]})

  await dbCon.closeDB();
  res.json(tenant)
  
});



// const getPromise = (time) => { 
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(`Promise resolved for ${time}s`)
//     }, time)
//   })
// }

// const main = async () => {
//   const myPromiseArray = [getPromise(1000), getPromise(500), getPromise(3000)]
//   console.log('Before For Each Loop')

//   myPromiseArray.forEach(async (element, index) => {
//     let result = await element;
//     console.log(result);
//   })

//   console.log('After For Each Loop')
// }

// main();




module.exports = router;

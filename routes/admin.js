var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var dbCon = require('../module/db/con');
var database=require('../module/db/bdModule')
var auto_incriment=require('../module/db/autoIncriment');
var dotenv=require('dotenv').config();





router.get('/', async function(req, res, next) {
    await dbCon.connectDB();
    const property=await database.propertyrequest.find({status:"New"});

    const tenant=await database.tenant.find({status:"New"});

    const existproperty=await database.exiestingpropertyrequest.find({status:"New"});
    await dbCon.closeDB();

    res.render('admin/myadmin',{property:property,tenant:tenant,existproperty:existproperty});
})


router.post('/verifyTenant', async function(req, res, next) {
    await dbCon.connectDB();
    const tenant=await database.tenant.findOneAndUpdate({tenantID:req.body.id},{$set:{status:"Verified"}});
    await dbCon.closeDB();
    res.send("ok");
})

router.post('/verifyProperty', async function(req, res, next) {
    await dbCon.connectDB();
    const prop=await database.propertyrequest.findOneAndUpdate({propertyID:req.body.id},{$set:{status:"Verified"}});
    if(prop.requestBy=="Landlord"){
      //////For LandLord//////
      
      const property= await  database.property({
        name:prop.name,
        type:prop.type,
        status:"Active",
        landlordName:prop.landlordName,
        landlordID:prop.landlordID,
        propertyID:prop.propertyID,
        postCode:prop.postCode.replace(/\s/g, '').toUpperCase(),
        doorNo:prop.doorNo,
        address:prop.address,
        country:prop.country,
        imgMain:prop.imgMain,
        impOp1:prop.impOp1,
        impOp2:prop.impOp2,
        impOp3:prop.impOp3,
        impAdsProof:prop.impAdsProof,

      });

      await property.save();
    }else{

      //////For Tenant//////

      const property= await  database.property({
        name:prop.name,
        type:prop.type,
        status:"Active",
        landlordName:prop.landlordName,
        propertyID:prop.propertyID,
        postCode:prop.postCode.replace(/\s/g, '').toUpperCase(),
        doorNo:prop.doorNo,
        address:prop.address,
        country:prop.country,
        imgMain:prop.imgMain,
        impOp1:prop.impOp1,
        impOp2:prop.impOp2,
        impOp3:prop.impOp3,
        impAdsProof:prop.impAdsProof,

      });

      await property.save();

      ///////Add Tenant to Lease property///////

      const tenant=await database.tenant.findOne({tenantID:prop.tenantID});
      const lease= await  database.lease({
        tenantID:tenant.tenantID,
        tenantName:tenant.name,
        landlordID:"",
        landlordName:prop.landlordName,
        propertyID:prop.propertyID,
        status:"Active",
        name:prop.name,
        type:prop.type,
        postCode:prop.postCode.replace(/\s/g, '').toUpperCase(),
        doorNo:prop.doorNo,
        address:prop.address,
        country:prop.country,
        imgMain:prop.imgMain,
        impOp1:prop.impOp1,
        impOp2:prop.impOp2,
        impOp3:prop.impOp3,

      });

      await lease.save();

    }
    

      

    await dbCon.closeDB();
    res.send("ok");
})




router.post('/ViewPropertyVeryfy', async function(req, res, next) {
  await dbCon.connectDB();
  const property=await database.property.findOne({propertyID:req.body.propertyID});

  res.json(property);

  await dbCon.closeDB();
})


router.post('/verifyExistingProperty', async function(req, res, next) {
  await dbCon.connectDB();

  const prop=await database.property.findOne({propertyID:req.body.propertyID});
  const tenant=await database.tenant.findOne({tenantID:req.cookies.tenantID});
  const islease=await database.lease.findOne({postCode:prop.postCode,doorNo:prop.doorNo,tenantID:tenant.tenantID});

  const updateExistingrequest=await database.exiestingpropertyrequest.findOneAndUpdate({propertyID:req.body.propertyID,tenantID:req.cookies.tenantID},{$set:{status:"Verified"}});
  
  

    if(!islease){
      const lease= await  database.lease({
        tenantID:tenant.tenantID,
        tenantName:tenant.name,
        landlordID:prop.landlordID,
        landlordName:prop.landlordName,
        propertyID:prop.propertyID,
        status:"Active",
        name:prop.name,
        type:prop.type,
        postCode:prop.postCode.replace(/\s/g, '').toUpperCase(),
        doorNo:prop.doorNo,
        address:prop.address,
        country:prop.country,
        imgMain:prop.imgMain,
        impOp1:prop.impOp1,
        impOp2:prop.impOp2,
        impOp3:prop.impOp3,
      });
      await lease.save();
    }
    await dbCon.closeDB();
  res.json(updateExistingrequest);
})



module.exports = router;
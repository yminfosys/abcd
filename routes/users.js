var express = require('express');
var router = express.Router();


const bcrypt = require('bcrypt');
const saltRounds = 10;

var dbCon = require('../module/db/con');
var database=require('../module/db/bdModule')
var auto_incriment=require('../module/db/autoIncriment');

var dotenv=require('dotenv').config();


var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3-transform')
const sharp = require('sharp');
const {S3_ENDPOINT, BUCKET_NAME}=process.env;

var spaceEndpoint= new aws.Endpoint(S3_ENDPOINT)



var s3 = new aws.S3({ 
    endpoint:spaceEndpoint
})

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype))
    },
    transforms: [ {
      id: 'image',
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + "-" + file.originalname)
      },
      transform: function (req, file, cb) {
        cb(null, sharp().resize(1200, 800,{ fit: sharp.fit.inside }))
      }
    }]
  })
})


var cpUpload = upload.fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'file3', maxCount: 1 },
  { name: 'file4', maxCount: 1 },
  { name: 'file5', maxCount: 1 }
])




/////////////////////////////////////////////////////
///////////////// TENANT DASHBOARD///////////////////////
///////////////////////////////////////////////////

router.get('/tenant', async function(req, res, next) {

  if (req.cookies.tenantID) {
    await dbCon.connectDB();
    const tenant=await database.tenant.findOne({tenantID:req.cookies.tenantID});
  
    const lease=await database.lease.find({tenantID:tenant.tenantID});
   
   
    await dbCon.closeDB();
    res.render('users/tenant',{msg:"msg",tenant:tenant,property:lease});
  } else {
      res.redirect('/users/login');
    }
  

  

})


/////////////////////////////////////////////////////
///////////////// LandLord DASHBOARD///////////////////////
///////////////////////////////////////////////////

router.get('/landlord', async function(req, res, next) {

  if (req.cookies.landlordID) {

    await dbCon.connectDB();
    const landlord=await database.landlord.findOne({landlordID:req.cookies.landlordID});
    const property=await database.property.find({landlordID:req.cookies.landlordID});

    await dbCon.closeDB();
    res.render('users/landlord',{msg:"msg",landlord:landlord,property:property});
  } else {
    
      res.redirect('/users/login');
    }
  

  

})

/////////////////////////////////////////////////////
///////////////// User Login ///////////////////////
///////////////////////////////////////////////////

router.get('/login', async function(req, res, next) {

        var msg="";
        if(req.query.msg){
          msg=req.query.msg
        }
  
        if (req.cookies.tenantID) {
          res.redirect('/users/tenant')
        } else {
          if (req.cookies.landlordID) {
            res.redirect('/users/landlord')
          }else{
            res.render('users/login',{msg:msg});
          }
        }

     
});


router.post('/loginTenant', async function(req, res, next) {
 
  await dbCon.connectDB();
  const existEmail=await database.tenant.findOne({email:req.body.email});
  if(existEmail){
    bcrypt.compare(req.body.password, existEmail.password, function(err, pass) {

      if (pass) {
        
          res.cookie("tenantID", existEmail.tenantID, { maxAge: 30 * 24 * 60 * 60 * 1000 });
          
          res.redirect('/users/tenant')
      } else {
          //////Worng Password//////
          res.redirect('/users/login?msg= worng password')
      }
    })

  }else{
    res.redirect('/users/login?msg= worng Username try again')
  }


})



router.post('/loginLandlord', async function(req, res, next) {
  console.log(req.body)
  await dbCon.connectDB();
  const existEmail=await database.landlord.findOne({email:req.body.email});
  if(existEmail){
    bcrypt.compare(req.body.password, existEmail.password, function(err, pass) {

      if (pass) {
          res.cookie("landlordID", existEmail.landlordID, { maxAge: 30 * 24 * 60 * 60 * 1000 });
          
          res.redirect('/users/tenant')
      } else {
          //////Worng Password//////
          res.redirect('/users/login?msg= worng password')
      }
    })

  }else{
    res.redirect('/users/login?msg= worng Username try again')
  }


})


router.get('/logout', async function(req, res, next) {
res.clearCookie("tenantID");
res.clearCookie("landlordID")
res.redirect('/users/login')
})
/////////////////////////////////////////////////////
///////////////// User Register ////////////////////
///////////////////////////////////////////////////

router.get('/reg', async function(req, res, next) {

  var msg="";
  if(req.query.msg){
    msg=req.query.msg
  }

      if (req.cookies.tenantID) {
        res.redirect('/users/tenant')
      } else {
        if (req.cookies.landlordID) {
          res.redirect('/users/landlord')
        }else{
          res.render('users/reg',{msg:msg});
        }
      }
});




router.post('/regTenent', cpUpload, async function(req, res, next) {

  try {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      auto_incriment.auto_incriment("tenantID").then(async function(inc_val){
        if (req.files.file1) {
          var url = req.files.file1[0].transforms[0].location;
          await dbCon.connectDB();
          const newTenant= await  database.tenant({
            postCode:req.body.postCode.replace(/\s/g, '').toUpperCase(),
            doorNo:req.body.doorNo,
            address:req.body.address,
            country:req.body.country,
            email:req.body.email,
            password:hash,
            name:req.body.name,
            mobileno:req.body.mobileno,
            tenantProfID:url,
            tenantID:inc_val
          });
    
          await newTenant.save();
    
          await dbCon.closeDB();
    
          res.redirect('/users/login?msg=Tenant Registration Success');
    
        }else{
          res.redirect('/users/reg?msg=Upload your Address Profe');
        }
      });
    });

      }catch (error) {
        console.log(error);
        return error;
      }

  
});


router.post('/regLandlord', cpUpload, async function(req, res, next) {
  try {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      auto_incriment.auto_incriment("landlordID").then(async function(inc_val){
          await dbCon.connectDB();
          const newlandlord= await  database.landlord({
            postCode:req.body.postCode.replace(/\s/g, '').toUpperCase(),
            doorNo:req.body.doorNo,
            address:req.body.address,
            country:req.body.country,
            email:req.body.email,
            password:hash,
            name:req.body.name,
            mobileno:req.body.mobileno,
            landlordID:inc_val
          });
    
          await newlandlord.save();
    
          await dbCon.closeDB();
    
          res.redirect('/users/login?msg=Landlord Registration Success');
    
        
      });
    });

      }catch (error) {
        console.log(error);
        return error;
      }
});


router.post('/searchProperty', async function(req, res, next) {
  try {
        await dbCon.connectDB();
        const property=await database.property.find({postCode:req.body.postCode});
        await dbCon.closeDB();
        res.json(property);
      }catch (error) {
        console.log(error);
        return error;
      }
});




router.post('/addNewProperty',cpUpload, async function(req, res, next) {
  auto_incriment.auto_incriment("propertyID").then(async function(inc_val){

    try {

        var imgMain = "";
        var impOp1 = "";
        var impOp2 = "";
        var impOp3 = "";
        var impAdsProof = "";

      if (req.files.file1) {
        imgMain = req.files.file1[0].transforms[0].location;
      }
      if (req.files.file2) {
        impOp1 = req.files.file2[0].transforms[0].location;
      }
      if (req.files.file3) {
        impOp2 = req.files.file3[0].transforms[0].location;
      }
      if (req.files.file4) {
        impOp3 = req.files.file4[0].transforms[0].location;
      }

      if (req.files.file5) {
        impAdsProof = req.files.file5[0].transforms[0].location;
      }
      await dbCon.connectDB();

      const propertyRequest= await  database.propertyrequest({
        name:req.body.name,
        type:req.body.type,
        status:"New",
        landlordName:req.body.landlordName,
        propertyID:inc_val,
        postCode:req.body.postCode.replace(/\s/g, '').toUpperCase(),
        doorNo:req.body.doorNo,
        address:req.body.address,
        country:req.body.country,
        requestBy:"Tenant",
        tenantID:req.body.tenantID,
        imgMain:imgMain,
        impOp1:impOp1,
        impOp2:impOp2,
        impOp3:impOp3,
        impAdsProof:impAdsProof
      });

      await propertyRequest.save();


      await dbCon.closeDB();
      //res.send(impOp3)
      res.redirect('/users/tenant')
    }catch (error) {
      console.log(error);
      return error;
    }

  })

});



router.post('/addNewPropertyByLandlord',cpUpload, async function(req, res, next) {

  auto_incriment.auto_incriment("propertyID").then(async function(inc_val){

    try {

        var imgMain = "";
        var impOp1 = "";
        var impOp2 = "";
        var impOp3 = "";
        var impAdsProof = "";

      if (req.files.file1) {
        imgMain = req.files.file1[0].transforms[0].location;
      }
      if (req.files.file2) {
        impOp1 = req.files.file2[0].transforms[0].location;
      }
      if (req.files.file3) {
        impOp2 = req.files.file3[0].transforms[0].location;
      }
      if (req.files.file4) {
        impOp3 = req.files.file4[0].transforms[0].location;
      }

      if (req.files.file5) {
        impAdsProof = req.files.file5[0].transforms[0].location;
      }
      await dbCon.connectDB();
      

      const propertyRequest= await  database.propertyrequest({
        name:req.body.name,
        type:req.body.type,
        status:"New",
        landlordName:req.body.landlordName,
        propertyID:inc_val,
        postCode:req.body.postCode.replace(/\s/g, '').toUpperCase(),
        doorNo:req.body.doorNo,
        address:req.body.address,
        country:req.body.country,
        requestBy:"Landlord",
        landlordID:req.body.landlordID,
        imgMain:imgMain,
        impOp1:impOp1,
        impOp2:impOp2,
        impOp3:impOp3,
        impAdsProof:impAdsProof
      });

      await propertyRequest.save();


      await dbCon.closeDB();
      res.write("Property Request Successfully")
      res.end();
    }catch (error) {
      console.log(error);
      return error;
    }

  })

});




router.post('/addpropertyTolease', async function(req, res, next) {
  await dbCon.connectDB();
  

  const prop=await database.property.findOne({propertyID:req.body.propertyID});
  const tenant=await database.tenant.findOne({tenantID:req.cookies.tenantID});
  const islease=await database.lease.findOne({postCode:prop.postCode,doorNo:prop.doorNo,tenantID:tenant.tenantID});
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
  res.send("ok")

})



router.post('/findMyTenant', async function(req, res, next) {
  await dbCon.connectDB();
  var tenantList=[];
  const lease=await database.lease.find({landlordID:req.body.landlordID, status:"Active"});
    
  await dbCon.closeDB();
  res.json(lease)

  
})


router.post('/propertyAndfeedbackDetails', async function(req, res, next) {
  await dbCon.connectDB();
  const property=await database.property.findOne({propertyID:req.body.propertyID});

  const feedbac=await database.feedbac.find({propertyID:req.body.propertyID}).sort({_id: -1}).limit(20);
    
  await dbCon.closeDB();
  res.send({property:property,feedbac:feedbac})
})


router.post('/updatePropertyFeedback', async function(req, res, next) {
  await dbCon.connectDB();

  const checkfeedbac= await database.feedbac.findOne({propertyID:req.body.propertyID,tenantID:req.body.tenantID});

  if(checkfeedbac){
    /////Update Feed back/////
    const feedbac=await database.feedbac.findOneAndUpdate({propertyID:req.body.propertyID,tenantID:req.body.tenantID},{
      detailsrating:req.body.detailsrating,
      rating:req.body.rating,
    });
  }else{
    const feedbac=await database.feedbac({
      ratingby:req.body.ratingby,
      ratingname:req.body.name,
      rating:req.body.rating,
      detailsrating:req.body.detailsrating,
      propertyID:req.body.propertyID,
      tenantID:req.body.tenantID,
      
  })

  await feedbac.save();
  }

  

   const property=await database.property.findOne({propertyID:req.body.propertyID});
   var newtotalrating=0;
   var newratingcount=0;
        if(property.totalrating){
          newtotalrating = Number(property.totalrating)+ Number(req.body.rating);
        }else{
          newtotalrating=Number(req.body.rating);
        }
        if(property.ratingcount){
          newratingcount = Number(property.ratingcount)+1;
        }else{
          newratingcount=1;
        }

        
        var newRating =  Number(newtotalrating) / Number(newratingcount);
        

        //console.log("totalRating:",newtotalRating, "count:",newratingcount)

        const prop=await database.property.findOneAndUpdate({propertyID:req.body.propertyID},{
          totalrating:newtotalrating,
          ratingcount:newratingcount,
          rating:newRating
        });


        const lease=await database.lease.findOneAndUpdate({propertyID:req.body.propertyID},{
          rating:newRating
        });

        console.log(lease)
    
      await dbCon.closeDB();
      res.send("ok");
  

      


  
  // res.send({property:property,feedbac:feedbac})
})
























module.exports = router;

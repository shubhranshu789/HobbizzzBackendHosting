const express = require("express");
const mongoose = require("mongoose");
const router = express.Router()

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")


const CRAFTCABINATE = mongoose.model("CRAFTCABINATE");
const CRAFTDIRECTOR = mongoose.model("CRAFTDIRECTOR");
const ARTCLUB = mongoose.model("ARTCLUB");
const CRAFTEDITOR = mongoose.model("CRAFTEDITOR");
const CRAFTJUDGE = mongoose.model("CRAFTJUDGE");
const CRAFTPRINCIPLE = mongoose.model("CRAFTPRINCIPLE");


const {Jwt_secret} = require("../../../keys");



router.post("/CRAFTCABINATE-signup" , (req,res)=> {
    const {name , password ,email , state , district , school} = req.body;
    const ip = req.headers['cf-connecting-ip'] ||
                req.headers['x-real-ip'] ||
                req.headers['x-forwarded-for'] ||
                req.socket.remoteAddress || '' ;


    if(!name ||!password ||!email || !state || !district || !school){
        return res.status(422).json({error : "Please add all the fields"})
    }

    CRAFTCABINATE.findOne({$or : [{email : email} ]}).then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error : "user already exist with that email or userName"})
        }


        bcryptjs.hash(password , 12).then((hashedPassword) => {
            const teacher = new CRAFTCABINATE ({
                name , 
                email,    
                password:hashedPassword, //hiding password,
                ip,
                school,
                district,
                state
            })
        
            teacher.save()
            .then(teacher => {res.json({message : "Data Saved"})})
            .catch(err => {console.log(err)})
        })
    })
})



router.post("/CRAFTCABINATE-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    CRAFTCABINATE.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , club , school } = savedUser
                res.json({token , user:{_id ,name , email , state , district , club , school }})
                console.log({token , user:{_id ,name , email , state , district , club , school}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})




router.post("/CRAFTDIRECTOR-signup", async (req, res) => {
  const { name, password, email, state, district, clubName } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !clubName) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await CRAFTDIRECTOR.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new CRAFTDIRECTOR({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      clubName: clubName.toUpperCase()
    });

    const savedDirector = await director.save();

    if (clubName.toUpperCase() === "ART") {
      const artClubId = "684a8c32d27f1ad8681187d0";
      await ARTCLUB.findByIdAndUpdate(artClubId, {
        $push: { director: savedDirector._id }
      });
    }

    res.json({ message: "Director registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/CRAFTDIRECTOR-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    CRAFTDIRECTOR.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , clubName } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , clubName  }})
                console.log({token , user:{_id ,name , email ,  state , district , clubName}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})




router.post("/CRAFTEDITOR-signup", async (req, res) => {
  const { name, password, email, state, district, clubName } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !clubName) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await CRAFTEDITOR.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new CRAFTEDITOR({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      clubName: clubName.toUpperCase()
    });

    const savedDirector = await director.save();

    if (clubName.toUpperCase() === "ART") {
      const artClubId = "684a8c32d27f1ad8681187d0";
      await ARTCLUB.findByIdAndUpdate(artClubId, {
        $push: { director: savedDirector._id }
      });
    }

    res.json({ message: "Editor registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



router.post("/CRAFTEDITOR-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    CRAFTEDITOR.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , clubName } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , clubName  }})
                console.log({token , user:{_id ,name , email ,  state , district , clubName}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})






router.post("/CRAFTJUDGE-signup", async (req, res) => {
  const { name, password, email, state, district, clubName } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !clubName) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await CRAFTJUDGE.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new CRAFTJUDGE({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      clubName: clubName.toUpperCase()
    });

    const savedDirector = await director.save();

    if (clubName.toUpperCase() === "ART") {
      const artClubId = "684a8c32d27f1ad8681187d0";
      await ARTCLUB.findByIdAndUpdate(artClubId, {
        $push: { director: savedDirector._id }
      });
    }

    res.json({ message: "Judge registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




router.post("/CRAFTJUDGE-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    CRAFTJUDGE.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , clubName } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , clubName  }})
                console.log({token , user:{_id ,name , email ,  state , district , clubName}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})




router.post("/CRAFTPRINCIPLE-signup", async (req, res) => {
  const { name, password, email, state, district, clubName } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !clubName) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await CRAFTPRINCIPLE.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new CRAFTPRINCIPLE({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      clubName: clubName.toUpperCase()
    });

    const savedDirector = await director.save();

    if (clubName.toUpperCase() === "ART") {
      const artClubId = "684a8c32d27f1ad8681187d0";
      await ARTCLUB.findByIdAndUpdate(artClubId, {
        $push: { director: savedDirector._id }
      });
    }

    res.json({ message: "Judge registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




router.post("/CRAFTPRINCIPLE-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    CRAFTPRINCIPLE.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , clubName } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , clubName  }})
                console.log({token , user:{_id ,name , email ,  state , district , clubName}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})

































module.exports = router;
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router()

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")


const USER = mongoose.model("USER");
const CABINATE = mongoose.model("CABINATE");
const DIRECTOR = mongoose.model("DIRECTOR");
const ARTCLUB = mongoose.model("ARTCLUB");
const EDITOR = mongoose.model("EDITOR");
const JUDGE = mongoose.model("JUDGE");
const PRINCIPLE = mongoose.model("PRINCIPLE");


const {Jwt_secret} = require("../keys");






router.post("/cabinate-signup" , (req,res)=> {
    const {name , password ,email , state , district , school} = req.body;
    const ip = req.headers['cf-connecting-ip'] ||
                req.headers['x-real-ip'] ||
                req.headers['x-forwarded-for'] ||
                req.socket.remoteAddress || '' ;


    if(!name ||!password ||!email || !state || !district || !school){
        return res.status(422).json({error : "Please add all the fields"})
    }

    CABINATE.findOne({$or : [{email : email} ]}).then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error : "user already exist with that email or userName"})
        }


        bcryptjs.hash(password , 12).then((hashedPassword) => {
            const teacher = new CABINATE ({
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



router.post("/cabinate-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    CABINATE.findOne({email:email}).then((savedUser) => {
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




router.post("/director-signup", async (req, res) => {
  const { name, password, email, state, district, club } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !club) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await DIRECTOR.findOne({
      $or: [{ email: email }, { club: club }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new DIRECTOR({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      club: club.toUpperCase()
    });

    const savedDirector = await director.save();

    if (club.toUpperCase() === "ART") {
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


router.post("/director-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    DIRECTOR.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , club } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , club  }})
                console.log({token , user:{_id ,name , email ,  state , district , club}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})




router.post("/editor-signup", async (req, res) => {
  const { name, password, email, state, district, club } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !club) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await EDITOR.findOne({
      $or: [{ email: email }, { club: club }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new EDITOR({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      club: club.toUpperCase()
    });

    const savedDirector = await director.save();

    if (club.toUpperCase() === "ART") {
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



router.post("/editor-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    EDITOR.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , club } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , club  }})
                console.log({token , user:{_id ,name , email ,  state , district , club}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})






router.post("/judge-signup", async (req, res) => {
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
    const savedUser = await JUDGE.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new JUDGE({
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




router.post("/judge-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    JUDGE.findOne({email:email}).then((savedUser) => {
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




router.post("/principle-signup", async (req, res) => {
  const { name, password, email, state, district, club } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !club) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await PRINCIPLE.findOne({
      $or: [{ email: email }, { club: club }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new PRINCIPLE({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      club: club.toUpperCase()
    });

    const savedDirector = await director.save();

    if (club.toUpperCase() === "ART") {
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




router.post("/principle-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    PRINCIPLE.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , club } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , club  }})
                console.log({token , user:{_id ,name , email ,  state , district , club}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})

































module.exports = router;
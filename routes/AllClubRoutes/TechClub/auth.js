const express = require("express");
const mongoose = require("mongoose");
const router = express.Router()

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")
const {Jwt_secret} = require("../../../keys");


const TECHCABINATE = mongoose.model("TECHCABINATE");
const TECHDIRECTOR = mongoose.model("TECHDIRECTOR");
const TECHEDITOR = mongoose.model("TECHEDITOR");
const TECHPRINCIPLE = mongoose.model("TECHPRINCIPLE");





router.post("/TECHCABINATE-signup" , (req,res)=> {
    const {name , password ,email , state , district , school} = req.body;
    const ip = req.headers['cf-connecting-ip'] ||
                req.headers['x-real-ip'] ||
                req.headers['x-forwarded-for'] ||
                req.socket.remoteAddress || '' ;


    if(!name ||!password ||!email || !state || !district || !school){
        return res.status(422).json({error : "Please add all the fields"})
    }

    TECHCABINATE.findOne({$or : [{email : email} ]}).then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error : "user already exist with that email or userName"})
        }


        bcryptjs.hash(password , 12).then((hashedPassword) => {
            const teacher = new TECHCABINATE ({
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



router.post("/TECHCABINATE-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    TECHCABINATE.findOne({email:email}).then((savedUser) => {
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




router.post("/TECHDIRECTOR-signup", async (req, res) => {
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
    const savedUser = await TECHDIRECTOR.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new TECHDIRECTOR({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      club: clubName
    });

    const savedDirector = await director.save();

    if (clubName.toUpperCase() === "TECH") {
      const techClubId = "684a8c32d27f1ad8681187d0";
      await TECHCLUB.findByIdAndUpdate(techClubId, {
        $push: { director: savedDirector._id }
      });
    }

    res.json({ message: "Director registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/TECHDIRECTOR-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    TECHDIRECTOR.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , club } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , club }})
                console.log({token , user:{_id ,name , email ,  state , district , club}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})




router.post("/TECHEDITOR-signup", async (req, res) => {
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
    const savedUser = await TECHEDITOR.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new TECHEDITOR({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      clubName: clubName
    });

    const savedDirector = await director.save();

    // if (clubName.toUpperCase() === "TECH") {
    //   const techClubId = "684a8c32d27f1ad8681187d0";
    //   await TECHCLUB.findByIdAndUpdate(techClubId, {
    //     $push: { director: savedDirector._id }
    //   });
    // }

    res.json({ message: "Editor registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



router.post("/TECHEDITOR-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    TECHEDITOR.findOne({email:email}).then((savedUser) => {
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






// router.post("/TECHJUDGE-signup", async (req, res) => {
//   const { name, password, email, state, district, clubName } = req.body;

//   const ip =
//     req.headers["cf-connecting-ip"] ||
//     req.headers["x-real-ip"] ||
//     req.headers["x-forwarded-for"] ||
//     req.socket.remoteAddress ||
//     "";

//   if (!name || !password || !email || !state || !district || !clubName) {
//     return res.status(422).json({ error: "Please add all the fields" });
//   }

//   try {
//     const savedUser = await TECHJUDGE.findOne({
//       $or: [{ email: email }, { clubName: clubName }]
//     });

//     if (savedUser) {
//       return res
//         .status(422)
//         .json({ error: "User already exists with that email or club name" });
//     }

//     const hashedPassword = await bcryptjs.hash(password, 12);

//     const director = new TECHJUDGE({
//       name,
//       email,
//       password: hashedPassword,
//       ip,
//       state,
//       district,
//       clubName: clubName.toUpperCase()
//     });

//     const savedDirector = await director.save();

//     if (clubName.toUpperCase() === "TECH") {
//       const techClubId = "684a8c32d27f1ad8681187d0";
//       await TECHCLUB.findByIdAndUpdate(techClubId, {
//         $push: { director: savedDirector._id }
//       });
//     }

//     res.json({ message: "Judge registered successfully" });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });




// router.post("/TECHJUDGE-signin" , (req , res) => {
//     const {email , password} = req.body;

//     if(!email || !password){
//         return res.status(422).json({error: "please add all the fields"})
//     }

//     TECHJUDGE.findOne({email:email}).then((savedUser) => {
//         if(!savedUser){
//             return res.status(422).json({error:"Invalid Email"})
//         }
//         bcryptjs.compare(password , savedUser.password).then((match) => {
//             if(match){
//                 // return res.status(200).json({message :"Signed In Successufully" })
//                 const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
//                 const {_id ,name , email , state , district , clubName } = savedUser
//                 res.json({token , user:{_id ,name , email,  state , district , clubName  }})
//                 console.log({token , user:{_id ,name , email ,  state , district , clubName}})
//             }else{
//                 return res.status(422).json({error :"Invalid password" })
//             }
//         })
//         .catch(err => console.log(err))
//         // console.log(savedUser)
//     })
// })




router.post("/TECHPRINCIPLE-signup", async (req, res) => {
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
    const savedUser = await TECHPRINCIPLE.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new TECHPRINCIPLE({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      club: clubName
    });

    const savedDirector = await director.save();

    if (clubName.toUpperCase() === "TECH") {
      const techClubId = "684a8c32d27f1ad8681187d0";
      await TECHCLUB.findByIdAndUpdate(techClubId, {
        $push: { director: savedDirector._id }
      });
    }

    res.json({ message: "Principal registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




router.post("/TECHPRINCIPLE-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    TECHPRINCIPLE.findOne({email:email}).then((savedUser) => {
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
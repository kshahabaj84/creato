//imports
//////express
import express from 'express';
const app = express();
////mongoose
import mongoose from 'mongoose';
////.env
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();
////nodemailer
import nodemailer from 'nodemailer';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
////body-parser
import bodyParser from 'body-parser';
var urlencodedParser = bodyParser.urlencoded({ extended: false });
////cors
import cors from 'cors';
//////bcrypt
import bcrypt from 'bcrypt';
////cookie parser
import cookies from 'cookie-parser';
////jsonwebtoken
import jwt from 'jsonwebtoken';
////multer
import multer from 'multer';

//db & mongodb connection.............
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('db connected & server running @', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

//uses....
////express
app.use(express.json());
//cors
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
////cookies
app.use(cookies());
////nodemailer
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'Gmail',
  auth: {
    user: process.env.ID,
    pass: process.env.PASSWORD,
  },
});
////multer
app.use('/uploads', express.static('uploads'));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 500 },
});

//Routes........

//User Routes...............
////signup send otp
app.post('/signup', async (req, res) => {
  const Users = await User.findOne({ username: req.body.username });
  if (Users == null) {
    const Users = await User.findOne({ email: req.body.email });
    if (Users == null) {
      try {
        const mailOptions = {
          to: req.body.email,
          subject: 'Otp for registration is: ',
          html:
            '<h3>OTP for account verification is </h3>' +
            "<h1 style='font-weight:bold;'>" +
            otp +
            '</h1>',
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
        });
        res.send('sendotpsuccessful');
      } catch (err) {
        res.send(err);
      }
    } else {
      res.send('email already exist');
    }
  } else {
    res.send('username already exist');
  }
});
////verify signup otp & save user
app.post('/signup/otp_verify', (req, res) => {
  console.log(req.body);
  if (req.body.otp == otp) {
    const token = jwt.sign(
      { username: req.body.username },
      process.env.JWT_KEY,
      {
        expiresIn: '15d',
      }
    );
    bcrypt.hash(req.body.password, 15, function (err, hash) {
      User.insertMany([
        {
          username: req.body.username,
          email: req.body.email,
          password: hash,
          token: token,
          isAdmin: false,
          about: '',
          website: '',
          adress: '',
          state: '',
          country: '',
          pincode: '',
          twitter: '',
          facebook: '',
          pinterest: '',
          gender: '',
          age: '',
          language: '',
          youtube: '',
        },
      ]);
    });
    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 36000000),
    };
    res.cookie('token', token, options);
    res.send('user created');
  } else {
    res.send('wrong otp');
  }
});

////login user & give token
app.post('/login', async (req, res, next) => {
  const founduser = await User.findOne({ username: req.body.username });
  if (founduser != null) {
    const match = await bcrypt.compare(req.body.password, founduser.password);
    const token = jwt.sign({ id: founduser._id }, process.env.JWT_KEY, {
      expiresIn: '15d',
    });
    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 36000000),
    };
    res.cookie('token', token, options);
    User.updateOne(
      { _id: founduser._id },
      { token: token },
      { multi: true },
      function (err, numberAffected) {}
    );
    if (match) {
      res.send('login');
    } else {
      res.send('incorrect pass');
    }
  } else {
    res.send('Username not exist');
  }
});
////login forget pass otp send
app.post('/login/forgetpass', async (req, res) => {
  const founduser = await User.findOne({ username: req.body.username });
  if (founduser != null) {
    const founduser = await User.findOne({ email: req.body.email });
    if (founduser != null) {
      try {
        const mailOptions = {
          to: req.body.email,
          subject: 'Otp for registration is: ',
          html:
            '<h3>OTP for account verification is </h3>' +
            "<h1 style='font-weight:bold;'>" +
            otp +
            '</h1>',
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
        });
        res.send('sendotpsuccessful');
      } catch {}
    } else {
      res.send('email not exist');
    }
  } else {
    res.send('usrname not exist');
  }
});
////login forget pass otp verify
app.post('/login/forgetpass/otp_verify', (req, res) => {
  if (req.body.otp == otp) {
    res.send('otpverified');
  } else {
    res.send('wrong otp');
  }
});
////login forgetpass change pass
app.post('/login/forgetpass/changepassword', async (req, res) => {
  bcrypt.hash(req.body.password, 15, async function (err, hash) {
    await User.findOneAndUpdate(
      { username: req.body.username },
      { password: hash }
    );
    res.send('updated');
  });
});

////authenticate loginuser middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // const verifyToken = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ token: token });

    // if (!user) {
    //   throw new Error('user not found');
    // }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
};
////send loginuser data
app.get('/user/authenticate', authenticate, async (req, res) => {
  res.send(req.user);
});
////logout
app.get('/logout', (req, res) => {
  try {
    res.clearCookie('token', { path: '/' });
    res.send('logout');
  } catch {}
});
////update user's data
app.post('/user/update/data', async (req, res) => {
  // const user = await User.find({ username: req.body.username });
  // if (user.length !== 0) {
  await User.findOneAndUpdate(
    { username: req.body.username },
    {
      $set: {
        about: req.body.newabout,
        website: req.body.newwebsite,
        adress: req.body.newadress,
        state: req.body.newstate,
        country: req.body.newcountry,
        pincode: req.body.newpincode,
        twitter: req.body.newtwitter,
        facebook: req.body.newfacebook,
        pinterest: req.body.newpinterest,
        gender: req.body.newgender,
        age: req.body.newage,
        language: req.body.newlanguage,
        youtube: req.body.newage,
      },
    }
  );
  // }
});
////update user's profile photo
app.post(
  '/user/update/profileimage',
  urlencodedParser,
  upload.single('profileimage'),
  async (req, res) => {
    await User.findOneAndUpdate(
      { username: req.body.username },
      {
        $set: {
          profilephoto: req.file.path,
        },
      }
    );
  }
);
////update user's banner image
app.post(
  '/user/update/banner',
  urlencodedParser,
  upload.single('banner'),
  async (req, res) => {
    await User.findOneAndUpdate(
      { username: req.body.username },
      {
        $set: {
          banner: req.file.path,
        },
      }
    );
  }
);

//Add Data Routes.............(only login user can reach to these routes)
////create a create
app.post(
  '/create',
  urlencodedParser,
  upload.single('create'),
  async (req, res) => {
    var string = req.body.tag.split(',');
    Create.insertMany([
      {
        username: req.body.username,
        type: req.body.type,
        title: req.body.title,
        url: req.file.path,
        tag: string,
        link: req.body.link,
        discription: req.body.discription,
      },
    ]);
    if (string[4] !== undefined) {
      const tag0 = await Tag.findOne({ tag: string[0] });
      const tag1 = await Tag.findOne({ tag: string[0] });
      const tag2 = await Tag.findOne({ tag: string[0] });
      const tag3 = await Tag.findOne({ tag: string[0] });
      const tag4 = await Tag.findOne({ tag: string[0] });
      if (tag0 === null) {
        Tag.insertMany([{ tag: string[0] }]);
      }
      if (tag1 === null) {
        Tag.insertMany([{ tag: string[1] }]);
      }
      if (tag2 === null) {
        Tag.insertMany([{ tag: string[2] }]);
      }
      if (tag3 === null) {
        Tag.insertMany([{ tag: string[3] }]);
      }
      if (tag4 === null) {
        Tag.insertMany([{ tag: string[4] }]);
      }
    } else {
      if (string[3] !== undefined) {
        const tag0 = await Tag.findOne({ tag: string[0] });
        const tag1 = await Tag.findOne({ tag: string[1] });
        const tag2 = await Tag.findOne({ tag: string[2] });
        const tag3 = await Tag.findOne({ tag: string[3] });
        if (tag0 === null) {
          Tag.insertMany([{ tag: string[0] }]);
        }
        if (tag1 === null) {
          Tag.insertMany([{ tag: string[1] }]);
        }
        if (tag2 === null) {
          Tag.insertMany([{ tag: string[2] }]);
        }
        if (tag3 === null) {
          Tag.insertMany([{ tag: string[3] }]);
        }
      } else {
        if (string[2] !== undefined) {
          const tag0 = await Tag.findOne({ tag: string[0] });
          const tag1 = await Tag.findOne({ tag: string[1] });
          const tag2 = await Tag.findOne({ tag: string[2] });
          if (tag0 === null) {
            Tag.insertMany([{ tag: string[0] }]);
          }
          if (tag1 === null) {
            Tag.insertMany([{ tag: string[1] }]);
          }
          if (tag2 === null) {
            Tag.insertMany([{ tag: string[2] }]);
          }
        } else {
          if (string[1] !== undefined) {
            const tag0 = await Tag.findOne({ tag: string[0] });
            const tag1 = await Tag.findOne({ tag: string[1] });
            if (tag0 === null) {
              Tag.insertMany([{ tag: string[0] }]);
            }
            if (tag1 === null) {
              Tag.insertMany([{ tag: string[1] }]);
            }
          } else {
            if (string[0] !== undefined) {
              const tag0 = await Tag.findOne({ tag: string[0] });
              if (tag0 === null) {
                Tag.insertMany([{ tag: string[0] }]);
              }
            }
          }
        }
      }
      res.redirect('/');
    }
  }
);
////follow a creator
app.post('/add/follow', async (req, res) => {
  if (req.body.username != null) {
    await User.updateOne(
      { username: req.body.username },
      { $push: { followingusername: req.body.user } }
    );
    //creator
    await User.updateOne(
      { username: req.body.user },
      {
        $push: {
          follwersusername: req.body.username,
          notification: {
            notificationtext:
              req.body.username + 'is now started following you',
          },
        },
      }
    );
    res.send('followed');
  } else {
  }
});
////like a create
app.post('/add/like', async (req, res) => {
  await User.updateOne(
    { username: req.body.likeusername },
    { $push: { likecreateid: req.body.likecreateid } }
  );
  await Create.updateOne(
    { _id: req.body.likecreateid },
    { $push: { likeusername: req.body.likeusername } }
  );
  const create = await Create.findOne({ _id: req.body.likecreateid });
  if (create) {
    await User.updateOne(
      { username: req.body.likeusername },
      { $push: { likedtag: create.tag } }
    );
  }
  res.send('liked');
});
////comment to a create
app.post('/add/comment', async (req, res) => {
  await Create.updateOne(
    { _id: req.body.id },
    {
      $push: {
        comment: { username: req.body.username, comment: req.body.newcomment },
      },
    }
  );
  res.send('successfull');
});
app.post('/add/like/:slug', async (req, res) => {
  await Create.findOneAndUpdate(
    { _id: req.params.slug },
    { $inc: { view: 0.5 } }
  );
});
app.post('/add/create/savedcreate', async (req, res) => {
  await User.updateOne(
    { username: req.body.username },
    { $push: { savedcreate: req.body.createID } }
  );
  res.send('saved');
});
app.post('/add/report/create', async (req, res) => {
  const submit = await Create.updateOne(
    { _id: req.body.id },
    {
      $push: {
        report: { username: req.body.user, reportreason: req.body.reason },
      },
    }
  );
  res.send('submited');
});
app.post('/add/user/searchhistory', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  const usersearchhistory = user.searchhistory;
  const keys = ['searchedtext'];
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(req.body.query))
    );
  };
  const searchtextexist = search(usersearchhistory);
  if (searchtextexist.length === 0) {
    await User.updateOne(
      { username: req.body.username },
      {
        $push: {
          searchhistory: { searchedtext: req.body.query },
        },
      }
    );
    await Search.insertMany([
      {
        searchtext: req.body.query,
      },
    ]);
  }
  res.send('hi');
});

//Check Route
////check user liked a create or not
app.post('/check/user/like', async (req, res) => {
  const alreadylikecreateid = await Create.find({
    _id: req.body.createid,
    likeusername: req.body.username,
  });
  if (alreadylikecreateid.length === 0) {
    res.send('notliked');
  } else {
    res.send('alreadylikecreateid');
  }
});
app.post('/check/user/follow', async (req, res) => {
  const alreadyfollow = await User.find({
    username: req.body.username,
    followingusername: { $in: req.body.creatorusername },
  });
  if (alreadyfollow.length === 0) {
    res.send('notfollowed');
  } else {
    res.send('alredyfollowed');
  }
});
app.post('/check/user/save', async (req, res) => {
  const alreadysavecreateid = await User.find({
    username: req.body.username,
    savedcreate: { $in: req.body.createid },
  });
  if (alreadysavecreateid.length === 0) {
    res.send('notsaved');
  } else {
    res.send('alreadysaved');
  }
});

//Delete Data Routes................(only login user can reach to these routes)
////delete user account
app.post('/user/delete', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.body.username });
    const create = await Create.findOneAndDelete({
      username: req.body.username,
    });
    res.clearCookie('token', { path: '/' });
    res.send('account deleted');
  } catch {}
});
////dislike a create
app.post('/create/dislike', async (req, res) => {
  await User.updateOne(
    { username: req.body.likeusername },
    { $pull: { likecreateid: req.body.likecreateid } }
  );
  await Create.updateOne(
    { _id: req.body.likecreateid },
    { $pull: { likeusername: req.body.likeusername } }
  );
  const create = await Create.findOne({ _id: req.body.likecreateid });
  if (create) {
    await User.updateOne(
      { username: req.body.likeusername },
      { $pull: { likedtag: create.tag } }
    );
  }
  res.send('disliked');
});
////unfollow a creator
app.post('/delete/follow', async (req, res) => {
  if (req.body.username != null) {
    await User.updateOne(
      { username: req.body.username },
      { $pull: { followingusername: req.body.user } }
    );
    await User.updateOne(
      { username: req.body.user },
      {
        $pull: {
          follwersusername: req.body.username,
        },
        $push: {
          notification: {
            notificationtext:
              req.body.username + ' is now stoped following you',
          },
        },
      }
    );
    res.send('unfollowed');
  } else {
  }
});
////delete saved create of user
app.post('/delete/create/savedcreate', async (req, res) => {
  await User.updateOne(
    { username: req.body.username },
    { $pull: { savedcreate: req.body.createID } }
  );
  res.send('deleted');
});
////delete a create by its id
app.post('/delete/create/byID', async (req, res) => {
  await Create.findOneAndDelete({ _id: req.body.ID });
  const create = await Create.find({ username: req.body.username });
  res.send(create);
});
////delete user's searchhistory
app.post('/delete/user/searchhistory', async (req, res) => {
  await User.updateOne(
    { username: req.body.username },
    {
      $set: {
        searchhistory: [],
      },
    }
  );
  res.send('deleted successful');
});

//Find Data Routes..........

////find creates of creator whom user following
app.post('/find/creates/byfollowings', async (req, res) => {
  if (req.body.username) {
    const Users = await User.findOne({ username: req.body.username });
    const followingcreate = await Create.find({
      username: {
        $in: Users.followingusername,
      },
    }).sort('-date');
    res.send(followingcreate);
  } else {
    console.log('user is not login');
  }
});
app.post('/find/creates/bylikedtag', async (req, res) => {
  if (req.body.username) {
    const Users = await User.findOne({ username: req.body.username });
    const likedtagcreate = await Create.find({
      tag: {
        $in: Users.likedtag,
      },
    }).sort('-date');
    res.send(likedtagcreate);
  } else {
    console.log('user is not login');
  }
});
////find creates by all creators
app.get('/find/creates/all', async (req, res) => {
  const Creates = await Create.find().sort('-date');
  const { q } = req.query;

  const keys = ['title', 'discription'];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    );
  };

  q ? res.json(search(Creates).slice(0, 10)) : res.json(Creates.slice(0, 10));
});
////find creates by creator's username(slug)
app.get('/find/creates/byusername/:slug', async (req, res) => {
  const Creates = await Create.find({ username: req.params.slug });
  res.send(Creates);
});
////find a create by id
app.get('/find/create/withID/:slug', async (req, res) => {
  const Creates = await Create.findOne({ _id: req.params.slug });
  res.send(Creates);
});
////find creates by creator's username
app.post('/find/creates/byusername', async (req, res) => {
  const Creates = await Create.find({ username: req.body.username });
  res.send(Creates);
});
////find creates by tag
app.get('/find/creates/withtag/:slug', async (req, res) => {
  const creates = await Create.find().sort('-date');
  const keystitle = ['title', 'discription'];
  const searchtitle = (data) => {
    return data.filter((item) =>
      keystitle.some((key) => item[key].toLowerCase().includes(req.params.slug))
    );
  };
  res.send(searchtitle(creates));
});
////find creator by username
app.get('/find/creator/byusername/:slug', async (req, res) => {
  const Users = await User.findOne({ username: req.params.slug });
  if (Users == null) {
    res.send('no user');
  } else {
    res.send(Users);
  }
});
app.get('/find/creators/top', async (req, res) => {
  //not sorting properly
  const creators = await User.find().sort({ follwersusername: 1 });
  res.send(creators);
});
app.post('/find/serachhistory/all', async (req, res) => {
  const searchhistorys = await User.findOne({
    username: req.body.username,
  }).sort('-date');
  const searchedtexts = searchhistorys.searchhistory;
  const { q } = req.query;
  const keys = ['searchedtext'];
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    );
  };
  const matchedtagarray = search(searchedtexts).slice(0, 5);
  q && res.json(matchedtagarray);
});
app.get('/find/tags/all', async (req, res) => {
  const tags = await Tag.find().sort('-date');
  const { q } = req.query;
  const keys = ['tag'];
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    );
  };
  const users = await User.find().sort('-date');
  const keysusername = ['username'];
  const searchusername = (data) => {
    return data.filter((item) =>
      keysusername.some((key) => item[key].toLowerCase().includes(q))
    );
  };
  const creates = await Create.find().sort('-date');
  const keystitle = ['title'];
  const searchtitle = (data) => {
    return data.filter((item) =>
      keystitle.some((key) => item[key].toLowerCase().includes(q))
    );
  };
  const matchedtagarray = search(tags).slice(0, 5);
  const matchedusernamearray = searchusername(users).slice(0, 5);
  const matchedtitlearray = searchtitle(creates).slice(0, 5);

  const two_dim_array = [
    matchedtagarray,
    matchedusernamearray,
    matchedtitlearray,
  ];

  q && res.json(two_dim_array);
});
app.post('/find/create/like', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const create = await Create.find({ _id: user.likecreateid });
  res.send(create);
});
app.post('/find/create/saveforlater', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const create = await Create.find({ _id: user.savedcreate });
  res.send(create);
});
app.post('/find/creator/suggested', async (req, res) => {
  const userlikedtag = await User.findOne({
    username: req.body.username,
  });
  const likedtagcreate = await Create.find({
    tag: {
      $in: userlikedtag.likedtag,
    },
  });
  let resulth = likedtagcreate.map((a) => a.username);
  const usersuggested = await User.find({
    username: resulth,
  });
  res.send(usersuggested);
});

//Forum Routes...............
////forum add new ques
app.post('/forum/add/ques', async (req, res) => {
  Forum.insertMany([
    {
      quesusername: req.body.quesusername,
      ques: req.body.ques,
    },
  ]);
});
////forum add ans
app.post('/forum/add/ans', async (req, res) => {
  await Forum.updateOne(
    { _id: req.body.quesid },
    {
      $push: {
        ans: { answer: req.body.answer, ansusername: req.body.ansusername },
      },
    }
  );
  res.send('saved');
});
////forum find all ques
app.get('/forum/find/ques/byques/:slug', async (req, res) => {
  const forums = await Forum.findOne({ ques: req.params.slug });
  console.log(req.params.slug);
  res.send(forums);
});
////forum find all ques with query
app.get('/forum/find/ques/all', async (req, res) => {
  const Forums = await Forum.find().sort('-date');
  const { q } = req.query;

  const keys = ['ques'];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    );
  };

  q ? res.json(search(Forums).slice(0, 10)) : res.json(Forums.slice(0, 10));
});
////find ques of creator whom user following
app.post('/forum/find/ques/byfollowings', async (req, res) => {
  if (req.body.username) {
    const Users = await User.findOne({ username: req.body.username });
    const followingques = await Forum.find({
      quesusername: {
        $in: Users.followingusername,
      },
    }).sort('-date');
    res.send(followingques);
  } else {
    console.log('user is not login');
  }
});

//Schemas.........

////User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  phoneno: { type: Number },
  website: { type: String },
  savedcreate: [{ type: String }],
  password: { type: String, require: true },
  profilephoto: { type: String },
  banner: { type: String },
  about: { type: String },
  speciality: { type: String },
  isAdmin: { type: Boolean },
  plan: { type: String },
  adress: { type: String },
  pincode: { type: Number },
  state: { type: String },
  country: { type: String },
  language: { type: String },
  twitter: { type: String },
  pinterest: { type: String },
  facebook: { type: String },
  youtube: { type: String },
  follwersusername: [{ type: String }],
  followingusername: [{ type: String }],
  likecreateid: [{ type: String }],
  age: { type: Number },
  gender: { type: String },
  likedtag: [{ type: String }],
  token: { type: String },
  date: { type: String, default: Date },
  searchhistory: [
    { searchedtext: { type: String }, date: { type: String, default: Date } },
  ],
  notification: [
    {
      notificationtext: { type: String },
      date: { type: String, default: Date },
    },
  ],
});
const User = mongoose.model('User', UserSchema);

////Create Schema
const CreateSchema = new mongoose.Schema({
  username: { type: String, require: true },
  title: { type: String, require: true },
  url: { type: String, required: true },
  type: { type: String, require: true },
  likeusername: [{ type: String }],
  view: { type: Number },
  link: { type: String },
  discription: { type: String },
  tag: [{ type: String }],
  date: { type: String, default: Date },
  report: [
    {
      username: {
        type: String,
      },
      reportreason: {
        type: String,
      },
    },
  ],
  comment: [
    {
      username: {
        type: String,
      },
      comment: {
        type: String,
      },
    },
  ],
});
const Create = mongoose.model('Create', CreateSchema);

////Forum Schema
const ForumSchema = new mongoose.Schema({
  quesusername: { type: String, require: true },
  ques: { type: String, require: true },
  ans: [
    {
      ansusername: {
        type: String,
      },
      answer: {
        type: String,
      },
    },
  ],
  date: { type: String, default: Date },
});
const Forum = mongoose.model('Forum', ForumSchema);

////Tag Schema
const TagSchema = new mongoose.Schema({
  tag: { type: String, require: true },
  date: { type: String, default: Date },
});
const Tag = mongoose.model('Tag', TagSchema);

////Search Schema
const SearchSchema = new mongoose.Schema({
  searchtext: { type: String, require: true },
  date: { type: String, default: Date },
});
const Search = mongoose.model('Search', SearchSchema);

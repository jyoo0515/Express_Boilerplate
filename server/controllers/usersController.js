const { User } = require("../models");
const auth = require("../middleware/auth");

exports.getAll = async (req, res) => {
  // Async/Await
  // try {
  //   const users = await User.findAll();
  //   return res.json(users);
  // } catch (err) {
  //   console.log(err);
  //   return res.status(500).json({ error: "Something went wrong" });
  // }

  // Promise
  User.findAll()
    .then((users) => {
      return res.json(users);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

exports.getOne = async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await User.findOne({
      where: { uuid },
    });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.me = async (req, res) => {
  const email = req.user.email;
  try {
    const user = await User.findOne({ where: { email } });
    return res.json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (await emailIsUnique(email)) {
    try {
      const user = await User.create({ name, email, password });
      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something wnet wrong" });
    }
  } else {
    return res.status(400).json({ message: "Email already exists" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const token = auth.generateToken(user, password);
      if (!token) {
        return res
          .status(401)
          .json({ loginSuccess: false, message: "Incorrect password" });
      }
      return res
        .cookie("access_token", token, {
          expires: new Date(new Date().getTime() + 1 * 60 * 60000),
          sameSite: "strict",
          httpOnly: true,
        })
        .json({ loginSuccess: true, email: email });
    } else {
      return res.status(400).json({ message: `User with ${email} not found` });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.logout = (req, res) => {
  return res
    .cookie("access_token", "")
    .json({ message: "Successfully logged out" });
};

exports.delete = async (req, res) => {
  const uuid = req.params.uuid;

  try {
    const user = await User.destroy({
      where: { uuid },
    });
    return res.json({ message: "Deletion successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const emailIsUnique = async (email) => {
  const count = await User.count({ where: { email } });
  if (count != 0) {
    return false;
  }
  return true;
};

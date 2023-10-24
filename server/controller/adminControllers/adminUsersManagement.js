const User=require("../../model/users")


exports.adminUserManagementGet = async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin_user_management", { users: users ,message:true});
  } catch (err) {
    console.log(err);
    res.status(500).send("Error on findin users");
  }
};

exports.userBlock = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find();
    const blockedUser = users.find(user => user._id.toString() == userId)
    if(blockedUser){
        blockedUser.isBlocked = true;
        await blockedUser.save();
    }
    res.render("admin_user_management", {users, status: "Unactive"})
    return res.status(200).end();
  } catch (err) {
    console.log(err);
  }
};

exports.userUnblock = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find();
    const unblockUser = users.find((user) => user._id.toString() == userId);
    if (unblockUser) {
      unblockUser.isBlocked = false;
      await unblockUser.save();
    }
    res.render("admin_user_management", { users, status: "Active" });
    return res.status(200).end();
  } catch (err) {
    console.log(err);
  }
};

// Export user data post routes-

const bcrypt = require("bcrypt");
const { account } = require("../../../models/accountModel");
// const { encrypt, decrypt } = require("../../../authentication/id-encrypt-decrypt");
const { restrict_to_logged_in } = require("../../../middlewares/restrict_to_logged_in");
const { remove_whitespaces } = require("../../../utils/utils");


module.exports = function (app) {

  // Updating my tasks-
  app.post("/editTasks", restrict_to_logged_in, async (req, res) => {

    // let decrypted_id = decrypt(req.body.enc_user_Id);
    const user_id = req.user_id;

    console.log(req.body)

    try {
      // If user has changed email-
      let user = await account.findOne({ _id: user_id }, { _id: 1 });

      if (user) {

        let updateddetails = await account.findOneAndUpdate({ _id: user_id }, { $set: { tasks: req.body.tasks } });

        if (updateddetails) {
          res.send("updated_tasks");
        };

      }
      else {
        res.send("user_not_found");
      };
    } catch (error) {
      console.log(error);
      res.send("Error");
    };

  });

  // These are some more routes i wrote for adding more functionality in future. If i got time. But i want to be busy by being successful:) ---------------------------------------------------------------------------------------------------------------


  //   // Compare password-
  //   app.post("/comparepassword", restrict_to_logged_in, async (req, res) => {
  //     // let decrypted_id = decrypt(req.body.enc_user_Id);
  //     const user_id = req.user_id;

  //     // Remove whitespaces-
  //     let plaintextPassword = remove_whitespaces(req.body.oldpassword);
  //     // console.log(plaintextPassword);
  //     try {

  //       let user = await account.findOne({ _id: user_id }, { user_password: 1 });
  //       let comparePassword = await bcrypt.compare(plaintextPassword, user.user_password);
  //       // console.log(comparePassword);

  //       if (comparePassword) {
  //         res.send(comparePassword);
  //       };

  //     } catch (error) {
  //       console.log(error);
  //       res.send("Error");
  //     };
  //   });

  //   // Change password-
  //   app.post("/changepassword", restrict_to_logged_in, async (req, res) => {
  //     // let decrypted_id = decrypt(req.body.enc_user_Id);
  //     const user_id = req.user_id;

  //     // Remove whitespaces-
  //     const saltRounds = 10;
  //     let newPassword = remove_whitespaces(req.body.newpassword);
  //     // console.log(newPassword);
  //     try {

  //       const hashnewpassword = await bcrypt.hash(newPassword, saltRounds);
  //       const updatepassword = await account.findOneAndUpdate({ _id: user_id }, { $set: { user_password: hashnewpassword } });

  //       if (updatepassword) {
  //         res.send("Updated password");
  //       };

  //     } catch (error) {
  //       console.log(error);
  //       res.send("Error");
  //     };
  //   });

  //   // Lock-unlock-
  //   app.post("/lockform", restrict_to_logged_in, async (req, res) => {
  //     // let decrypted_id = decrypt(req.body.enc_user_Id);
  //     const user_id = req.user_id;

  //     try {

  //       const update_profile_status = await account.findOneAndUpdate({ _id: user_id }, { $set: { profile_status: "locked" } });

  //       if (update_profile_status) {
  //         res.send("Locked");
  //       };

  //     } catch (error) {
  //       console.log(error);
  //       res.send("Error");
  //     };
  //   });

  //   app.post("/unlockform", restrict_to_logged_in, async (req, res) => {
  //     // let decrypted_id = decrypt(req.body.enc_user_Id);
  //     const user_id = req.user_id;

  //     try {

  //       const update_profile_status = await account.findOneAndUpdate({ _id: user_id }, { $set: { profile_status: "unlock" } });

  //       if (update_profile_status) {
  //         res.send("Unlocked");
  //       };

  //     } catch (error) {
  //       console.log(error);
  //       res.send("Error");
  //     };
  //   });


  //   // Link account-
  //   app.post("/linknewaccount", restrict_to_logged_in, async (req, res) => {
  //     // Need to be done when all login and create are done for encrypted ids-
  //     // let decrypted_id = decrypt(req.body.enc_user_Id);
  //     const user_id = req.user_id;


  //     try {

  //       const addemail = req.body.addemail;
  //       const addpassword = req.body.addpassword;

  //       const user = await account.findOne({ user_email: addemail }, { user_email: 1, user_password: 1 });
  //       // res.send(user) //to visit its database page.
  //       if (user) {

  //         const isPasswordMatch = await bcrypt.compare(addpassword, user.user_password);

  //         if (isPasswordMatch) {
  //           // To link both accounts-
  //           let linktothisaccount = await account.findOneAndUpdate({ _id: user_id }, { $addToSet: { linked_accounts: user.id } });

  //           if (linktothisaccount) {

  //             let linkthisaccount = await account.findOneAndUpdate({ _id: user.id }, { $addToSet: { linked_accounts: user_id } });

  //             if (linkthisaccount) {
  //               res.send("Linked");
  //             };

  //           };

  //         };
  //       }
  //       else {
  //         res.send("Not found");
  //       };

  //     } catch (error) {
  //       console.log(error);
  //       res.send("Not found");
  //     };

  //   });

  //   // Unlink account-
  //   app.post("/unlinkaccount", restrict_to_logged_in, async (req, res) => {
  //     // let decrypted_id = decrypt(req.body.enc_user_Id);
  //     const user_id = req.user_id;


  //     try {

  //       const unlinkaccid = req.body.unlinkaccid;

  //       const user = await account.findOne({ _id: unlinkaccid }, { _id: 1 });

  //       // If the account the user is unlinking is active then do this-

  //       if (user) {

  //         // To unlink both accounts-
  //         let unlinktothisaccount = await account.findOneAndUpdate({ _id: user_id }, { $pull: { linked_accounts: user.id } });

  //         if (unlinktothisaccount) {

  //           let unlinkthisaccount = await account.findOneAndUpdate({ _id: user.id }, { $pull: { linked_accounts: user_id } });

  //           if (unlinkthisaccount) {
  //             res.send("Unlinked");
  //           };

  //         };

  //       }
  //       // If the account the user is unlinking is not found (i.e. deleted etc) then do this-
  //       else {

  //         let unlinktothisaccount = await account.findOneAndUpdate({ _id: user_id }, { $pull: { linked_accounts: unlinkaccid } });

  //         if (unlinktothisaccount) {
  //           res.send("Unlinked");
  //         };

  //       };

  //     } catch (error) {
  //       console.log(error);
  //       res.send("Error");
  //     };

  //   });

  //   // Feedbacks-
  //   app.post("/feedback", restrict_to_logged_in, async (req, res) => {
  //     // let data = new feedback(req.body);
  //     let data = new feedback({
  //       feedback: req.body.feedback,
  //       feedId: req.user_id,
  //       feed_time: new Date(),

  //     });

  //     await data.save().then(() => {
  //       res.send("Saved feedback");
  //     }).catch((error) => {
  //       console.log(error);
  //       res.send("Error");
  //     });
  //   });

};
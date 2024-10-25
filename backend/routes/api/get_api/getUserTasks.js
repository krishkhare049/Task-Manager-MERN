const { account } = require('../../../models/accountModel')
const { restrict_to_logged_in } = require("../../../middlewares/restrict_to_logged_in");
const { default: mongoose } = require('mongoose');

module.exports = function (app) {

    app.get('/myAllTasks', restrict_to_logged_in, async (req, res) => {
        const user_id = req.user_id;
        // Using aggregation-
        const user = await account.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(user_id),
                },
            },
            { $limit: 1 },
            {
                $project: {
                    _id: 1,
                    tasks: 1,
                    tasksLen: { $size: "$tasks" },
                },
            },
        ]);

        let user_data_obj = user[0];
        // console.log(user_data_obj);

        res.send(user_data_obj);
    })

};
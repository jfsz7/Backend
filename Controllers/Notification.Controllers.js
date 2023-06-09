const Notification = require("../Models/NotificationModel");


module.exports.getNotifications = async (req, res) => {
  try {
    const id = req.params.id
    const notifications = await Notification.find({recipient: id}).populate('recipient').sort("-createdAt").limit(5);
    if(notifications){
        res.status(200).json({result: notifications});
    }else{
        res.status(500).json({ error: error.message });

    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
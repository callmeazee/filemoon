const FileModel = require("../models/file.model")

const fetchDashboard = async (req, res) => {
     try {
          const reports = await FileModel.aggregate([
               {
                    $group: {
                         _id: "$type",
                         total: {$sum:1}
                         
                    },
                 
                
               },

               /* it takes more compute power so that is why we are skipping instead we can handle in frontend by giving id==type  */
       /*         {
                    $project: {
                         type: "$_id",
                         _id: 0,
                         total:1
                    }
               } */
          ])
          res.status(200).json(reports)
          
     } catch (err) {
          res.status(500).json({message: err.message})
     }
}

module.exports = {
     fetchDashboard
}
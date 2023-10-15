import sequelize from "../config/database.js";
//import socketModule from "../app.js";
import {AddBins} from '../models/associations.js'
import {AddItems} from '../models/associations.js'
import {ServeItems} from '../models/associations.js'
import {Tasks} from '../models/associations.js';

// const socketModule=new SocketModule()
// const io = socketModule.getIo();


export default {
  addItemTask: async (req, res) => {
    const { supervisorID, ...taskDetails } = req.body;
    if (supervisorID && taskDetails) {
      try {
        const currentDate = new Date();
        sequelize.transaction(async (t) => {
          const task = await Tasks.create({ supervisorID: supervisorID, taskType: 'addItem', createdAt: currentDate, }, { transaction: t });
          const addItem = await AddItems.bulkCreate({ taskID: task.taskID }, ...taskDetails, { transaction: t });
          // io.emit('newTask', { task, addItem })
          res.status.json({ error: false, message: "Order Created Successfully" })
        })
      } catch (error) {
        res.status(500).json({ error: true, message: `Task failed:${error.message}` })
      }
    } else {
      res.status(400).json({ error: true, message: "Please provide supervisor ID and task details" })
    }


  },
  addBinTask: async (req, res) => {
    const { supervisorID, ...taskDetails } = req.body;
    if (supervisorID && taskDetails) {
      try {
        const currentDate = new Date();
        sequelize.transaction(async (t) => {
          const task = await Tasks.create({ supervisorID: supervisorID, taskType: 'serveItem', createdAt: currentDate, }, { transaction: t });
          const addBin = await AddBins.bulkCreate({ taskID: task.taskID }, ...taskDetails, { transaction: t });
        })
      } catch (error) {

      }

    }
    else {
      res.status(400).json({ error: true, message: "Please provide supervisor ID and task details" })
    }
  },
  serveItemTask: async (req, res) => {
    const { supervisorID, ...taskDetails } = req.body;
    if (supervisorID && taskDetails) {
      try {
        const currentDate = new Date();
        sequelize.transaction(async (t) => {
          const task = await Tasks.create({ supervisorID: supervisorID, taskType: 'serveItem', createdAt: currentDate, }, { transaction: t });
          const serveItem = await ServeItems.bulkCreate({ taskID: task.taskID }, ...taskDetails, { transaction: t });
          io.emit('newTask', { task, serveItem })
          res.status.json({ error: false, message: "Order Created Successfully" })
        })
      } catch (error) {
        res.status(500).json({ error: true, message: `Task failed:${error.message}` })
      }
    } else {
      res.status(400).json({ error: true, message: "Please provide supervisor ID and task details" })
    }
  },
  transferItemTask: async (req, res) => {

  },
  transferBinTask: async (req, res) => {

  },

}
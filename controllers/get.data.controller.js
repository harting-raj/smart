import { Sequelize, where } from 'sequelize';
import sequelize from '../config/database.js';
import { Bins, Users, Racks, Items, Positions } from '../models/associations.js'
import { binList, itemList, emptyBinsList } from '../utils/utils.js';

export default {
    getComponentCount: async (req, res) => {
        try {
            const rack = {};
            const bin = {};
            const item = {};
            const employee = {}
            // count rack, available positions and occupied positions.
            const totalRacks = await Racks.count();
            const positions = {};
            const availablePosition = await Positions.count();
            const occupied = await Bins.count();
            positions.available = availablePosition;
            positions.occupied = occupied;
            rack.totalracks = totalRacks;
            rack.positions = positions;

            //count bins and empty bins
            bin.total = occupied;
            const occupiedBins = await Items.count({
                include: {
                    model: Bins, as: 'bins'
                }
            })

            // total items and distinct items
            item.totalItems = await Items.sum('totalQuantity');
            const itemCount = await Items.findAndCountAll({ attributes: [sequelize.fn('DISTINCT', sequelize.col('itemID'))] });
            item.distinctItems = itemCount.count;
            bin.empty = occupied - occupiedBins;

            //operator and supervisors

            const operator = await Users.count({
                where: {
                    role: 'operator',
                }
            });
            const supervisors = await Users.count({
                where: {
                    role: 'supervisor'
                }
            })

            employee.operators = operator;
            employee.supervisors = supervisors
            res.status(200).json({ rack, bin, item, employee })
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })

        }
    },
    getRackList: async (req, res) => {
        try {
            const rackList = await Racks.findAll({
                attributes: ['rackID', 'row', 'column', [sequelize.fn('COUNT', sequelize.col('bins.binID')), 'binCount']],
                include: [{ model: Bins, as: 'bins', attributes: [] }], group: ['Racks.rackID']
                // limit: 2,
                // offset: 2
            })
            res.status(200).json({ rackList })
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getRackDetail: async (req, res) => {
        try {
            const { rackID } = req.params;
            console.log(rackID);
            const rackDetail = {};
            rackDetail.binList = await binList(rackID);
            rackDetail.itemList = await itemList(rackID);
            rackDetail.emptyBinsList = await emptyBinsList(rackID);

            res.status(200).json({ error: false, rackDetail });
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getBinList: async (req, res) => {
        try {
            const { rackID } = req.body;
            const list = await binList(rackID);
            res.status(200).json({ error: false, list });
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getItemList: async (req, res) => {
        try {
            const { rackID } = req.body;
            const list = await itemList(rackID);
            res.status(200).json({ error: false, list });
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getEmptyBins: async (req, res) => {
        try {
            const { rackID } = req.body;
            const list = await emptyBinsList(rackID);
            res.status(200).json({ error: false, list });
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getBinDetail: async (req, res) => {
        const { binID } = req.params;
        if (binID) {
            try {
                const binDetail = await Bins.findOne({ where: { binID: binID }, attributes: ["binID", "rackID", "itemID", "quantity"], include: [{ model: Items, as: 'item', attributes: ['itemID', 'itemName', 'manufacturer', 'expiryDate', 'totalQuantity'] }] })

                res.status(200).json({ error: false, binDetail });
            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
            }
        } else {
            res.status(400).json({ error: true, message: "Bin ID not found" })
        }
    },
    getItemDetail: async (req, res) => {
        const { itemID } = req.params;
        if (itemID) {
            try {
                const itemDetail = await Items.findOne({ where: { itemID: itemID }, include: { model: Bins, as: 'bins', attributes: ['binID', 'rackID', 'positionID'], } });
                res.status(200).json({ error: false, itemDetail });
            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
            }
        } else {
            res.status(400).json({ error: true, message: "Item ID not found" })
        }
    },
    getUserList: async (req, res) => {
        const { role } = req.params;
        console.log("\n", role);
        if (role) {
            try {

                const userList = await Users.findAll({ where: { role: role }, attributes: ['id', 'firstName', 'lastName'] })
                res.status(200).json({ error: false, userList });
            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
            }
        } else {
            res.status(400).json({ error: true, message: "User role not found" })
        }
    }

}
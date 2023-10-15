import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';

const AddBins=sequelize.define('addbins',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    binID:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    rackID:{
        type:DataTypes.STRING,
        allowNull:false,
    }
})

export default AddBins
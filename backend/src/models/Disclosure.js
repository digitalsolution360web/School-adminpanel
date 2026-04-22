import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Disclosure = sequelize.define('Disclosure', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    src: { type: DataTypes.STRING(1000), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

export default Disclosure;

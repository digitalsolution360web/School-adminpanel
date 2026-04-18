import { sequelize } from './src/config/db.js';
import User from './src/models/User.js';
import bcrypt from 'bcryptjs';

async function check() {
    await sequelize.authenticate();
    const users = await User.findAll();
    console.log("Users in DB:");
    users.forEach(u => console.log(u.email, u.name, u.role));
    process.exit(0);
}
check().catch(console.error);

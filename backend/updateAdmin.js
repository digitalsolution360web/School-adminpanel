import { sequelize } from './src/config/db.js';
import User from './src/models/User.js';

async function updateAdmin() {
    try {
        await sequelize.authenticate();
        
        let user = await User.findOne({ where: { role: 'admin' } });
        
        if (user) {
            user.email = 'sjcsjharsuguda@gmail.com';
            user.password = 'sjcs@Admin';
            user.name = 'St. Joseph\'s Convent School';
            await user.save();
            console.log('✅ Admin credentials updated successfully to sjcsjharsuguda@gmail.com');
        } else {
            console.log('No admin user found. Creating one...');
            await User.create({
                email: 'sjcsjharsuguda@gmail.com',
                password: 'sjcs@Admin',
                name: 'St. Joseph\'s Convent School',
                role: 'admin'
            });
            console.log('✅ Admin user created successfully.');
        }
    } catch (err) {
        console.error('Error updating admin:', err);
    } finally {
        process.exit(0);
    }
}
updateAdmin();

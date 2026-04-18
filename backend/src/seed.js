import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = ':sjcsjharsuguda@gmail.com';
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const adminUser = new User({
            name: 'Joseph School',
            email: email,
            password: 'sjcs@Admin',
            role: 'admin',
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Email:sjcsjharsuguda@gmail.com');
        console.log('Password: sjcs@Admin');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();

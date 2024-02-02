import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL) {
        return console.error('MONGODB_URL not found');
    }
    if (isConnected) {
        return console.log('=> using existing database connection');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log('=> using new database connection');
    } catch (error) {
        console.log(error);
    }
};
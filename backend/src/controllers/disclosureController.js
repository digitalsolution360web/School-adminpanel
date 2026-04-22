import Disclosure from '../models/Disclosure.js';
import { r2Client, getR2Url } from '../config/r2.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const getDisclosure = async (req, res) => {
    try {
        const disclosures = await Disclosure.findAll({ order: [['createdAt', 'DESC']] });
        res.json(disclosures);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addDisclosure = async (req, res) => {
    try {
        const { title } = req.body;
        if (!req.file) return res.status(400).json({ message: 'No document provided' });
        if (!title) return res.status(400).json({ message: 'Title is required' });

        const src = getR2Url(req.file.key);
        const disclosure = await Disclosure.create({
            title,
            src
        });
        res.status(201).json(disclosure);
    } catch (error) {
        console.error('Disclosure Upload Error:', error);
        res.status(500).json({ message: 'Server Error during upload', details: error.message });
    }
};

const updateDisclosure = async (req, res) => {
    try {
        const { title } = req.body;
        const disclosure = await Disclosure.findByPk(req.params.id);
        if (!disclosure) return res.status(404).json({ message: 'Disclosure not found' });

        if (title) disclosure.title = title;

        if (req.file) {
            // Delete old file from R2
            if (disclosure.src && disclosure.src.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL)) {
                try {
                    const oldKey = disclosure.src.replace(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/`, '');
                    await r2Client.send(new DeleteObjectCommand({
                        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
                        Key: oldKey,
                    }));
                } catch (r2Err) {
                    console.warn('R2 delete warning:', r2Err.message);
                }
            }
            disclosure.src = getR2Url(req.file.key);
        }

        await disclosure.save();
        res.json(disclosure);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteDisclosure = async (req, res) => {
    try {
        const disclosure = await Disclosure.findByPk(req.params.id);
        if (!disclosure) return res.status(404).json({ message: 'Disclosure not found' });

        // Delete from R2
        if (disclosure.src && disclosure.src.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL)) {
            try {
                const key = disclosure.src.replace(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/`, '');
                await r2Client.send(new DeleteObjectCommand({
                    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
                    Key: key,
                }));
            } catch (r2Err) {
                console.warn('R2 delete warning:', r2Err.message);
            }
        }

        await disclosure.destroy();
        res.json({ message: 'Disclosure removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getDisclosure, addDisclosure, deleteDisclosure, updateDisclosure };
import multiparty from 'multiparty';
import fs from 'fs';
import mime from 'mime-types';
import {v2 as cloudinary} from 'cloudinary';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';
          


export default async function handle(req, res) {
	await mongooseConnect();
    await isAdminRequest(req, res);

	const form = new multiparty.Form();
	const {fields, files} = await new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if(err) reject(err);
			resolve({fields, files});
		});
	});

	cloudinary.config({ 
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
		api_key: process.env.CLOUDINARY_API_KEY, 
		api_secret: process.env.CLOUDINARY_API_SECRET, 
	  });
	  
	const links = [];
	for(const file of files.file) {
		const ext = file.originalFilename.split('.').pop();
		const newFilename = Date.now() + '.'+ ext;
		const link = await cloudinary.uploader.upload(file.path, {
			folder: "products",
		});
		links.push(link.secure_url);
	}

	return res.json({links});
}

export const config = {
	api: {bodyParser: false},
};
const cloudinary = require('../utils/cloudinaryConfig');
const Image = require('../models/Image');


const uploadImages = async (req, res, next) => {
    try {
        const { images } = req.body;

        if (!images || images.length === 0) {
            return res.status(400).send('No images provided');
        }

        // อัปโหลดรูปภาพไปยัง Cloudinary
        const uploadPromises = images.map(image =>
            cloudinary.uploader.upload(image, { folder: 'dropzone' })
        );

        const results = await Promise.all(uploadPromises);
        console.log('Uploaded images:', results);

        // บันทึก public_id และ url ที่ได้จาก Cloudinary ลง MongoDB
        const savePromises = results.map(result => {
            const newImage = new Image({
                public_id: result.public_id,
                url: result.secure_url,
            });

            return newImage.save();  // บันทึกลง MongoDB
        });

        await Promise.all(savePromises);  // รอให้การบันทึกทั้งหมดสำเร็จ
        res.send({ results });
    } catch (error) {
        console.error('Error uploading images:', error.message);
        next(error);
    }
}

const public_id = 'dropzone/qjguw6hlh75qdsvooune';
const deleteImage = async (public_id) => {
    try {
        // ลบรูปภาพจาก Cloudinary
        const result = await cloudinary.uploader.destroy(public_id);
        console.log('Image deleted from Cloudinary:', result);

        if (result.result === 'ok') {
            // ลบข้อมูลใน MongoDB หลังจากลบรูปภาพใน Cloudinary สำเร็จ
            await Image.findOneAndDelete({ public_id });
            console.log('Image record deleted from MongoDB');
        } else {
            console.log('Failed to delete image from Cloudinary');
        }
    } catch (error) {
        console.error('Error deleting image:', error.message);
    }
};

deleteImage(public_id);

module.exports = {
    uploadImages, deleteImage
}

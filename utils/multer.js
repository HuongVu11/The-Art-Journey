const multer = require('multer')
const upload = multer({dest: 'uploads/'})

module.exports = upload

// module.exports = multer ({
//     storage: multer.diskStorage(),
//     fileFilter: (req,file,cb) => {
//         if(file.mimetype.match(jpe|jpeg|png)) {
//             cb(new Error('File is not supported',false))
//         } cb(null,true)
//     }
// })



// import multer from 'multer'
// const storage = multer.memoryStorage();
// const multerUploads = multer({ storage }).single(‘image’);
// export { multerUploads };
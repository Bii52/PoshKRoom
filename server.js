const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const mongoose = require('mongoose');
const { generateTechnicianDetailHTML } = require('./templates/technicianDetailPage');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.static('.'));

// Upload folder
const UPLOAD_DIR = './uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/poshkroom';

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  _id: String,
  username: String,
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

const technicianSchema = new mongoose.Schema({
  _id: String,
  name: String,
  slug: String,
  shortDescription: String,
  description: String,
  avatar: String,
  cover: String,
  gallery: [String],
  status: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
});

const User = mongoose.model('User', userSchema);
const Technician = mongoose.model('Technician', technicianSchema);

// Helper function
function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// Initialize databases
async function initializeDatabases() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log('✓ Kết nối MongoDB thành công');

    // Create admin user if not exists
    const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    if (!adminExists) {
      const adminUser = new User({
        _id: generateId(),
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      await adminUser.save();
      console.log(`✓ Tài khoản admin được tạo: ${adminUser.username} / ${adminUser.password}`);
    }

    // Create sample technicians if none exist
    const technicianCount = await Technician.countDocuments();
    if (technicianCount === 0) {
      const sampleTechs = [
        {
          _id: generateId(),
          name: 'Nguyễn Văn A',
          slug: 'nguyen-van-a',
          shortDescription: 'Chuyên gia sửa chữa điện tử',
          description: 'Có 10 năm kinh nghiệm sửa chữa các thiết bị điện tử',
          avatar: '/images/placeholder.jpg',
          cover: '/images/placeholder.jpg',
          gallery: [],
          status: true,
          createdAt: new Date()
        },
        {
          _id: generateId(),
          name: 'Trần Thị B',
          slug: 'tran-thi-b',
          shortDescription: 'Chuyên gia bảo trì hệ thống',
          description: 'Chuyên bảo trì và nâng cấp hệ thống máy tính',
          avatar: '/images/placeholder.jpg',
          cover: '/images/placeholder.jpg',
          gallery: [],
          status: true,
          createdAt: new Date()
        }
      ];

      await Technician.insertMany(sampleTechs);
      console.log(`✓ Tạo ${sampleTechs.length} kỹ thuật viên mẫu`);
    }

    console.log('✓ Database đã khởi tạo (MongoDB)');
    console.log(`✓ Database: ${MONGO_URL}`);
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  }
}

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Tên đăng nhập và mật khẩu không được để trống' });
    }

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ TECHNICIAN ENDPOINTS ============

// Lấy danh sách kỹ thuật viên
app.get('/api/technicians', async (req, res) => {
  try {
    const technicians = await Technician.find({ status: true, deletedAt: { $exists: false } }).sort({ createdAt: -1 });
    console.log(`📍 GET /api/technicians - Found ${technicians.length} technicians`);
    technicians.forEach(tech => {
      console.log(`  - ${tech.name} (ID: ${tech._id})`);
    });
    res.json(technicians);
  } catch (err) {
    console.error('❌ Error loading technicians:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Lấy chi tiết kỹ thuật viên theo slug (tên)
app.get('/api/technicians/name/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    console.log(`📍 GET /api/technicians/name/${slug}`);

    const technician = await Technician.findOne({ slug, status: true, deletedAt: { $exists: false } });
    console.log(`✓ Technician found by slug:`, technician ? technician.name : 'NOT FOUND');

    if (!technician) {
      console.warn(`⚠️ Technician not found with slug: ${slug}`);
      return res.status(404).json({ error: 'Kỹ thuật viên không tồn tại' });
    }

    res.json(technician);
  } catch (err) {
    console.error(`❌ Error loading technician by slug:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Lấy chi tiết kỹ thuật viên theo ID
app.get('/api/technicians/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`📍 GET /api/technicians/${id}`);

    const technician = await Technician.findById(id);
    console.log(`✓ Technician found:`, technician ? technician.name : 'NOT FOUND');

    if (!technician) {
      console.warn(`⚠️ Technician not found with ID: ${id}`);
      return res.status(404).json({ error: 'Kỹ thuật viên không tồn tại' });
    }

    res.json(technician);
  } catch (err) {
    console.error(`❌ Error loading technician:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Thêm kỹ thuật viên mới (nhân viên)
app.post('/api/technicians', upload.any(), async (req, res) => {
  try {
    console.log(`📍 POST /api/technicians - Full req.body:`, JSON.stringify(req.body, null, 2));

    const { name, shortDescription, description, slug, status } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Tên nhân viên không được để trống' 
      });
    }

    if (!slug || !slug.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Slug (đường dẫn) không được để trống' 
      });
    }

    // Check slug exists
    const existingTech = await Technician.findOne({ slug: slug.trim().toLowerCase() });
    if (existingTech) {
      return res.status(400).json({ 
        success: false, 
        error: 'Slug đã tồn tại. Vui lòng chọn slug khác' 
      });
    }

    // Process files
    const files = req.files || [];
    let avatar = req.body.avatar || '';
    let cover = req.body.cover || '';
    let gallery = [];

    // Parse gallery from req.body
    if (req.body.gallery) {
      if (Array.isArray(req.body.gallery)) {
        gallery = req.body.gallery.filter(url => url && String(url).trim().length > 0);
      } else if (typeof req.body.gallery === 'string' && req.body.gallery.trim()) {
        gallery = [req.body.gallery];
      }
    }

    console.log(`📍 Before file processing:`);
    console.log(`   Avatar: ${avatar}`);
    console.log(`   Cover: ${cover}`);
    console.log(`   Gallery: ${JSON.stringify(gallery)}`);

    // Process uploaded files (override body values if files exist)
    files.forEach(file => {
      const fileUrl = `/uploads/${file.filename}`;
      if (file.fieldname === 'avatar') {
        avatar = fileUrl;
      } else if (file.fieldname === 'cover') {
        cover = fileUrl;
      } else if (file.fieldname === 'gallery') {
        gallery.push(fileUrl);
      }
    });

    const newTechnician = new Technician({
      _id: generateId(),
      name: name.trim(),
      shortDescription: shortDescription ? String(shortDescription).trim() : '',
      description: description ? String(description).trim() : '',
      slug: slug.trim().toLowerCase(),
      avatar: avatar || '/images/placeholder.jpg',
      cover: cover || '/images/placeholder.jpg',
      gallery: gallery && gallery.length > 0 ? gallery : [],
      status: status === 'true' || status === true || status === 1,
      createdAt: new Date()
    });

    console.log(`📍 Creating technician with:`);
    console.log(`   Name: ${newTechnician.name}`);
    console.log(`   Slug: ${newTechnician.slug}`);
    console.log(`   Avatar: ${newTechnician.avatar}`);
    console.log(`   Cover: ${newTechnician.cover}`);
    console.log(`   Gallery count: ${newTechnician.gallery.length}`);

    await newTechnician.save();

    res.json({
      success: true,
      message: 'Thêm nhân viên thành công',
      id: newTechnician._id,
      data: newTechnician
    });
  } catch (err) {
    console.error('❌ Error creating technician:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi thêm nhân viên', 
      details: err.message 
    });
  }
});

// Sửa kỹ thuật viên
app.put('/api/technicians/:id', upload.any(), async (req, res) => {
  try {
    const id = req.params.id;
    const { name, shortDescription, description, slug, status, oldGallery, avatar: bodyAvatar, cover: bodyCover, gallery: bodyGallery } = req.body;

    const technician = await Technician.findById(id);
    if (!technician) {
      return res.status(404).json({ error: 'Kỹ thuật viên không tồn tại' });
    }

    // Check slug exists (except current)
    const slugExists = await Technician.findOne({ slug, _id: { $ne: id } });
    if (slugExists) {
      return res.status(400).json({ error: 'Slug đã tồn tại' });
    }

    const files = req.files || [];

    // Xử lý avatar
    let avatar = technician.avatar;  // Mặc định giữ avatar cũ
    if (bodyAvatar) {
      // Client gửi URL avatar cũ hoặc ảnh mới
      avatar = bodyAvatar;
    }

    // Xử lý cover
    let cover = technician.cover;    // Mặc định giữ cover cũ
    if (bodyCover) {
      // Client gửi URL cover cũ hoặc ảnh mới
      cover = bodyCover;
    }

    // Xử lý gallery - giữ gallery cũ hoặc dùng oldGallery từ client
    let gallery = oldGallery ? JSON.parse(oldGallery) : (technician.gallery || []);
    if (bodyGallery) {
      if (Array.isArray(bodyGallery)) {
        gallery = bodyGallery;
      } else if (typeof bodyGallery === 'string') {
        gallery = [bodyGallery];
      }
    }

    // Process uploaded files (override với file mới nếu có)
    files.forEach(file => {
      const fileUrl = `/uploads/${file.filename}`;
      if (file.fieldname === 'avatar') {
        avatar = fileUrl;
      } else if (file.fieldname === 'cover') {
        cover = fileUrl;
      } else if (file.fieldname === 'gallery') {
        gallery.push(fileUrl);
      }
    });

    Object.assign(technician, {
      name,
      shortDescription: shortDescription || '',
      description: description || '',
      slug,
      avatar,
      cover,
      gallery,
      status: status === 'true' || status === true,
      updatedAt: new Date()
    });

    console.log(`📍 PUT /api/technicians/${id} - Updating: ${name}`);
    console.log(`   Avatar: ${avatar}`);
    console.log(`   Cover: ${cover}`);
    console.log(`   Gallery: ${JSON.stringify(gallery)}`);

    await technician.save();

    res.json({
      success: true,
      message: 'Cập nhật kỹ thuật viên thành công'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa kỹ thuật viên (soft delete)
app.delete('/api/technicians/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const technician = await Technician.findById(id);

    if (!technician) {
      return res.status(404).json({ error: 'Kỹ thuật viên không tồn tại' });
    }

    // Soft delete
    technician.status = false;
    technician.deletedAt = new Date();
    await technician.save();

    res.json({
      success: true,
      message: 'Xóa kỹ thuật viên thành công'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa ảnh từ gallery
app.delete('/api/technicians/:id/gallery/:image', async (req, res) => {
  try {
    const id = req.params.id;
    const image = '/' + req.params.image.replace(/~/g, '/');

    const technician = await Technician.findById(id);
    if (!technician) {
      return res.status(404).json({ error: 'Kỹ thuật viên không tồn tại' });
    }

    technician.gallery = technician.gallery.filter(img => img !== image);
    await technician.save();

    res.json({
      success: true,
      message: 'Xóa ảnh thành công'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ STATIC PAGES ============

// Route for etiquette page
app.get('/etiquette', (req, res) => {
  res.sendFile(path.join(__dirname, 'etiquette.html'));
});

// Route for profile page
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

// Route for admin pages
app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-login.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

app.get('/admin-technician', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-technician.html'));
});

// ============ DYNAMIC MODEL DETAIL PAGES ============

// Route để hiển thị trang chi tiết model (e.g., /rosie-viet)
app.get('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;

    // Skip nếu là static files hoặc API routes
    if (slug.includes('.') || slug.startsWith('admin') || slug === 'api') {
      return next();
    }

    // Tìm model theo slug
    const technician = await Technician.findOne({ slug, status: true, deletedAt: { $exists: false } });

    if (!technician) {
      return next(); // Pass to next middleware (404)
    }

    // Render model detail page sử dụng template
    const html = generateTechnicianDetailHTML(technician);
    res.send(html);
  } catch (err) {
    console.error('Error loading model page:', err.message);
    next();
  }
});

// Khởi động server
initializeDatabases().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Server chạy tại http://localhost:${PORT}`);
    console.log(`✓ Admin: http://localhost:${PORT}/admin-login.html`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  console.error('❌ Lỗi khởi động:', err.message);
  process.exit(1);
});

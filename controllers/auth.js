const mongodb = require('../data/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, favoriteColor, birthday } = req.body;

        if (!firstName || !lastName || !email || !password || !favoriteColor || !birthday) {
            return res.status(400).json({ 
                error: 'All fields (firstName, lastName, email, password, favoriteColor, birthday) are required' 
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(birthday)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            favoriteColor,
            birthday,
            createdAt: new Date()
        };

        const database = mongodb.getDatabase();
        
        if (!database) {
            return res.status(503).json({ error: 'Database not available' });
        }
        
        const response = await database.collection('users').insertOne(user);
        
        if (response.acknowledged) {
            const token = jwt.sign(
                { userId: response.insertedId.toString(), email: email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            res.status(201).json({ 
                message: 'User registered successfully',
                token: token,
                userId: response.insertedId.toString()
            });
        } else {
            res.status(500).json({ error: 'Registration failed' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Server error during registration', details: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const database = mongodb.getDatabase();
        
        if (!database) {
            return res.status(503).json({ error: 'Database not available' });
        }

        const user = await database.collection('users').findOne({ email: email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
            userId: user._id.toString(),
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                favoriteColor: user.favoriteColor,
                birthday: user.birthday
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : null;

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token required.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        
        const database = mongodb.getDatabase();
        
        if (!database) {
            return res.status(503).json({ error: 'Database not available' });
        }
        
        const user = await database.collection('users').findOne(
            { _id: new ObjectId(userId) },
            { projection: { password: 0 } }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            userId: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            favoriteColor: user.favoriteColor,
            birthday: user.birthday,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Server error fetching user profile' });
    }
};

const logout = async (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

const healthCheck = async (req, res) => {
    try {
        const database = mongodb.getDatabase();
        const dbStatus = database ? 'Connected' : 'Disconnected';
        
        res.status(200).json({ 
            message: 'Auth endpoint is working',
            status: 'OK',
            database: dbStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(200).json({ 
            message: 'Auth endpoint is working',
            status: 'OK', 
            database: 'Error checking',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    verifyToken,
    getCurrentUser,
    healthCheck
};

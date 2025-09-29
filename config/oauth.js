require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';

// Only initialize OAuth if credentials are available
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google OAuth profile:', profile);
        
        const database = mongodb.getDatabase();
        
        if (!database) {
            console.log('Database not available, creating user without DB');
            // Create user without database for testing
            const newUser = {
                _id: 'temp_' + Date.now(),
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                favoriteColor: 'Blue',
                birthday: '1990-01-01',
                createdAt: new Date(),
                provider: 'google'
            };
            return done(null, newUser);
        }

        const existingUser = await database.collection('users').findOne({ 
            googleId: profile.id 
        });

        if (existingUser) {
            console.log('Existing user found:', existingUser);
            return done(null, existingUser);
        }

        const newUser = {
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            favoriteColor: 'Blue',
            birthday: '1990-01-01',
            createdAt: new Date(),
            provider: 'google'
        };

        const result = await database.collection('users').insertOne(newUser);
        newUser._id = result.insertedId;
        
        console.log('New user created:', newUser);
        return done(null, newUser);
    } catch (error) {
        console.error('OAuth error:', error);
        return done(error, null);
    }
}));
} else {
    console.log('⚠️  OAuth Google credentials not configured. OAuth endpoints will not work.');
    console.log('   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables to enable OAuth.');
}

passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
    try {
        const database = mongodb.getDatabase();
        
        if (!database) {
            return done(new Error('Database not available'), null);
        }

        const user = await database.collection('users').findOne({ 
            _id: new ObjectId(id) 
        });
        
        done(null, user);
    } catch (error) {
        console.error('Deserialize user error:', error);
        done(error, null);
    }
});

module.exports = passport;

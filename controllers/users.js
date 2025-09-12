const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// GET all users (já funciona)
const getAll = async (req, res) => {
    try {
        console.log('getAll chamado'); // Debug: veja no console
        const result = await mongodb.getDatabase().collection('users').find();
        const users = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro em getAll:', error);
        res.status(500).json({ error: 'Server error fetching users' });
    }
};

// GET single user by ID
const getSingle = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('getSingle chamado com ID:', userId); // Debug
        if (!ObjectId.isValid(userId)) {
            console.log('ID inválido');
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        const userIdObj = new ObjectId(userId);
        const user = await mongodb.getDatabase().collection('users').findOne({ _id: userIdObj });
        if (!user) {
            console.log('Usuário não encontrado');
            return res.status(404).json({ error: 'User not found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(user);
    } catch (error) {
        console.error('Erro em getSingle:', error);
        res.status(500).json({ error: 'Server error fetching user' });
    }
};

// POST new user (campos: email, username, ipaddress - todos required)
const createUser = async (req, res) => {
    try {
        console.log('createUser chamado com body:', req.body); // Debug: veja o JSON recebido
        const { email, username, ipaddress } = req.body;

        if (!email || !username || !ipaddress) {
            console.log('Validação falhou: campos missing');
            return res.status(400).json({ error: 'All fields (email, username, ipaddress) are required' });
        }

        const user = {
            email,
            username,
            ipaddress
        };
        const response = await mongodb.getDatabase().collection('users').insertOne(user);
        if (response.acknowledged) {
            console.log('Usuário criado com ID:', response.insertedId);
            res.status(201).json({ id: response.insertedId.toString() });
        } else {
            console.log('Insert falhou');
            res.status(500).json({ error: 'Some error occurred while creating the user.' });
        }
    } catch (error) {
        console.error('Erro em createUser:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }
        res.status(500).json({ error: 'Server error creating user' });
    }
};

// PUT update user by ID (partial: só atualiza o que enviar)
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('updateUser chamado com ID:', userId, 'body:', req.body); // Debug
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        const userIdObj = new ObjectId(userId);
        const updates = { $set: {} };
        if (req.body.email) updates.$set.email = req.body.email;  // CORRIGIDO: updates.$set.email (não updates.$setemail)
        if (req.body.username) updates.$set.username = req.body.username;
        if (req.body.name) updates.$set.name = req.body.name;
        if (req.body.ipaddress) updates.$set.ipaddress = req.body.ipaddress;
        if (Object.keys(updates.$set).length === 0) {
            return res.status(400).json({ error: 'No fields provided to update' });
        }
        const response = await mongodb.getDatabase().collection('users').updateOne(
            { _id: userIdObj },
            updates
        );
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('Usuário atualizado, modifiedCount:', response.modifiedCount);
        res.status(200).send();
    } catch (error) {
        console.error('Erro em updateUser:', error);
        res.status(500).json({ error: 'Some error occurred while updating the user.' });
    }
};

// DELETE user by ID
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('deleteUser chamado com ID:', userId); // Debug
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        const userIdObj = new ObjectId(userId);
        const response = await mongodb.getDatabase().collection('users').deleteOne({ _id: userIdObj });
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('Usuário deletado');
        res.status(200).send();
    } catch (error) {
        console.error('Erro em deleteUser:', error);
        res.status(500).json({ error: 'Some error occurred while deleting the user.' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};
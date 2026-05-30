const { Enterprise } = require('../models/enterprise.model');

const getEnterprises = async (req, res) => {
    try {
        const enterprises = await Enterprise.find();
        res.status(200).json(enterprises);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addEnterprise = async (req, res) => {
    try {
        const newEnterprise = new Enterprise(req.body);
        const savedEnterprise = await newEnterprise.save();
        res.status(201).json(savedEnterprise);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteEnterprise = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEnterprise = await Enterprise.findOneAndDelete({ _id: id });

        if (!deletedEnterprise) {
            return res.status(404).json({ message: 'Підприємство не знайдено' });
        }
        return res.status(200).json({ message: 'Успішно видалено' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { getEnterprises, addEnterprise, deleteEnterprise };

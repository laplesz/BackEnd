const Security = require('../models/security.model');

/**
 * @swagger
 * definitions:
 *   Security:
 *     type: object
 *     required:
 *       - fund_name
 *     properties:
 *       fund_name:
 *         type: string
 *         example: "Фонд Акцій 'Україна'"
 *       rating:
 *         type: integer
 *         example: 7
 *       profitability_for_the_previous_year:
 *         type: number
 *         format: decimal
 *         example: 18.5
 *       min_transaction_amount:
 *         type: number
 *         format: decimal
 *         example: 5000.00
 *       marketability:
 *         type: string
 *         example: "Висока"
 */

/**
 * @swagger
 * /security:
 *   get:
 *     tags:
 *       - Security
 *     summary: Отримати список усіх фондів
 *     responses:
 *       200:
 *         description: Успішна відповідь
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Security'
 */
const getSecurities = async (req, res, next) => {
    try {
        const results = await Security.getAll();
        return res.status(200).json(results);
    } catch (err) {
        return next(err);
    }
};

/**
 * @swagger
 * /security:
 *   post:
 *     tags:
 *       - Security
 *     summary: Додати новий фонд
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Об'єкт фонду
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Security'
 *     responses:
 *       201:
 *         description: Створено
 */
const addSecurity = async (req, res, next) => {
    try {
        const newSec = new Security(req.body);
        const result = await Security.create(newSec);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};
/**
 * @swagger
 * /security/{id}:
 *   delete:
 *     tags:
 *       - Security
 *     summary: Видалити фонд
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Видалено
 *       404:
 *         description: Фонд не знайдено
 */
const deleteSecurity = async (req, res, next) => {
    try {
        const affectedRows = await Security.remove(req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Фонд не знайдено' });
        }
        return res.status(200).json({ message: 'Фонд успішно видалено' });
    } catch (err) {
        return next(err);
    }
};

module.exports = { getSecurities, addSecurity, deleteSecurity };
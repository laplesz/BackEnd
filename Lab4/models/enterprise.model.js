const mongoose = require('mongoose');

const deletedLogSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    documentType: { type: String, required: true },
    deletedAt: { type: Date, default: Date.now },
});
const DeletedLog = mongoose.model('DeletedLog', deletedLogSchema);

const enterpriseSchema = new mongoose.Schema({
    enterprise_name: { type: String, required: true },
    type_of_ownership: String,
    address: String,
    tel_number: String,
});

enterpriseSchema.post('findOneAndDelete', async function logDeletedEnterprise(doc) {
    if (doc) {
        const documentId = doc.get('_id');

        await DeletedLog.create({
            documentId,
            documentType: 'Enterprise',
        });
        console.log(`Видалення документа ${documentId} збережено в логи.`);
    }
});

const Enterprise = mongoose.model('Enterprise', enterpriseSchema);

module.exports = { Enterprise, DeletedLog };

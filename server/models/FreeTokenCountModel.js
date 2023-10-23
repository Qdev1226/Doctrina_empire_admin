import mongoose from 'mongoose'

const freeTokenCountSchema = mongoose.Schema({
    count: { type: Number, required: true }
}, {
    timestamps: true
})

const FreeTokenCountModel = mongoose.models.FreeTokenCount || mongoose.model('FreeTokenCount', freeTokenCountSchema)
export default FreeTokenCountModel
import * as mongoose from "mongoose";

export const ConsumptionHistorySchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    electric_used: { type: Number, default: 0 },
    water_used: { type: Number, default: 0 },
    temperature: { type: Number, required: true },
    time_report: { type: Number, required: true },
    date_report: { type: Date, required: true, default: new Date() }
}, {
    collection: 'consumption_history',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
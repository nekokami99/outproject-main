export interface ConsumptionHistoryInterface {
    _id?: string,
    user_id: string,
    electric_used: number,
    water_used: number,
    temperature: number,
    time_report: Number,
    date_report: Date,
    created_at: Date,
    updated_at: Date
}
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConsumptionHistoryInterface } from "src/interfaces/consumption-history.interface";
import * as moment from "moment";
import * as mongoose from "mongoose";

@Injectable()
export class ConsumptionHistoryRepo {
    constructor(
        @InjectModel('consumption_history') private readonly consumptionHistoryModel: Model<ConsumptionHistoryInterface>
    ) { }

    async getByUserId(user_id: string, date_type: string) {
        let result: any;

        let consumption_histories: ConsumptionHistoryInterface[] = await this.consumptionHistoryModel.find({ user_id }).sort('created_at');

        switch (date_type) {
            case 'normal': {
                result = [...JSON.parse(JSON.stringify(consumption_histories))];
                break;
            }
            case 'today': {
                result = {
                    electric_used: {
                        total: 0,
                        hours: [
                            {
                                hour_title: 1,
                                hour: 0,
                                total: 0
                            },
                            {
                                hour_title: 2,
                                hour: 4,
                                total: 0
                            },
                            {
                                hour_title: 3,
                                hour: 8,
                                total: 0
                            },
                            {
                                hour_title: 4,
                                hour: 12,
                                total: 0
                            },
                            {
                                hour_title: 5,
                                hour: 16,
                                total: 0
                            },
                            {
                                hour_title: 6,
                                hour: 20,
                                total: 0
                            }
                        ]
                    },
                    water_used: {
                        total: 0,
                        hours: [
                            {
                                hour_title: 1,
                                hour: 0,
                                total: 0
                            },
                            {
                                hour_title: 2,
                                hour: 4,
                                total: 0
                            },
                            {
                                hour_title: 3,
                                hour: 8,
                                total: 0
                            },
                            {
                                hour_title: 4,
                                hour: 12,
                                total: 0
                            },
                            {
                                hour_title: 5,
                                hour: 16,
                                total: 0
                            },
                            {
                                hour_title: 6,
                                hour: 20,
                                total: 0
                            }
                        ]
                    },
                    temperature: {
                        number_report: 0,
                        total: 0,
                        hours: [
                            {
                                hour_title: 1,
                                hour: 0,
                                total: 0,
                                number_report: 0
                            },
                            {
                                hour_title: 2,
                                hour: 4,
                                total: 0,
                                number_report: 0
                            },
                            {
                                hour_title: 3,
                                hour: 8,
                                total: 0,
                                number_report: 0
                            },
                            {
                                hour_title: 4,
                                hour: 12,
                                total: 0,
                                number_report: 0
                            },
                            {
                                hour_title: 5,
                                hour: 16,
                                total: 0,
                                number_report: 0
                            },
                            {
                                hour_title: 6,
                                hour: 20,
                                total: 0,
                                number_report: 0
                            }
                        ]
                    }
                };

                JSON.parse(JSON.stringify(consumption_histories)).forEach(consumption_history => {
                    let hour_title = 0;
                    switch (consumption_history.time_report) {
                        case 0: {
                            hour_title = 1;
                            break;
                        }
                        case 4: {
                            hour_title = 2;
                            break;
                        }
                        case 8: {
                            hour_title = 3;
                            break;
                        }
                        case 12: {
                            hour_title = 4;
                            break;
                        }
                        case 16: {
                            hour_title = 5;
                            break;
                        }
                        case 20: {
                            hour_title = 6;
                            break;
                        }
                    }
                    if (moment().format('DD/MM/YYYY') == moment(consumption_history.date_report).format('DD/MM/YYYY')) {
                        //Calculate total electric_used
                        result.electric_used.total += consumption_history.electric_used;

                        //Calculate total electric_used by hour
                        let result_electric_used_index = result.electric_used.hours.findIndex(hour_data => hour_data.hour_title == hour_title);
                        if (result_electric_used_index > -1) {
                            result.electric_used.hours[result_electric_used_index].total += consumption_history.electric_used;
                        }
                        else {

                            result.electric_used.hours.push({
                                hour_title,
                                hour: consumption_history.time_report,
                                total: consumption_history.electric_used
                            })
                        }

                        //Calculate total water_used
                        result.water_used.total += consumption_history.water_used;

                        //Calculate total water_used by hour
                        let result_water_used_index = result.water_used.hours.findIndex(hour_data => hour_data.hour_title == hour_title);
                        if (result_water_used_index > -1) {
                            result.water_used.hours[result_water_used_index].total += consumption_history.water_used;
                        }
                        else {

                            result.water_used.hours.push({
                                hour_title,
                                hour: consumption_history.time_report,
                                total: consumption_history.water_used
                            })
                        }

                        //Calculate total temperature
                        result.temperature.total += consumption_history.temperature;
                        result.temperature.number_report++;

                        //Calculate total temperature by hour
                        let result_temperature_index = result.temperature.hours.findIndex(hour_data => hour_data.hour_title == hour_title);
                        if (result_temperature_index > -1) {
                            result.temperature.hours[result_temperature_index].total += consumption_history.temperature;
                            result.temperature.hours[result_temperature_index].number_report++;
                        }
                        else {

                            result.temperature.hours.push({
                                hour_title,
                                hour: consumption_history.time_report,
                                total: consumption_history.temperature,
                                numer_report: 1
                            })
                        }
                    }
                })

                //Handle temp data
                if (result?.temperature?.total) {
                    if (result?.temperature?.number_report) {
                        result.temperature.total = Math.round(result.temperature.total/result.temperature.number_report);
                        delete result.temperature.number_report;
                    }
                }
                result.temperature.hours = result.temperature.hours.map(temperature_data => {
                    if (temperature_data?.number_report) {
                        temperature_data.total = (temperature_data.total/temperature_data.number_report);
                        delete temperature_data.number_report;
                    }
                    return temperature_data;
                })
                
                break;
            }
            case 'yesterday': {
                result = {
                    electric_used: {
                        total: 0,
                        hours: [
                            {
                                hour_title: 1,
                                hour: 0,
                                total: 0
                            },
                            {
                                hour_title: 2,
                                hour: 4,
                                total: 0
                            },
                            {
                                hour_title: 3,
                                hour: 8,
                                total: 0
                            },
                            {
                                hour_title: 4,
                                hour: 12,
                                total: 0
                            },
                            {
                                hour_title: 5,
                                hour: 16,
                                total: 0
                            },
                            {
                                hour_title: 6,
                                hour: 20,
                                total: 0
                            }
                        ]
                    },
                    water_used: {
                        total: 0,
                        hours: [
                            {
                                hour_title: 1,
                                hour: 0,
                                total: 0
                            },
                            {
                                hour_title: 2,
                                hour: 4,
                                total: 0
                            },
                            {
                                hour_title: 3,
                                hour: 8,
                                total: 0
                            },
                            {
                                hour_title: 4,
                                hour: 12,
                                total: 0
                            },
                            {
                                hour_title: 5,
                                hour: 16,
                                total: 0
                            },
                            {
                                hour_title: 6,
                                hour: 20,
                                total: 0
                            }
                        ]
                    },
                    temperature: {
                        number_report: 0,
                        total: 0,
                        hours: [
                            {
                                hour_title: 1,
                                hour: 0,
                                total: 0,
                                number_report: 0
                            },
                            {
                                hour_title: 2,
                                hour: 4,
                                total: 0,
                                number_report: 0
                            },
                            {
                                hour_title: 3,
                                hour: 8,
                                total: 0,
                                number_report: 0
                            },
                            {
                                hour_title: 4,
                                hour: 12,
                                total: 0,
                                number_report: 0
                            },
                            {
                                hour_title: 5,
                                hour: 16,
                                total: 0,
                                number_report: 0
                            },
                            {
                                hour_title: 6,
                                hour: 20,
                                total: 0,
                                number_report: 0
                            }
                        ]
                    }
                };

                JSON.parse(JSON.stringify(consumption_histories)).forEach(consumption_history => {
                    let hour_title = 0;
                    switch (consumption_history.time_report) {
                        case 0: {
                            hour_title = 1;
                            break;
                        }
                        case 4: {
                            hour_title = 2;
                            break;
                        }
                        case 8: {
                            hour_title = 3;
                            break;
                        }
                        case 12: {
                            hour_title = 4;
                            break;
                        }
                        case 16: {
                            hour_title = 5;
                            break;
                        }
                        case 20: {
                            hour_title = 6;
                            break;
                        }
                    }
                    if (moment().subtract(1, 'day').format('DD/MM/YYYY') == moment(consumption_history.date_report).format('DD/MM/YYYY')) {
                        //Calculate total electric_used
                        result.electric_used.total += consumption_history.electric_used;

                        //Calculate total electric_used by hour
                        let result_electric_used_index = result.electric_used.hours.findIndex(hour_data => hour_data.hour_title == hour_title);
                        if (result_electric_used_index > -1) {
                            result.electric_used.hours[result_electric_used_index].total += consumption_history.electric_used;
                        }
                        else {

                            result.electric_used.hours.push({
                                hour_title,
                                hour: consumption_history.time_report,
                                total: consumption_history.electric_used
                            })
                        }

                        //Calculate total water_used
                        result.water_used.total += consumption_history.water_used;

                        //Calculate total water_used by hour
                        let result_water_used_index = result.water_used.hours.findIndex(hour_data => hour_data.hour_title == hour_title);
                        if (result_water_used_index > -1) {
                            result.water_used.hours[result_water_used_index].total += consumption_history.water_used;
                        }
                        else {

                            result.water_used.hours.push({
                                hour_title,
                                hour: consumption_history.time_report,
                                total: consumption_history.water_used
                            })
                        }

                        //Calculate total temperature
                        result.temperature.total += consumption_history.temperature;
                        result.temperature.number_report++;

                        //Calculate total temperature by hour
                        let result_temperature_index = result.temperature.hours.findIndex(hour_data => hour_data.hour_title == hour_title);
                        if (result_temperature_index > -1) {
                            result.temperature.hours[result_temperature_index].total += consumption_history.temperature;
                            result.temperature.hours[result_temperature_index].number_report++;
                        }
                        else {

                            result.temperature.hours.push({
                                hour_title,
                                hour: consumption_history.time_report,
                                total: consumption_history.temperature,
                                numer_report: 1
                            })
                        }
                    }
                })

                //Handle temp data
                if (result?.temperature?.total) {
                    if (result?.temperature?.number_report) {
                        result.temperature.total = Math.round(result.temperature.total/result.temperature.number_report);
                        delete result.temperature.number_report;
                    }
                }
                result.temperature.hours = result.temperature.hours.map(temperature_data => {
                    if (temperature_data?.number_report) {
                        temperature_data.total = (temperature_data.total/temperature_data.number_report);
                        delete temperature_data.number_report;
                    }
                    return temperature_data;
                })

                break;
            }
            case 'day': {
                result = [];

                JSON.parse(JSON.stringify(consumption_histories)).map(consumption_history => {
                    let resultIndex = result.findIndex(data => data.date_report == moment(consumption_history.date_report).format('DD.MM.YYYY'));
                    if (resultIndex > -1) {
                        result[resultIndex].number_report++;
                        result[resultIndex].electric_used += consumption_history.electric_used;
                        result[resultIndex].water_used += consumption_history.water_used;
                        result[resultIndex].temperature += consumption_history.temperature;
                    }
                    else {
                        result.push({
                            ...consumption_history,
                            number_report: 1,
                            date_report: moment(consumption_history.date_report).format('DD.MM.YYYY')
                        })
                    }
                })

                result = result.map(data => {
                    data.temperature = Math.round(data.temperature / data.number_report);
                    delete data.time_report;
                    delete data.number_report;
                    delete data._id;
                    delete data.user_id;
                    delete data.__v;
                    delete data.created_at;
                    delete data.updated_at;
                    return data;
                })
                break;
            }
            case 'month': {
                result = [];

                JSON.parse(JSON.stringify(consumption_histories)).map(consumption_history => {
                    let resultIndex = result.findIndex(data => data.date_report == moment(consumption_history.date_report).format('MM.YYYY'));
                    if (resultIndex > -1) {
                        result[resultIndex].number_report++;
                        result[resultIndex].electric_used += consumption_history.electric_used;
                        result[resultIndex].water_used += consumption_history.water_used;
                        result[resultIndex].temperature += consumption_history.temperature;
                    }
                    else {
                        result.push({
                            ...consumption_history,
                            number_report: 1,
                            date_report: moment(consumption_history.date_report).format('MM.YYYY')
                        })
                    }
                })

                result = result.map(data => {
                    data.temperature = Math.round(data.temperature / data.number_report);
                    delete data.time_report;
                    delete data.number_report;
                    delete data._id;
                    delete data.user_id;
                    delete data.__v;
                    delete data.created_at;
                    delete data.updated_at;
                    return data;
                })

                break;
            }
        }

        return result;
    }

    async insertMany(insertDatas: ConsumptionHistoryInterface[]): Promise<ConsumptionHistoryInterface[]> {
        return this.consumptionHistoryModel.insertMany(insertDatas);
    }

    async updateById(id: string, updateData: any): Promise<ConsumptionHistoryInterface> {
        return this.consumptionHistoryModel.findByIdAndUpdate(id, updateData, { returnOriginal: false });
    }

    async deleteByIds(ids: string[]): Promise<any> {
        return this.consumptionHistoryModel.deleteMany({ _id: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) } });
    }
}
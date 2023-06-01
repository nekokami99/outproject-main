import { HttpStatus, Injectable } from "@nestjs/common";
import { DeleteConsumptionHistoryDto, InsertManyConsumptionHistoryDto, UpdateConsumptionHistoryDto } from "src/dtos/api.dto";
import { ConsumptionHistoryInterface } from "src/interfaces/consumption-history.interface";
import { ConsumptionHistoryRepo } from "src/repositories/consumption-history.repository";

@Injectable()
export class ConsumptionHistoryService {
    constructor(
        private readonly consumptionHistoryRepo: ConsumptionHistoryRepo
    ) {}

    async getByUserId(user_id: string, date_type: string) {
        try {
            const result = await this.consumptionHistoryRepo.getByUserId(user_id, date_type);

            return {
                status: HttpStatus.OK,
                message: 'Get consumption history success',
                data: result
            }
        }
        catch(e) {
            console.log('GetConsumptionHistoryByUserId Err === ', e);
            
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong, please try again',
                data: null,
                system_message: e.message
            }
        }
    }

    async insertManyByUserId(user_id: string, payload: InsertManyConsumptionHistoryDto[]) {
        try {
            let result = [];

            let offset = 0;
            let tmp_limit = 10;
            const limit = 10;

            while (offset < payload.length) {
                const insertDatas_consumptionHistory: ConsumptionHistoryInterface[] = [];

                for (let data of payload.slice(offset, tmp_limit)) {
                    let insertData_consumptionHistory: ConsumptionHistoryInterface;
                    insertDatas_consumptionHistory.push({
                        ...insertData_consumptionHistory,
                        ...data,
                        user_id,
                        date_report: new Date(data.date_report)
                    });
                }

                let tmp_result = await this.consumptionHistoryRepo.insertMany(insertDatas_consumptionHistory);
                if (tmp_result?.length > 0) result = [...result, ...JSON.parse(JSON.stringify(tmp_result))];

                offset += limit;
                tmp_limit += limit;
            }

            return {
                status: HttpStatus.OK,
                message: 'InsertMany consumption history success',
                data: result
            }
        }
        catch(e) {
            console.log('InsertManyByUserId Err === ', e);
            
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong, please try again',
                data: null,
                system_message: e.message
            }
        }
    }

    async updateById(id: string, payload: UpdateConsumptionHistoryDto) {
        try {
            let consumption_history = await this.consumptionHistoryRepo.updateById(id, payload);

            return {
                status: HttpStatus.OK,
                message: 'Update consumption history success',
                data: consumption_history
            }

        }
        catch(e) {
            console.log('UpdateConsumptionHistoryById Err === ', e);

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong, please try again',
                data: null,
                system_message: e.message
            }
        }
    }

    async deleteByIds(payload: DeleteConsumptionHistoryDto) {
        try {
            let deletedCount = 0;

            let offset = 0;
            let tmp_limit = 10;
            const limit = 10;
            
            while(offset < payload.ids.length) {
                let delete_result = await this.consumptionHistoryRepo.deleteByIds(payload.ids.slice(offset, limit));

                if (delete_result?.deletedCount) deletedCount += delete_result.deletedCount;

                offset += limit;
                tmp_limit += limit;
            }

            return {
                status: deletedCount > 0 ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
                message: deletedCount > 0 ? 'Delete consumption histories success' : 'Delete consumption histories fail',
                data: null
            }

        }
        catch(e) {
            console.log('DeleteConsumptionHistoryById Err === ', e);

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong, please try again',
                data: null,
                system_message: e.message
            }
        }
    }
}
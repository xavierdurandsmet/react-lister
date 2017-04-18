import * as mongoose from "mongoose";

export interface VehicleInterface extends mongoose.Document {
    vinNumber: string,
    make: string,
    name: string,
    year: number,
    type: string,
    style: string,
    options: [string],
    colorName: string,
    colorValue: string,
    interiorColor: string,
    mileage: number,
    details: [string],
    condition: string,
    otherInfo: string,
    ownerID: string,
    zipCode: number
};

export const VehicleSchema = new mongoose.Schema({
    vinNumber: {type:String, required: true},
    make: {type:String, required: true},
    name: {type:String, required: true},
    year: {type:Number, required: true},
    type: {type:String, required: true},
    style: {type:String, required: true},
    options: [{type:String, required: true}],
    colorName: {type:String, required: true},
    colorValue: {type:String, required: true},
    interiorColor: {type:String, required: true},
    mileage: {type:Number, required: true},
    details: [{type:String, required: true}],
    condition: {type:String, required: false},
    otherInfo: {type:String, required: false},
    ownerID: {type: String, required: true},
    zipCode: {type: Number, required: true}
});

export const Vehicle = mongoose.model<VehicleInterface>('Vehicle', VehicleSchema);
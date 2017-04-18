import * as mongoose from "mongoose";

export interface ZipCodeInterface extends mongoose.Document {
    zip: number,
    state: string,
    city: string,
    lat: number,
    lng: number
};

export const ZipCodeSchema = new mongoose.Schema({
    zip: {type:Number, required: true},
    state: {type:String, required: true},
    city: {type:String, required: true},
    lat: {type:Number, required: true},
    lng: {type:Number, required: true}
});

const ZipCode = mongoose.model<ZipCodeInterface>('ZipCode', ZipCodeSchema);

export function autoHubAvailableInZipCode(zip: number, completion:{(available: Boolean):void}) {
    
    ZipCode.findOne({ zip : zip}, (_, zip)  => {
        ZipCode.findOne({ zip : 94103}, (_, sfZip)  => {
            if (zip && sfZip) {
                let zipDistance = getDistanceFromLatLonInKm(sfZip.lat, sfZip.lng, zip.lat, zip.lng)
                completion(zipDistance < 100)
            } else {
                completion(false);
            }
        });
    });
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; 
    var dLat = deg2rad(lat2-lat1); 
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}
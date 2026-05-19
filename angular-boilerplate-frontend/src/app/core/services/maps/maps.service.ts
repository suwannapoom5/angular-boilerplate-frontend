import { Injectable } from "@angular/core";
import * as L from "leaflet";

declare const EXIF: any;

@Injectable({
    providedIn: "root",
})
export class MapsService {

    constructor() {

    }

    getLatLngOnMetaData(file: File): Promise<L.LatLng | null> {
        return new Promise((resolve, reject) => {
            EXIF.getData(file, () => {
                let lat = EXIF.getTag(file, "GPSLatitude");
                let latRef = EXIF.getTag(file, "GPSLatitudeRef");
                let lon = EXIF.getTag(file, "GPSLongitude");
                let lonRef = EXIF.getTag(file, "GPSLongitudeRef");

                if (lat !== undefined && lon !== undefined) {
                    let latitude = this.convertFileCoorToLatLng(lat, latRef);
                    let longitude = this.convertFileCoorToLatLng(lon, lonRef);
                    let gpsData: L.LatLng = L.latLng(latitude, longitude);

                    resolve(gpsData);
                } else {
                    resolve(null);
                }
            });
        });
    }

    private convertFileCoorToLatLng(
        gpsData: number[],
        direction: string
    ): number {
        let coor = gpsData[0] + gpsData[1] / 60 + gpsData[2] / 3600;
        return direction === "S" || direction === "W" ? -coor : coor;
    }

    measureDistance(distance: number, measure_unit: 'imperial' | 'kilometers' | 'hectare' | 'th'): string {
        let unit: string;
        let convertedDistance: number;

        switch (measure_unit) {
            case "imperial": // Imperial units
                const feet = distance / 0.3048;
                if (feet > 3000) {
                    convertedDistance = distance / 1609.344;
                    unit = "ไมล์";
                } else {
                    convertedDistance = feet;
                    unit = "ฟุต";
                }
                break;

            case "kilometers": // Kilometers
                convertedDistance = distance / 1000;
                unit = "กม.";
                break;

            case "th": // Thai units
                convertedDistance = distance / 2;
                unit = "วา";
                break;

            default: // Default to meters
                convertedDistance = distance;
                unit = "ม.";
                break;
        }

        return this.formatMeasurement(convertedDistance, unit);
    }

    measureArea(area: number, measure_unit: 'imperial' | 'kilometers' | 'hectare' | 'th'): string {
        let unit: string;
        let convertedArea: number;

        switch (measure_unit) {
            case "imperial": // Imperial units
                if (area > 404.685642) {
                    convertedArea = area / 4046.85642;
                    unit = "เอเคอร์​";
                } else {
                    convertedArea = area / 0.09290304;
                    unit = "ตร.ฟุต";
                }
                break;

            case "kilometers": // Square kilometers
                convertedArea = area / 1e6;
                unit = "ตร.กม.";
                break;

            case "hectare": // Hectares
                convertedArea = area / 10000;
                unit = "เฮกตาร์";
                break;

            case "th": // Thai units
                return this.calculateThaiArea(area);

            default: // Default to square meters
                convertedArea = area;
                unit = "ตร.ม.";
                break;
        }

        return this.formatMeasurement(convertedArea, unit);
    }

    private calculateThaiArea(area: number): string {
        let rai = Math.floor(area / 1600);
        let rem = area % 1600;

        let ngn = Math.floor(rem / 400);
        let wa = (rem % 400) / 4;

        return `${rai.toLocaleString("en")} ไร่ ${ngn.toLocaleString(
            "en"
        )} งาน ${wa.toFixed(1)} ตารางวา`;
    }

    private formatMeasurement(value: number, unit: string): string {
        let formattedValue =
            value < 100
                ? parseFloat(value.toFixed(4)).toLocaleString("en")
                : parseFloat(Math.round(value).toFixed(4)).toLocaleString("en");
        return `${formattedValue} ${unit}`;
    }


}
export class Disclose {

    what: string;
    how: string;
    when: string;
    where_street: string;
    where_locality: string;
    where_city: string;
    where_province: string;
    where_lat: string;
    where_lon: string;

    getData() {
        let discloseData = '{"title": "'+this.what+'","body":{"und":[{"value":"'+this.how+'"';
        discloseData += '}]},"field_incident_location":{"und":[{"thoroughfare":"'+this.where_street+'",';
        discloseData += '"dependent_locality":"'+this.where_locality+'","locality":"'+this.where_city+'","administrative_area":"'+this.where_province+'"}]},';
        discloseData += '"field_location":{"und":[{"geom":{"lat":"'+this.where_lat+'","lon":"'+this.where_lon+'"}}]}}';

        console.log(discloseData);
        return JSON.parse(discloseData);

    }

}


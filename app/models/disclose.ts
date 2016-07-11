export class Disclose {

    what: string;
    how: string;
    when: string;
    when_date: string;
    when_time: string;
    where_premise: string;
    where_street: string;
    where_locality: string;
    where_city: string;
    where_province: string;
    where_lat: number;
    where_lon: number;

    getData() {
        if(!this.when) {
            let currentDate = new Date();
            this.when = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString();
        }
        let discloseDate = new Date(this.when);
        this.when_date = (discloseDate.getUTCMonth()+1)+"/"+discloseDate.getUTCDate()+"/"+discloseDate.getUTCFullYear();
        this.when_time = discloseDate.getUTCHours()+":"+discloseDate.getUTCMinutes();

        let discloseData =
            {
                "title": this.what,
                "field_incident_date": {
                    "und": [
                        {"value": {
                            "date": this.when_date,
                            "time": this.when_time
                        }}
                    ]
                },
                "body": {
                    "und": [
                        { "value": this.how }
                    ]
                },
                "field_incident_location": {
                    "und": [
                        {
                            "premise": this.where_premise,
                            "thoroughfare": this.where_street,
                            "dependent_locality": this.where_locality,
                            "locality": this.where_city,
                            "administrative_area": this.where_province
                        }
                    ]
                },
                "field_location": {
                    "und": [
                        {
                            "geom": {
                                "lat": this.where_lat,
                                "lon": this.where_lon
                            }
                        }
                    ]
                }
            };

        console.log(discloseData);
        return discloseData;

    }

}


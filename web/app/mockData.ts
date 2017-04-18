export const mockCarsList = [
    {
        vinNumber: 'vin1236',
        make: 'Bugatti',
        name: 'Xmotor2016',
        year: 2016,
        type: 'convertible',
        style: 'stylish',
        options: ['gps', 'AC'],
        colorName: 'blue',
        colorValue: '123',
        interiorColor: 'blue',
        mileage: 1000,
        details: ['beautiful inside', 'beautiful outside'],
        condition: 'as new',
        otherInfo: 'not much',
        ownerID: 'xhd92',
        zipCode: 94132,
        image: 'http://blog.caranddriver.com/wp-content/uploads/2015/11/BMW-2-series.jpg',
        description: 'Is very nice',
        // to test distance filter
        distance: 10,
        // to test list of cars
        price: 50000
    },
    {
        vinNumber: 'vin1234',
        make: 'Maserati',
        name: 'Xmotor2016',
        year: 2015,
        type: 'minivan',
        style: 'stylish',
        options: ['gps', 'AC'],
        colorName: 'blue',
        colorValue: '123',
        interiorColor: 'blue',
        mileage: 500,
        details: ['beautiful inside', 'beautiful outside'],
        condition: 'as new',
        otherInfo: 'not much',
        ownerID: 'xhd92',
        zipCode: 94132,
        image: 'https://www.enterprise.com/content/dam/global-vehicle-images/cars/TOYO_RAV4_2014.png',
        description: 'Is very nice',
        distance: 500,
        price: 3000
    },
    {
        vinNumber: 'vin1235',
        make: 'Ferrari',
        name: 'Xmotor2016',
        year: 2014,
        type: 'van',
        style: 'stylish',
        options: ['gps', 'AC'],
        colorName: 'blue',
        colorValue: '123',
        interiorColor: 'blue',
        mileage: 10,
        details: ['beautiful inside', 'beautiful outside'],
        condition: 'as new',
        otherInfo: 'not much',
        ownerID: 'xhd923',
        zipCode: 94132,
        image: 'https://www.enterprise.com/content/dam/global-vehicle-images/cars/FORD_FOCU_2012-1.png',
        description: 'Is very nice',
        distance: 1000,
        price: 54500
    }];

export const carTypes = [
    "CONVERTIBLE",
    "COUPE",
    "HATCHBACK",
    "MINIVAN",
    "PICK UP",
    "SEDAN",
    "SUV",
    "VAN"
]

export const currentYear = 2016;

// to use later
// <Filter currentInput={this.state.currentQuery} filterCars={this.filterCars} updateQuery={this.updateQuery} />

    // filterCars(e: any) {
    //     e.preventDefault();
    //     this.setState(
    //         {cars: this.cars.filter(this.match),
    //             currentQuery: e.target.value} as AdvancedFiltersState
    //     )
    // }

    // updateQuery(e: any) {
    //     this.setState(
    //         {currentQuery: e.target.value} as AdvancedFiltersState //casting necessary to change only one field on state in typescript
    //     )
    // }

    // match(car: {carTitle: string, image: string}) {
    //     return (car.carTitle == this.state.currentQuery) || (this.state.currentQuery === '');
    // }

// <h5 style={titleStyle}> <Glyphicon glyph="eye-open" /> My Watchlists </h5>    
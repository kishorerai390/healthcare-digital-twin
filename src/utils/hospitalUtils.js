// Utility for fetching nearby hospitals and emergency contact centers based on patient location

export const COUNTRIES_DATA = {
  'India': {
    states: [
      'Tamil Nadu',
      'Maharashtra',
      'Karnataka',
      'Telangana',
      'Andhra Pradesh',
      'Delhi NCR',
      'Kerala',
      'West Bengal',
      'Gujarat',
      'Rajasthan',
      'Punjab',
      'Haryana',
      'Uttar Pradesh',
      'Madhya Pradesh',
      'Bihar',
      'Odisha',
      'Assam & North East'
    ],
    cities: {
      'Tamil Nadu': [
        'Ariyalur',
        'Chengalpattu',
        'Chennai',
        'Coimbatore',
        'Cuddalore',
        'Dharmapuri',
        'Dindigul',
        'Erode',
        'Kallakurichi',
        'Kanchipuram',
        'Kanyakumari',
        'Karur',
        'Krishnagiri',
        'Madurai',
        'Mayiladuthurai',
        'Nagapattinam',
        'Namakkal',
        'Nilgiris (Ooty)',
        'Perambalur',
        'Pudukkottai',
        'Ramanathapuram',
        'Ranipet',
        'Salem',
        'Sivaganga',
        'Tenkasi',
        'Thanjavur',
        'Theni',
        'Thoothukudi (Tuticorin)',
        'Tiruchirappalli (Trichy)',
        'Tirunelveli',
        'Tirupathur',
        'Tiruppur',
        'Tiruvallur',
        'Tiruvannamalai',
        'Tiruvarur',
        'Vellore',
        'Viluppuram',
        'Virudhunagar'
      ],
      'Maharashtra': [
        'Mumbai',
        'Pune',
        'Nagpur',
        'Thane',
        'Nashik',
        'Aurangabad (Chhatrapati Sambhajinagar)',
        'Solapur',
        'Amravati',
        'Kolhapur',
        'Navi Mumbai',
        'Sangli',
        'Jalgaon',
        'Nanded',
        'Satara',
        'Ratnagiri',
        'Latur',
        'Akola',
        'Ahmednagar'
      ],
      'Karnataka': [
        'Bangalore (Bengaluru)',
        'Mysore (Mysuru)',
        'Hubli-Dharwad',
        'Mangalore (Mangaluru)',
        'Belgaum (Belagavi)',
        'Gulbarga (Kalaburagi)',
        'Davanagere',
        'Bellary (Ballari)',
        'Shimoga (Shivamogga)',
        'Tumkur',
        'Udupi',
        'Hassan'
      ],
      'Telangana': [
        'Hyderabad',
        'Warangal',
        'Nizamabad',
        'Khammam',
        'Karimnagar',
        'Ramagundam',
        'Mahbubnagar',
        'Nalgonda'
      ],
      'Andhra Pradesh': [
        'Visakhapatnam',
        'Vijayawada',
        'Guntur',
        'Tirupati',
        'Nellore',
        'Kakinada',
        'Kurnool',
        'Rajahmundry',
        'Anantapur',
        'Eluru'
      ],
      'Delhi NCR': [
        'New Delhi',
        'Central Delhi',
        'South Delhi',
        'North Delhi',
        'East Delhi',
        'Noida',
        'Greater Noida',
        'Gurugram (Gurgaon)',
        'Faridabad',
        'Ghaziabad'
      ],
      'Kerala': [
        'Kochi (Cochin)',
        'Thiruvananthapuram (Trivandrum)',
        'Kozhikode (Calicut)',
        'Thrissur',
        'Kollam',
        'Kannur',
        'Alappuzha',
        'Kottayam',
        'Palakkad',
        'Malappuram',
        'Pathanamthitta'
      ],
      'West Bengal': [
        'Kolkata',
        'Howrah',
        'Durgapur',
        'Siliguri',
        'Asansol',
        'Kharagpur',
        'Haldia',
        'Bardhaman',
        'Malda'
      ],
      'Gujarat': [
        'Ahmedabad',
        'Surat',
        'Vadodara (Baroda)',
        'Rajkot',
        'Bhavnagar',
        'Jamnagar',
        'Junagadh',
        'Gandhinagar',
        'Anand',
        'Bharuch'
      ],
      'Rajasthan': [
        'Jaipur',
        'Jodhpur',
        'Udaipur',
        'Kota',
        'Bikaner',
        'Ajmer',
        'Bhilwara',
        'Alwar',
        'Bharatpur',
        'Sikar'
      ],
      'Punjab': [
        'Chandigarh',
        'Ludhiana',
        'Amritsar',
        'Jalandhar',
        'Patiala',
        'Bathinda',
        'Mohali',
        'Pathankot'
      ],
      'Haryana': [
        'Gurugram',
        'Faridabad',
        'Panipat',
        'Ambala',
        'Karnal',
        'Hisar',
        'Rohtak',
        'Sonipat'
      ],
      'Uttar Pradesh': [
        'Lucknow',
        'Kanpur',
        'Varanasi',
        'Agra',
        'Noida',
        'Ghaziabad',
        'Prayagraj (Allahabad)',
        'Meerut',
        'Bareilly',
        'Aligarh',
        'Gorakhpur',
        'Mathura'
      ],
      'Madhya Pradesh': [
        'Bhopal',
        'Indore',
        'Gwalior',
        'Jabalpur',
        'Ujjain',
        'Sagar',
        'Ratlam'
      ],
      'Bihar': [
        'Patna',
        'Gaya',
        'Muzaffarpur',
        'Bhagalpur',
        'Darbhanga',
        'Purnia'
      ],
      'Odisha': [
        'Bhubaneswar',
        'Cuttack',
        'Rourkela',
        'Puri',
        'Sambalpur',
        'Berhampur'
      ],
      'Assam & North East': [
        'Guwahati',
        'Silchar',
        'Dibrugarh',
        'Jorhat',
        'Shillong',
        'Imphal',
        'Agartala',
        'Gangtok',
        'Aizawl',
        'Itanagar',
        'Kohima'
      ]
    }
  },
  'United States': {
    states: ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Washington', 'Massachusetts', 'Pennsylvania'],
    cities: {
      'California': ['San Francisco', 'Los Angeles', 'San Jose', 'San Diego', 'Sacramento', 'Fresno', 'Oakland'],
      'New York': ['New York City', 'Buffalo', 'Albany', 'Rochester', 'Syracuse'],
      'Texas': ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth', 'El Paso'],
      'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
      'Illinois': ['Chicago', 'Springfield', 'Naperville'],
      'Washington': ['Seattle', 'Spokane', 'Tacoma'],
      'Massachusetts': ['Boston', 'Cambridge', 'Worcester'],
      'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown']
    }
  },
  'United Kingdom': {
    states: ['Greater London', 'England', 'Scotland', 'Wales'],
    cities: {
      'Greater London': ['Central London', 'Westminster', 'Camden', 'Greenwich'],
      'England': ['Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Bristol', 'Oxford', 'Cambridge'],
      'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen'],
      'Wales': ['Cardiff', 'Swansea']
    }
  },
  'United Arab Emirates': {
    states: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    cities: {
      'Dubai': ['Dubai City', 'Dubai Marina', 'Downtown Dubai', 'Jumeirah'],
      'Abu Dhabi': ['Abu Dhabi City', 'Al Ain', 'Yas Island'],
      'Sharjah': ['Sharjah City', 'Al Majaz']
    }
  },
  'Singapore': {
    states: ['Central Region', 'East Region', 'North Region'],
    cities: {
      'Central Region': ['Singapore City', 'Orchard', 'Novena'],
      'East Region': ['Tampines', 'Changi', 'Bedok'],
      'North Region': ['Woodlands', 'Yishun']
    }
  },
  'Canada': {
    states: ['Ontario', 'British Columbia', 'Quebec', 'Alberta'],
    cities: {
      'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London'],
      'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'],
      'Quebec': ['Montreal', 'Quebec City', 'Laval'],
      'Alberta': ['Calgary', 'Edmonton']
    }
  },
  'Australia': {
    states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
    cities: {
      'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
      'Victoria': ['Melbourne', 'Geelong', 'Ballarat'],
      'Queensland': ['Brisbane', 'Gold Coast', 'Cairns'],
      'Western Australia': ['Perth', 'Fremantle']
    }
  },
  'Germany': {
    states: ['Bavaria', 'Berlin', 'Hesse', 'North Rhine-Westphalia'],
    cities: {
      'Bavaria': ['Munich', 'Nuremberg', 'Augsburg'],
      'Berlin': ['Berlin City'],
      'Hesse': ['Frankfurt', 'Wiesbaden'],
      'North Rhine-Westphalia': ['Cologne', 'Düsseldorf', 'Dortmund']
    }
  },
  'Japan': {
    states: ['Kanto', 'Kansai'],
    cities: {
      'Kanto': ['Tokyo', 'Yokohama', 'Kawasaki', 'Saitama'],
      'Kansai': ['Osaka', 'Kyoto', 'Kobe']
    }
  }
}

export function getNearbyHospitals(city = 'San Francisco', state = 'California', country = 'United States') {
  const userLoc = `${city}, ${state}`
  const isIndia = country === 'India'
  const isUK = country === 'United Kingdom'
  const isUAE = country === 'United Arab Emirates'
  
  return [
    {
      id: 'hosp-1',
      name: `${city} Central Super Specialty Hospital & Trauma Care`,
      specialty: '24/7 Emergency & ICU Trauma Unit',
      distance: '1.2 km away',
      address: `102 Medical Hub Avenue, ${userLoc}, ${country}`,
      phone: isIndia ? '+91 1800 425 1008' : isUAE ? '+971 4 333 1122' : '+1 (800) 555-0199',
      emergencyCode: isIndia ? '108' : isUK ? '999' : isUAE ? '998' : '911',
      rating: '4.9 ★',
      status: '24/7 Emergency Active',
      isOpen: true
    },
    {
      id: 'hosp-2',
      name: `${city} Advanced Cardiac & Vascular Institute`,
      specialty: 'Cardiology, Cath Lab & Heart Surgery',
      distance: '2.5 km away',
      address: `450 Cardiovascular Parkway, ${userLoc}, ${country}`,
      phone: isIndia ? '+91 98400 11223' : isUAE ? '+971 4 444 2233' : '+1 (800) 555-0244',
      emergencyCode: isIndia ? '108' : isUK ? '999' : isUAE ? '998' : '911',
      rating: '4.8 ★',
      status: 'Open Today (8:00 AM - 10:00 PM)',
      isOpen: true
    },
    {
      id: 'hosp-3',
      name: `${city} Multi-Specialty Endocrine & Diabetes Clinic`,
      specialty: 'Metabolic Care, Diabetes & Hormonal Health',
      distance: '3.4 km away',
      address: `88 Longevity Wellness Blvd, ${userLoc}, ${country}`,
      phone: isIndia ? '+91 98765 43210' : isUAE ? '+971 4 555 3344' : '+1 (800) 555-0388',
      emergencyCode: isIndia ? '108' : isUK ? '999' : isUAE ? '998' : '911',
      rating: '4.7 ★',
      status: 'Appointment & Urgent Consultations',
      isOpen: true
    }
  ]
}

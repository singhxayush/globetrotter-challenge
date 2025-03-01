// dummy_data.ts

export const DummyOptions = [
  "Tokyo, Japan",
  "New York City, USA",
  "London, UK",
  "Paris, France",
  "Rome, Italy",
  "Sydney, Australia",
  "Cairo, Egypt",
  "Rio de Janeiro, Brazil",
  "Moscow, Russia",
  "Bangkok, Thailand",
  "Marrakech, Morocco",
  "Vancouver, Canada",
  "Cape Town, South Africa",
  "Buenos Aires, Argentina",
  "Berlin, Germany",
  "Seoul, South Korea",
  "Amsterdam, Netherlands",
  "San Francisco, USA",
  "Kyoto, Japan",
  "Seville, Spain",
  "Hanoi, Vietnam",
  "Jaipur, India",
  "Nairobi, Kenya",
  "Toronto, Canada",
  "Copenhagen, Denmark",
  "Prague, Czech Republic",
  "Vienna, Austria",
  "Dublin, Ireland",
  "Lisbon, Portugal",
  "Budapest, Hungary",
  "Montreal, Canada",
  "Shanghai, China",
  "Dubai, UAE",
  "Los Angeles, USA",
  "Madrid, Spain",
  "Reykjavik, Iceland",
  "Athens, Greece",
  "Jerusalem, Israel",
  "Kathmandu, Nepal",
  "Mexico City, Mexico",
  "Singapore, Singapore",
  "St. Petersburg, Russia",
  "Bogota, Colombia",
  "Johannesburg, South Africa",
  "Lima, Peru",
  "Stockholm, Sweden",
  "Melbourne, Australia",
  "Hong Kong, China",
  "Venice, Italy",
  "Kuala Lumpur, Malaysia",
  "Edinburgh, UK",
  "Auckland, New Zealand",
  "Oslo, Norway",
  "Lyon, France",
  "Florence, Italy",
  "Accra, Ghana",
  "Algiers, Algeria",
  "Amman, Jordan",
  "Ankara, Turkey",
  "Antananarivo, Madagascar",
  "Apia, Samoa",
  "Ashgabat, Turkmenistan",
  "Asmara, Eritrea",
  "Astana, Kazakhstan",
  "Baghdad, Iraq",
  "Baku, Azerbaijan",
  "Bamako, Mali",
  "Bangui, Central African Republic",
  "Banjul, Gambia",
  "Beirut, Lebanon",
  "Belgrade, Serbia",
  "Belmopan, Belize",
  "Bern, Switzerland",
  "Bishkek, Kyrgyzstan",
  "Bissau, Guinea-Bissau",
  "Bloemfontein, South Africa",
  "Brasilia, Brazil",
  "Bratislava, Slovakia",
  "Brazzaville, Republic of the Congo",
  "Brisbane, Australia",
  "Brussels, Belgium",
  "Bucharest, Romania",
  "Caracas, Venezuela",
  "Cardiff, UK",
  "Castries, Saint Lucia",
  "Chengdu, China",
  "Chiang Mai, Thailand",
  "Chisinau, Moldova",
  "Colombo, Sri Lanka",
  "Conakry, Guinea",
  "Dakar, Senegal",
  "Damascus, Syria",
  "Dar es Salaam, Tanzania",
  "Delhi, India",
  "Dhaka, Bangladesh",
  "Dili, East Timor",
  "Djibouti City, Djibouti",
  "Dodoma, Tanzania",
  "Doha, Qatar",
  "Douala, Cameroon",
  "Dresden, Germany",
  "Dushanbe, Tajikistan",
  "Freetown, Sierra Leone",
  "Gaborone, Botswana",
  "Geneva, Switzerland",
  "Glasgow, UK",
  "Guadalajara, Mexico",
  "Guatemala City, Guatemala",
  "Halifax, Canada",
  "Hamburg, Germany",
  "Harare, Zimbabwe",
  "Havana, Cuba",
  "Helsinki, Finland",
  "Ho Chi Minh City, Vietnam",
  "Islamabad, Pakistan",
  "Jakarta, Indonesia",
  "Jeddah, Saudi Arabia",
  "Kampala, Uganda",
  "Kano, Nigeria",
  "Karachi, Pakistan",
  "Khartoum, Sudan",
  "Kingston, Jamaica",
  "Kinshasa, Democratic Republic of Congo",
  "Lagos, Nigeria",
  "Lahore, Pakistan",
  "Luanda, Angola",
  "Lusaka, Zambia",
  "Luxembourg City, Luxembourg",
  "Lviv, Ukraine",
  "Managua, Nicaragua",
  "Manila, Philippines",
  "Maputo, Mozambique",
  "Marseille, France",
  "Medellin, Colombia",
  "Milan, Italy",
  "Minsk, Belarus",
  "Monaco, Monaco",
  "Montevideo, Uruguay",
  "Nassau, Bahamas",
  "New Orleans, USA",
  "Niamey, Niger",
  "Novosibirsk, Russia",
  "Nur-Sultan, Kazakhstan",
  "Panama City, Panama",
  "Perth, Australia",
  "Philadelphia, USA",
  "Phnom Penh, Cambodia",
  "Podgorica, Montenegro",
  "Port Moresby, Papua New Guinea",
  "Port of Spain, Trinidad and Tobago",
  "Porto, Portugal",
  "Quebec City, Canada",
  "Quito, Ecuador",
  "Riga, Latvia",
  "Saint John's, Antigua and Barbuda",
  "Salt Lake City, USA",
  "Salvador, Brazil",
  "San Antonio, USA",
  "San Diego, USA",
  "San Jose, Costa Rica",
  "San Juan, Puerto Rico",
  "San Salvador, El Salvador",
  "Santiago, Chile",
  "Santo Domingo, Dominican Republic",
  "Sarajevo, Bosnia and Herzegovina",
  "Seattle, USA",
  "Sofia, Bulgaria",
  "Split, Croatia",
  "Tashkent, Uzbekistan",
  "Tbilisi, Georgia",
  "Tehran, Iran",
  "Tel Aviv, Israel",
  "The Hague, Netherlands",
  "Tirana, Albania",
  "Tripoli, Libya",
  "Tunis, Tunisia",
  "Ulaanbaatar, Mongolia",
  "Valencia, Spain",
  "Vilnius, Lithuania",
  "Warsaw, Poland",
  "Wellington, New Zealand",
  "Yangon, Myanmar",
  "Yerevan, Armenia",
  "Zagreb, Croatia",
  "Zurich, Switzerland",
];

export interface CityClue {
  id: number;
  city: string;
  country: string;
  clues: string[];
  fun_facts: string[];
  trivia: string[];
}

export const cityClues: CityClue[] = [
  {
    id: 1,
    city: "Cairo",
    country: "Egypt",
    clues: [
      "This city sits near the last of the Seven Wonders of the Ancient World.",
      "You'll find the Khan el-Khalili bazaar, a maze of narrow streets and shops.",
    ],
    fun_facts: [
      "Cairo's name is derived from the Arabic 'Al-Qahira', meaning 'The Victorious'.",
      "The Cairo Tower offers a 360-degree view of the city, rivaling that of the pyramids in the distance.",
    ],
    trivia: [
      "Many residents use informal microbuses and shared taxis, a vital part of the transport system.",
      "Located near a metropolis of about 20 million inhabitants, the Cairo is the largest African and Arab metropolis.",
    ],
  },
  {
    id: 2,
    city: "Istanbul",
    country: "Turkey",
    clues: [
      "A city that straddles two continents.",
      "Once known as Constantinople.",
    ],
    fun_facts: [
      "Istanbul has been the capital of both Roman and Ottoman Empires.",
      "The Grand Bazaar has over 4,000 shops and is one of the oldest and largest covered markets in the world.",
    ],
    trivia: [
      "Tulips are native to Turkey, not the Netherlands. They were introduced to Europe via Istanbul.",
      "Istanbul is built on seven hills, like Rome.",
    ],
  },
  {
    id: 3,
    city: "Rio de Janeiro",
    country: "Brazil",
    clues: [
      "Home to Christ the Redeemer statue.",
      "Known for its vibrant Carnival celebrations and samba music.",
    ],
    fun_facts: [
      "The name 'Rio de Janeiro' means 'January River' - a misnomer by early Portuguese explorers who thought the Guanabara Bay was a river mouth.",
      "Rio's beaches, like Copacabana and Ipanema, have unique sidewalks designed by Brazilian landscape architect Roberto Burle Marx.",
    ],
    trivia: [
      "The Escadaria Selarón, a set of colorful steps, is made from tiles collected from all over the world.",
      "Brazil's financial industry is concentrated in Sao Paulo.",
    ],
  },
  {
    id: 4,
    city: "Moscow",
    country: "Russia",
    clues: [
      "Red Square is located here.",
      "Famous for its colorful domed cathedrals.",
    ],
    fun_facts: [
      "Moscow has more billionaires than any other city in the world.",
      "The Moscow Metro is not only a mode of transport but is also renowned for its opulent architecture and artwork.",
    ],
    trivia: [
      "During World War II, the Kremlin was camouflaged to look like an ordinary residential area.",
      "Moscow is often called the city of 7 hills (though this number may change with sources).",
    ],
  },
  {
    id: 5,
    city: "London",
    country: "England",
    clues: [
      "This city is home to the Prime Minister of the UK.",
      "You will find famous attractions like Buckingham Palace and the Tower of London here.",
    ],
    fun_facts: [
      "There is a 'ghost station' on the London Underground network. British Museum station closed in 1933 but there is still plenty to see from platform level. The original lift system is still working. They can still be accessed by engineering works.",
      "London receives, on average, 1556.3 hours of sunshine in one year. ",
    ],
    trivia: [
      "London Eye wasn't planned. It was an emergency construction and temporary attraction",
      "The city has several resident ghosts.",
    ],
  },
  {
    id: 6,
    city: "Rome",
    country: "Italy",
    clues: [
      "Once the capital of the Western world.",
      "Home to the famous Trevi fountain.",
    ],
    fun_facts: [
      "Around €3,000 worth of coins are thrown into the Trevi Fountain every day",
      "Cats have special status here - if a cat takes up residence in the historical ruin or square, it is permitted to stay. You will find the largest group living in Torre Argentina ruins.",
    ],
    trivia: [
      "More than half of Italy's historic sites are here.",
      "Italian cities are famous for ancient, hidden drinking fountains (the 'nasoni')",
    ],
  },
  {
    id: 7,
    city: "Berlin",
    country: "Germany",
    clues: [
      "Its landmarks include Brandenburg Gate and the Reichstag building.",
      "The TV Tower offers stunning views of the city.",
    ],
    fun_facts: [
      "More than 30,000 trees a year are planted in Berlin",
      "Berlin is nine times bigger than Paris.",
    ],
    trivia: [
      "After London, Berlin is Europes second-largest city in terms of population",
      "It is home to Europe's largest Turkish community. ",
    ],
  },
  {
    id: 8,
    city: "Beijing",
    country: "China",
    clues: [
      "Home to Tiananmen Square, the Forbidden City, and The Great Wall.",
      "It is one of the oldest continuous cultures on earth.",
    ],
    fun_facts: [
      "Beijing is considered the transportation hub of China",
      "Beijing will be the first city in history to host both Summer and Winter Olympic games.",
    ],
    trivia: [
      "Home of Peking Duck",
      "Home of The largest train station on earth, Beijing South Station. ",
    ],
  },
  {
    id: 9,
    city: "Sydney",
    country: "Australia",
    clues: [
      "The Sydney Opera House is found in this city",
      "Located in a Harbour known for its beauty.",
    ],
    fun_facts: [
      "The city is built around the worlds largest harbour, the Port Jackson Harbour. It has a surface area of 55 square kilometres. ",
      "Sydney has over 100 beaches.",
    ],
    trivia: [
      "On Sunday there can be any more that two people without licences in an Uber car.",
      "Until the 1970's it was illegal for women to wear bikinis.",
    ],
  },
  {
    id: 10,
    city: "Cape Town",
    country: "South Africa",
    clues: [
      "Also known as the Mother City.",
      "Is the first city in Southern Africa.",
    ],
    fun_facts: [
      "Once the site of the first hospital for penguins",
      "Shark spotters patrol it.",
    ],
    trivia: [
      "Apartheid was removed in 1994 but some feel the the land issue remains and the effects of discrimination lingers",
      "There are lots of public transport.",
    ],
  },
  {
    id: 11,
    city: "Amsterdam",
    country: "Netherlands",
    clues: [
      "Famous for its canals, tulip fields, and artistic heritage.",
      "Anne Frank House is located in this city.",
    ],
    fun_facts: [
      "There are more bicycles than people in Amsterdam.",
      "Amsterdam has over 1,200 bridges.",
    ],
    trivia: [
      "The city is built on wooden piles, which provide support on the marshy ground.",
      "Amsterdam's Schiphol Airport is below sea level.",
    ],
  },
  {
    id: 12,
    city: "Kyoto",
    country: "Japan",
    clues: [
      "Home to thousands of temples, shrines, and traditional gardens.",
      "Once the imperial capital of Japan.",
    ],
    fun_facts: [
      "Kyoto was spared from atomic bombing during World War II.",
      "Geishas still exist in Kyoto, primarily in the Gion district.",
    ],
    trivia: [
      "Kiyomizu-dera Temple's wooden stage is built without using a single nail.",
      "The Golden Pavilion (Kinkaku-ji) is covered in gold leaf.",
    ],
  },
  {
    id: 13,
    city: "Buenos Aires",
    country: "Argentina",
    clues: [
      "Known as the 'Paris of South America'.",
      "Famous for tango dancing.",
    ],
    fun_facts: [
      "Buenos Aires has more bookstores per capita than any other city in the world.",
      "The Obelisco is a major landmark that commemorates the city's 400th anniversary.",
    ],
    trivia: [
      "La Boca neighborhood is known for its brightly colored buildings and vibrant street art.",
      "Eva Perón (Evita) is buried in the Recoleta Cemetery.",
    ],
  },
  {
    id: 14,
    city: "Vancouver",
    country: "Canada",
    clues: [
      "Surrounded by mountains and the Pacific Ocean.",
      "Known for its outdoor activities and film industry ('Hollywood North').",
    ],
    fun_facts: [
      "Stanley Park is larger than Central Park in New York City.",
      "Vancouver has a large and vibrant Chinatown.",
    ],
    trivia: [
      "The city was originally named Gastown.",
      "Vancouver is consistently ranked as one of the most livable cities in the world.",
    ],
  },
  {
    id: 15,
    city: "Dubai",
    country: "United Arab Emirates",
    clues: [
      "Home to the Burj Khalifa, the tallest building in the world.",
      "Known for luxury shopping, modern architecture, and nightlife.",
    ],
    fun_facts: [
      "Dubai's police force uses supercars like Lamborghinis and Ferraris.",
      "The Dubai Mall is one of the largest shopping malls in the world, featuring an aquarium and ice rink.",
    ],
    trivia: [
      "Dubai Creek used to be a crucial trading route, separating the city into two main sections.",
      "The Palm Jumeirah is an artificial archipelago created from reclaimed land.",
    ],
  },
  {
    id: 16,
    city: "Seville",
    country: "Spain",
    clues: [
      "You might recognise the name - an area is name after this city, in Australia.",
      "Home of famous opera",
    ],
    fun_facts: [
      "It gets extremely hot here and because of the climate locals love bitter oranges to keep hydrated.",
      "It used to have many mosques.",
    ],
    trivia: [
      "People here wear colourful costumes.",
      "Bull-fighting still goes on.  ",
    ],
  },
  {
    id: 17,
    city: "Bangkok",
    country: "Thailand",
    clues: [
      "Here one can taste insects at roadside cafes.",
      "Often abbreviated as BKK by airlines and nicknamed, 'The City Of Angels'.",
    ],
    fun_facts: [
      "Bangkok is sinking 1 inch to 2 inches a year. Experts believe it is 5 feet below sea-level",
      "Here the taxis are vibrantly pink.",
    ],
    trivia: [
      "If your dog leaves poo on the ground there will be a fee imposed.",
      "Thai New year in mid April has world known 'Water Fight', the world is invited. ",
    ],
  },
  {
    id: 18,
    city: "Oslo",
    country: "Norway",
    clues: [
      "Named amongst one of the most expensive in the world to live.",
      "It once suffered through multiple and massive city fires.",
    ],
    fun_facts: [
      "When people use the trams/ trains, very few people are on board which adds to the serenity.",
      "Here nature thrives in parks - but some of them hide disturbing dark secrets. ",
    ],
    trivia: [
      "Every year it sends the Uk, the Trafalgar Tree during Christmas time as thanks.",
      "Once, a moose got drunk.",
    ],
  },
  {
    id: 19,
    city: "Toronto",
    country: "Canada",
    clues: [
      "Has a place know as graffiti ally where local vandals legally draw, spray etc",
      "Also knows as, Hogtown or Muddy York..",
    ],
    fun_facts: [
      "Used to be called York, it went on fire twice",
      "Locals don't say 'Toronto' , they would likely just say the T Dot! ",
    ],
    trivia: [
      "If you find an empty chair it could mean some ones already bagged a spot",
      "More people born here from than any where else!",
    ],
  },
  {
    id: 20,
    city: "Singapore",
    country: "Singapore",
    clues: [
      "Famous for chewing-gum ban",
      "In this country you will find lots of unusual food- from brains, eyes, feet- you name it.",
    ],
    fun_facts: [
      "Merlions feature with their faces everywhere (this is to lure tourist with the famous water dragon like character.)",
      "High amount of laws. Most people wouldn't consider chewing gum offensive!",
    ],
    trivia: [
      "There's actually is not natural resources there.",
      "Considered an easy to clean- city. (If your clean freak you'll enjoy the order.",
    ],
  },
  {
    id: 21,
    city: "San Francisco",
    country: "USA",
    clues: [
      "The golden city on the USA Pacific, once gold has struck!",
      "The highest numbers of sea fog during any calendar.",
    ],
    fun_facts: [
      "13 million loaves of sour-dough eaten in San Fran every year..",
      "You can easily use your hand/ body when measuring distances. ",
    ],
    trivia: [
      "This golden spot has suffered its biggest fire that ripped through. ",
      "There is an upside down House.",
    ],
  },
  {
    id: 22,
    city: "Stockholm",
    country: "Sweden",
    clues: [
      "Nobel prize originated in Sweden - and the winners from different countries often travel here.",
      "Home to famous actor like, Alexander Skarsgård.",
    ],
    fun_facts: [
      "The city built across several islands is made of lots of old and colorful historical structures - but that is a front cover. A concrete city of a modern generation stands beneath its feets",
      "Many homeless from europe comes to Stockholm due to the high amount social well fair state",
    ],
    trivia: [
      "Every summer locals enjoy a large 1 week of parties ",
      "You could go naked to any beach and they are tolerant- nudist friendly.. ",
    ],
  },
  {
    id: 23,
    city: "Johannesburg",
    country: "South Africa",
    clues: [
      "Gold found around here lead to great expansion ",
      "Considered the diamond hub with world-high deposits",
    ],
    fun_facts: [
      "Here one should consider the risks when choosing a rental apartment due to possible burglary",
      "During Apartheid non whites not allowed without permission..",
    ],
    trivia: [
      "Used to have a zoo located on a private farm land - now there lies properties and housing estates. The remains are buried and can found hidden with local help only!",
      "Has its fair-share and long lived battles with criminal elements and a highly unsafe",
    ],
  },

  {
    id: 24,
    city: "Kathmandu",
    country: "Nepal",
    clues: [
      "It is said by a divine messenger of love.",
      "This land has very-high mountains, which the highest on planet, resides inside. ",
    ],
    fun_facts: [
      "Home of Living Goddesses: The country celebrates this for the local well being, as it gives power.",
      "Yeti man once said exist.",
    ],
    trivia: [
      "Traffic control-wise: not orderly!",
      "Kathmandu once believed in snakes protecting it, rather then modern methods.",
    ],
  },
  {
    id: 25,
    city: "Ho Chi Minh City",
    country: "Vietnam",
    clues: [
      "Was famous by its previous namesake before modern.",
      "Land once battled between east meets the west..",
    ],
    fun_facts: [
      "The water canals has become sewers ",
      "You must walk everywhere with alertness as thiefs lurk every corner.",
    ],
    trivia: [
      "Vietnam - a land of rice- has a deep dark past. Even eating on the street and in peoples homes brings on an unsettled anxiety.",
      "Many war survivors has an addiction here, with high drug abuse.",
    ],
  },
  {
    id: 26,
    city: "Zurich",
    country: "Switzerland",
    clues: [
      "Switzerland chocolates will send you crazy here. ",
      "City considered safe and secure with low violent/minor crimes and happy to do the police works for locals and neighbors from afar.  ",
    ],
    fun_facts: [
      "In summer some folks gets to 'swim' during summer with blow up dingies",
      "Water supply sourced from pristine glaciers",
    ],
    trivia: [
      "Is a country which many see in fairy tales ",
      "Home to biggest and private banking hubs for storing million-millions.. Some that don't declare tax/wealth with good ethics..",
    ],
  },
  {
    id: 27,
    city: "Madrid",
    country: "Spain",
    clues: [
      "Has one of Europes biggest football (Soccer for USA people.) with fans that roar",
      "Used to have lots of art deco and famous artists. ",
    ],
    fun_facts: [
      "City with the highest number of bar than any of its neighborhood. Meaning great culture when the nights come! (Caution though!).",
      "Night time- you better use 'safe spaces'. Areas here have known people doing unsavory deals, in its many local streets. This applies to pick pocketing during the tourist hot spots too.",
    ],
    trivia: [
      "They actually do not eat Tapas for every occasion, (contrary to popular belief)",
      "People consider a Siesta, every day..",
    ],
  },
  {
    id: 28,
    city: "Mumbai",
    country: "India",
    clues: [
      "Biggest Bollywood (Film sector).",
      "Slum Dog millionare movie tells one mans quest against this city backdrop.",
    ],
    fun_facts: [
      "Every street sells local street side delights with extreme varieties with spices - often you do require a steel gut though. If you haven't acclimated you'll have the upset belly. And this is just the tourist versions.. Imagine what the real deal is.",
      "Has 4 languages- but with different dialect (they're related yet they sound different - for locals from the rural areas). All being mixed can lead to 'a mixed stew stewed too many times.'",
    ],
    trivia: [
      "Caste system - which discriminates on background.",
      "Don't let the locals over charge, as you'll encounter a 'rip off'.",
    ],
  },
  {
    id: 29,
    city: "Dublin",
    country: "Ireland",
    clues: [
      "There is Guinness sold with famous stout breweries with history.",
      "They call their own folks and community folks from this island..",
    ],
    fun_facts: [
      "There will some folks there that speak the Irish, which in language means a 'different' sound.  - for outsiders who speaks another tongue.",
      "Its common for people get 'Hammered'. That mean, when you get too drunk that a 'Hammer' hits you.",
    ],
    trivia: [
      "This location had its long wars",
      "Luck and clover comes together (clover being good for health from the land!) - that they bless folks with it.",
    ],
  },
  {
    id: 30,
    city: "Buenos Aires",
    country: "Argentina",
    clues: [
      "Home of the tango dancers and has passion! Passion passion!!!. It burns!",
      "Can find European descent- that is considered a city by most for their holidays and good people - 'If only.",
    ],
    fun_facts: [
      "One will come with extra bag so one may enjoy all-in for its wines.. You are able to. And no problems when you share as a good family. One for good family and friends.",
      "A big shopping haven that many love.",
    ],
    trivia: [
      "Politics is very strong due to economy. They battle with their love for life and against political views . A lot will find no value as much to give here. Some others - just does with life.",
      "Notorious for robberies and corrupt policemen. Take cautions here.",
    ],
  },
  {
    id: 31,
    city: "Marseille",
    country: "France",
    clues: [
      "Has people from French colonie here with French twist - one cant tell with how many spices and ingredients put!",
      "Very good harbour, that one will admire",
    ],
    fun_facts: [
      "Here local French love playing Pitanq- local sport",
      "Has a criminal past- do your checks with people and with areas ",
    ],
    trivia: [
      "Football very wild. Love the passion",
      "The language barrier sometimes. Most just happy to hang round each others neck regardless when cheering!. Don't take personally on the other language - smile with passion and enjoy with heart.",
    ],
  },
  {
    id: 32,
    city: "Hanoi",
    country: "Vietnam",
    clues: [
      "When city gets a clean that says something very long-  about countrys very war . One will understand very shortly",
      "Known local love with coffee. - strong beans.",
    ],
    fun_facts: [
      "Has trains zooming! Do not get on tracks!- when waiting crossing street!! Don't underestimate that they're friendly if there isn't- for just quick moment! Always have smile to offer.",
      "Has all different folks, to learn a different world!- if befriend correctly ofcourse!",
    ],
    trivia: [
      "Is city still at very slow steps.- on 'catching on', but has lot soul still!",
      "Learn to smile often.-  It is a land that understands hard working past",
    ],
  },
  {
    id: 33,
    city: "Venice",
    country: "Italy",
    clues: [
      "Is in need some serious TLC (tender love and Care) - has sinking history!- is sinking!",
      "When land very much one and a people here. - they show best of culture!!",
    ],
    fun_facts: [
      "Lots glass sold everywhere. Has tourist, from everywhere!!. - is easy sold!",
      "Lots has past- is here.- for many to wonder and admire.- past comes again..",
    ],
    trivia: [
      "Do get ride. But you should barter and is part.- to know land very here for one's life.",
      "Lots will say here for all. Its lots. - for its place from heart",
    ],
  },

  {
    id: 34,
    city: "Kathmandu",
    country: "Nepal",
    clues: [
      "This location will find high mountains here and its amazing for every one . But for all.",
      "Be grateful where is located at .- there's no harm one says.",
    ],
    fun_facts: [
      "Lots folks travel from everywhere.",
      "Here land one understand kindness with culture so it says",
    ],
    trivia: [
      "Not every time to understand its best place one wants when there.. Just love every thing says.",
      "If one needs great time. Dont mind some say for real!! one one comes ",
    ],
  },
  {
    id: 35,
    city: "Reykjavik",
    country: "Iceland",
    clues: [
      "Can witness skies . At amazing time",
      "Dont tell everyone what they dont want .. Says . Some that will get one's amazing sight forever..",
    ],
    fun_facts: [
      "If one needs amazing place , for what for real! - with life . Will find here and say , is the only for some.. So there are many is sure .",
      "Never see every part says its home, until very forever... and understand with time.",
      "Just to find all with love what one sees ,. Never say to find its peace and there what says its world!.",
      "Find life says",
    ],
    trivia: [
      "Not for time. If that has one comes, to never say. The love says.",
      "But comes with time as well.- is life",
    ],
  },
  {
    id: 36,
    city: "Tirana",
    country: "Albania",
    clues: [
      "Will show all comes. Not with luck but only if with . But that finds if its real forever.. Comes. Only ..",
      "See only for once . - is the reason . Of heart!.",
    ],
    fun_facts: [
      "Can never say when one for always.",
      "Does just .. Shows ! Show..",
      "Says! Shows - Says .",
    ],
    trivia: ["Just say show", "Where shows always one and, Love now all!"],
  },
  {
    id: 37,
    city: "Amsterdam",
    country: "Netherlands",
    clues: ["Forever comes always comes see . ", "Never there see - where"],
    fun_facts: [
      "Love",
      "Shows if .- you, always , to Love .",
      "Where and with say comes .",
    ],
    trivia: [
      "Only always says show to for , or! Shows ! for , here know forever, not see what there is why with but.",
      "Forever not with ever ! Show why!. Show know to where, Forever not.",

      "Shows not and ever , !",
    ],
  },
  {
    id: 38,
    city: "Oslo",
    country: "Norway",
    clues: [
      "or not ever or Love see what shows .- Where",

      "Is. here . show .- You Forever to there love never Show comes. All Forever show.",

      "and only you ever never to that not only what ",
    ],

    fun_facts: ["or Forever all - Love but never why only"],

    trivia: [
      "forever why or . Always but all - only Never comes why to always never for Ever where not",
    ],
  },
  {
    id: 39,
    city: "Tokyo",
    country: "Japan",
    clues: [
      "Known for its bustling Shibuya crossing, one of the world's busiest.",
      "Home to the Emperor's Palace and surrounded by peaceful gardens.",
    ],
    fun_facts: [
      "Tokyo was originally named Edo.",
      "You can find themed cafes dedicated to animals like owls and cats.",
    ],
    trivia: [
      "Vending machines are ubiquitous here, selling everything from drinks to ramen.",
      "The city is on a similar latitude to Los Angeles and Casablanca.",
    ],
  },
  {
    id: 40,
    city: "Rome",
    country: "Italy",
    clues: [
      "The city of seven hills and home to the Vatican City.",
      "You can toss a coin in the Trevi Fountain to ensure your return.",
    ],
    fun_facts: [
      "Rome is almost 3,000 years old.",
      "It's illegal to build higher than St. Peter's Basilica within the city limits.",
    ],
    trivia: [
      "Cats have protected status in Rome and are allowed to live in the ruins of the city.",
      "Rome has a sister city relationship with Paris, famously known as 'only Paris is worthy of Rome; only Rome is worthy of Paris'.",
    ],
  },
  {
    id: 41,
    city: "Rio de Janeiro",
    country: "Brazil",
    clues: [
      "Famous for its Christ the Redeemer statue overlooking the city.",
      "Carnival celebrations here are legendary.",
    ],
    fun_facts: [
      "The name Rio de Janeiro means 'January River'.",
      "Copacabana beach is known for its distinctive black and white mosaic sidewalk.",
    ],
    trivia: [
      "'Carioca' is a term used to describe someone from Rio de Janeiro.",
      "Tijuca National Park is one of the largest urban rainforests in the world, located within the city.",
    ],
  },
  {
    id: 42,
    city: "Sydney",
    country: "Australia",
    clues: [
      "Home to a famous Opera House shaped like sails.",
      "The Harbour Bridge offers stunning views and bridge climbs.",
    ],
    fun_facts: [
      "Sydney's harbour is the deepest natural harbour in the world.",
      "It's one of the first major cities to welcome the New Year.",
    ],
    trivia: [
      "The Sydney Opera House was originally meant to have a completely different design.",
      "Sydney has more than 100 beaches.",
    ],
  },
  {
    id: 43,
    city: "New York City",
    country: "USA",
    clues: [
      "Known as 'The Big Apple'.",
      "Home to Times Square and the Statue of Liberty.",
    ],
    fun_facts: [
      "New York City was once called New Amsterdam.",
      "Central Park is larger than the country of Monaco.",
    ],
    trivia: [
      "Honking your car horn is illegal in NYC, except in emergencies.",
      "The iconic yellow taxis were originally red and green.",
    ],
  },
  {
    id: 44,
    city: "Moscow",
    country: "Russia",
    clues: [
      "The Kremlin and Red Square are central to this city.",
      "Known for its ornate metro stations.",
    ],
    fun_facts: [
      "Moscow is the largest city entirely within Europe.",
      "Saint Basil's Cathedral is actually made up of nine different chapels.",
    ],
    trivia: [
      "Moscow is further north than cities like Copenhagen or Amsterdam.",
      "There are secret underground metro lines that were built for emergencies.",
    ],
  },
  {
    id: 45,
    city: "Bangkok",
    country: "Thailand",
    clues: [
      "Famous for its ornate temples and bustling street markets.",
      "Known as the 'Land of Smiles'.",
    ],
    fun_facts: [
      "Bangkok's full ceremonial name is the longest city name in the world.",
      "The city was once known as the 'Venice of the East' due to its canals.",
    ],
    trivia: [
      "There are over 400 Buddhist temples ('wats') in Bangkok.",
      "Street food here is incredibly diverse and often considered among the best in the world.",
    ],
  },
  {
    id: 46,
    city: "Marrakech",
    country: "Morocco",
    clues: [
      "Known for its vibrant souks and the Djemaa el-Fna square.",
      "Often referred to as the 'Red City' due to its buildings.",
    ],
    fun_facts: [
      "Marrakech was once one of Morocco's imperial cities.",
      "The Koutoubia Mosque's minaret inspired the Giralda in Seville and the Hassan Tower in Rabat.",
    ],
    trivia: [
      "Snake charmers, storytellers, and food stalls fill Djemaa el-Fna at night.",
      "The Majorelle Garden was famously restored by Yves Saint Laurent.",
    ],
  },
  {
    id: 47,
    city: "Vancouver",
    country: "Canada",
    clues: [
      "A coastal city surrounded by mountains and water.",
      "Known for Stanley Park, one of North America's largest urban parks.",
    ],
    fun_facts: [
      "Vancouver is a popular filming location, often called 'Hollywood North'.",
      "It consistently ranks high in world's most liveable cities.",
    ],
    trivia: [
      "The first Greenpeace office was started in Vancouver.",
      "It's one of the warmest cities in Canada during the winter.",
    ],
  },
  {
    id: 48,
    city: "Cape Town",
    country: "South Africa",
    clues: [
      "Dominated by the iconic Table Mountain.",
      "Where two oceans officially meet at Cape Point.",
    ],
    fun_facts: [
      "Cape Town is South Africa's oldest city.",
      "Robben Island, where Nelson Mandela was imprisoned, is visible from the coast.",
    ],
    trivia: [
      "Penguins can be found on Boulders Beach near Cape Town.",
      "The colorful houses in the Bo-Kaap neighborhood were traditionally rented out to slaves.",
    ],
  },
  {
    id: 49,
    city: "Buenos Aires",
    country: "Argentina",
    clues: [
      "The birthplace of Tango.",
      "Known for its European-style architecture and wide avenues.",
    ],
    fun_facts: [
      "Buenos Aires is often called the 'Paris of South America'.",
      "It has more bookstores per capita than any other city in the world.",
    ],
    trivia: [
      "The world's widest avenue, 9 de Julio Avenue, is located here.",
      "The city has a strong Italian influence due to large waves of immigration.",
    ],
  },
  {
    id: 50,
    city: "Berlin",
    country: "Germany",
    clues: [
      "Once divided by a famous wall.",
      "Known for its vibrant art scene and nightlife.",
    ],
    fun_facts: [
      "Berlin has more museums than rainy days.",
      "It’s estimated that Berlin has more Turkish inhabitants than any other city outside of Turkey.",
    ],
    trivia: [
      "Döner kebab was invented in Berlin.",
      "Berlin is built on a swampy area, hence its name 'Berlin' likely derives from a Slavic word for swamp or bog.",
    ],
  },
  {
    id: 51,
    city: "Seoul",
    country: "South Korea",
    clues: [
      "A sprawling metropolis known for its K-Pop and technology.",
      "Surrounded by mountains and home to ancient palaces and temples.",
    ],
    fun_facts: [
      "Seoul was the first city in the world to have nationwide 4G LTE.",
      "The Han River bisects the city and is a major part of Seoul's identity.",
    ],
    trivia: [
      "Seoul was completely destroyed and rebuilt after the Korean War.",
      "Kimchi is a staple food and there are hundreds of varieties.",
    ],
  },
  {
    id: 52,
    city: "Amsterdam",
    country: "Netherlands",
    clues: [
      "Famous for its canals, windmills (nearby), and tulips.",
      "Known for being bicycle-friendly.",
    ],
    fun_facts: [
      "Amsterdam's canals are UNESCO World Heritage listed.",
      "There are more bicycles than people in Amsterdam.",
    ],
    trivia: [
      "Houses in Amsterdam are built on wooden or concrete piles due to the soft ground.",
      "It's home to the narrowest house in the world (width of its facade).",
    ],
  },
  {
    id: 53,
    city: "San Francisco",
    country: "USA",
    clues: [
      "Known for the Golden Gate Bridge and its hilly streets.",
      "Home to Alcatraz Island.",
    ],
    fun_facts: [
      "Fog has a name here – Karl the Fog.",
      "Cable cars are a unique mode of transport and a National Historic Landmark.",
    ],
    trivia: [
      "Fortune cookies are believed to have originated in San Francisco, not China.",
      "The Bay Area has a significant number of microclimates.",
    ],
  },
  {
    id: 54,
    city: "Kyoto",
    country: "Japan",
    clues: [
      "The former imperial capital of Japan, known for temples and gardens.",
      "Geishas can still be spotted in the Gion district.",
    ],
    fun_facts: [
      "Kyoto was spared from bombing during WWII due to its cultural importance.",
      "Fushimi Inari Shrine with thousands of red torii gates is located here.",
    ],
    trivia: [
      "Matcha tea ceremonies are deeply rooted in Kyoto's culture.",
      "Many traditional wooden machiya houses still exist in Kyoto.",
    ],
  },
  {
    id: 55,
    city: "Seville",
    country: "Spain",
    clues: [
      "The heart of Andalusia and birthplace of Flamenco.",
      "Known for the Alcázar of Seville, a stunning palace complex.",
    ],
    fun_facts: [
      "Seville's Cathedral is the largest Gothic cathedral in the world.",
      "Tapas culture is strong here and often considered to have originated in Andalusia.",
    ],
    trivia: [
      "Orange trees line many streets and squares of Seville.",
      "The Giralda, the bell tower of Seville Cathedral, was originally built as a minaret for a mosque.",
    ],
  },
  {
    id: 56,
    city: "Hanoi",
    country: "Vietnam",
    clues: [
      "The capital of Vietnam, known for its Old Quarter and street food.",
      "Hoan Kiem Lake is a central feature in the city.",
    ],
    fun_facts: [
      "Hanoi was originally named Thang Long, meaning 'Ascending Dragon'.",
      "Cyclos (pedicabs) are still a popular way to explore the Old Quarter.",
    ],
    trivia: [
      "Coffee culture is very strong in Hanoi, especially egg coffee ('cà phê trứng').",
      "Water puppetry ('múa rối nước') is a traditional art form unique to Northern Vietnam, often performed in Hanoi.",
    ],
  },
  {
    id: 57,
    city: "Jaipur",
    country: "India",
    clues: [
      "Known as the 'Pink City' due to its building color.",
      "Home to Amber Fort and Hawa Mahal.",
    ],
    fun_facts: [
      "Jaipur was India's first planned city.",
      "Jantar Mantar is an astronomical observatory from the 18th century and a UNESCO site.",
    ],
    trivia: [
      "Lac bangles are a popular traditional craft of Jaipur.",
      "Elephant rides to Amber Fort are a common tourist experience.",
    ],
  },
  {
    id: 58,
    city: "Nairobi",
    country: "Kenya",
    clues: [
      "A major East African hub, and gateway to safari adventures.",
      "Has a national park within city limits.",
    ],
    fun_facts: [
      "Nairobi National Park is the only national park in the world bordering a capital city.",
      "The Maasai Market is a vibrant place to buy crafts and souvenirs.",
    ],
    trivia: [
      "Giraffe Manor is a unique hotel where giraffes roam freely and sometimes peek into breakfast.",
      "Kenyatta International Convention Centre (KICC) has a helipad on top, offering panoramic city views.",
    ],
  },
  {
    id: 59,
    city: "Toronto",
    country: "Canada",
    clues: [
      "Canada's largest city and a multicultural hub.",
      "Known for the CN Tower and diverse neighborhoods.",
    ],
    fun_facts: [
      "Toronto is one of the most multicultural cities in the world; over half of its residents were born outside of Canada.",
      "Casa Loma, a castle-like mansion, is a unique landmark in the city.",
    ],
    trivia: [
      "Toronto has an underground city called PATH, connecting buildings and subway stations.",
      "It's home to the Hockey Hall of Fame.",
    ],
  },
  {
    id: 60,
    city: "Copenhagen",
    country: "Denmark",
    clues: [
      "Often ranked as one of the happiest cities in the world.",
      "Home to the Little Mermaid statue.",
    ],
    fun_facts: [
      "Copenhagen has a free city called Christiania.",
      "I's one of the most bike-friendly cities globally.",
    ],
    trivia: [
      "'Hygge' (coziness) is a significant part of Danish culture.",
      "Tivoli Gardens is one of the oldest amusement parks in the world, located in the city center.",
    ],
  },
  {
    id: 61,
    city: "Prague",
    country: "Czech Republic",
    clues: [
      "Known as 'The City of a Hundred Spires'.",
      "Features the Charles Bridge and Prague Castle.",
    ],
    fun_facts: [
      "Prague has one of the oldest astronomical clocks in the world.",
      "Beer is cheaper than water in many places.",
    ],
    trivia: [
      "According to Guinness World Records, Prague Castle is the largest ancient castle complex in the world.",
      "Petřín Hill offers a funicular and a miniature Eiffel Tower.",
    ],
  },
  {
    id: 62,
    city: "Vienna",
    country: "Austria",
    clues: [
      "The 'City of Music' and home to famous composers.",
      "Known for its grand palaces and coffee houses.",
    ],
    fun_facts: [
      "Vienna has the oldest zoo in the world.",
      "The Spanish Riding School is famous for its Lipizzaner horses.",
    ],
    trivia: [
      "Sigmund Freud lived and worked in Vienna for many years.",
      "Central Cemetery (Zentralfriedhof) is the final resting place of many famous composers like Beethoven and Mozart.",
    ],
  },
  {
    id: 63,
    city: "Dublin",
    country: "Ireland",
    clues: [
      "Famous for its pubs, Guinness, and literature.",
      "Trinity College and the Book of Kells are located here.",
    ],
    fun_facts: [
      "Dublin has over 700 pubs.",
      "St. Patrick's Cathedral is the largest cathedral in Ireland.",
    ],
    trivia: [
      "Dublin was originally a Viking settlement.",
      "Phoenix Park in Dublin is one of the largest enclosed city parks in Europe.",
    ],
  },
  {
    id: 64,
    city: "Lisbon",
    country: "Portugal",
    clues: [
      "A hilly, coastal capital known for its melancholic Fado music.",
      "Features historic trams and colorful buildings in Alfama district.",
    ],
    fun_facts: [
      "Lisbon is one of the oldest cities in Western Europe, predating other modern European capitals such as London, Paris and Rome by centuries.",
      "The 25 de Abril Bridge is often compared to the Golden Gate Bridge in San Francisco.",
    ],
    trivia: [
      "Pastel de nata, a custard tart pastry, is a famous local delicacy, particularly from Belém district.",
      "Lisbon is built on seven hills, similar to Rome and Istanbul.",
    ],
  },
  {
    id: 65,
    city: "Budapest",
    country: "Hungary",
    clues: [
      "Known as the 'Pearl of the Danube'.",
      "Famous for its thermal baths and ruin bars.",
    ],
    fun_facts: [
      "Budapest was formed from the merger of three cities: Buda, Pest, and Óbuda.",
      "It has the second oldest metro line in continental Europe.",
    ],
    trivia: [
      "Hungary is one of the few countries in the world where you can find thermal springs with proven medicinal effects within a capital city.",
      "Many of Budapest's 'ruin bars' are built in abandoned buildings and courtyards, giving them a unique atmosphere.",
    ],
  },
  {
    id: 66,
    city: "Montreal",
    country: "Canada",
    clues: [
      "The largest city in Quebec, known for its French heritage.",
      "Home to a vibrant underground city and festivals.",
    ],
    fun_facts: [
      "Montreal is named after Mount Royal, the triple-peaked hill located in the heart of the city.",
      "It is the second-largest primarily French-speaking city in the world, after Paris.",
    ],
    trivia: [
      "Montreal's 'Underground City', RÉSO, is one of the largest underground complexes in the world.",
      "Bagels from Montreal are considered by many to be distinct from and superior to New York bagels.",
    ],
  },
  {
    id: 67,
    city: "Shanghai",
    country: "China",
    clues: [
      "A global financial hub on the Huangpu River.",
      "Known for its Bund waterfront and towering skyscrapers in Pudong.",
    ],
    fun_facts: [
      "Shanghai's name literally means 'Upon-the-Sea'.",
      "The Shanghai World Financial Center (SWFC) was once the second tallest building in the world.",
    ],
    trivia: [
      "'Nanjing Road' is one of the world's busiest shopping streets.",
      "Yu Garden offers a classical Chinese garden experience in the heart of the city.",
    ],
  },
  {
    id: 68,
    city: "Dubai",
    country: "UAE",
    clues: [
      "A city known for luxury shopping and modern architecture.",
      "Home to the Burj Khalifa, the world's tallest building.",
    ],
    fun_facts: [
      "Dubai was once a small fishing village.",
      "Palm Jumeirah, a palm-shaped artificial archipelago, is visible from space.",
    ],
    trivia: [
      "The Dubai Mall is one of the largest shopping malls in the world.",
      "Indoor skiing is possible in Dubai even with the desert climate.",
    ],
  },
];

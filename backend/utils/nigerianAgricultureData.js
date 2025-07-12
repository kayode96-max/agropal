// Nigerian States and Agricultural Zones
const NIGERIAN_STATES = {
  // North Central
  FCT: {
    name: "Federal Capital Territory",
    zone: "north_central",
    capital: "Abuja",
  },
  Benue: { name: "Benue", zone: "north_central", capital: "Makurdi" },
  Kogi: { name: "Kogi", zone: "north_central", capital: "Lokoja" },
  Kwara: { name: "Kwara", zone: "north_central", capital: "Ilorin" },
  Nasarawa: { name: "Nasarawa", zone: "north_central", capital: "Lafia" },
  Niger: { name: "Niger", zone: "north_central", capital: "Minna" },
  Plateau: { name: "Plateau", zone: "north_central", capital: "Jos" },

  // North East
  Adamawa: { name: "Adamawa", zone: "north_east", capital: "Yola" },
  Bauchi: { name: "Bauchi", zone: "north_east", capital: "Bauchi" },
  Borno: { name: "Borno", zone: "north_east", capital: "Maiduguri" },
  Gombe: { name: "Gombe", zone: "north_east", capital: "Gombe" },
  Taraba: { name: "Taraba", zone: "north_east", capital: "Jalingo" },
  Yobe: { name: "Yobe", zone: "north_east", capital: "Damaturu" },

  // North West
  Jigawa: { name: "Jigawa", zone: "north_west", capital: "Dutse" },
  Kaduna: { name: "Kaduna", zone: "north_west", capital: "Kaduna" },
  Kano: { name: "Kano", zone: "north_west", capital: "Kano" },
  Katsina: { name: "Katsina", zone: "north_west", capital: "Katsina" },
  Kebbi: { name: "Kebbi", zone: "north_west", capital: "Birnin Kebbi" },
  Sokoto: { name: "Sokoto", zone: "north_west", capital: "Sokoto" },
  Zamfara: { name: "Zamfara", zone: "north_west", capital: "Gusau" },

  // South East
  Abia: { name: "Abia", zone: "south_east", capital: "Umuahia" },
  Anambra: { name: "Anambra", zone: "south_east", capital: "Awka" },
  Ebonyi: { name: "Ebonyi", zone: "south_east", capital: "Abakaliki" },
  Enugu: { name: "Enugu", zone: "south_east", capital: "Enugu" },
  Imo: { name: "Imo", zone: "south_east", capital: "Owerri" },

  // South South
  "Akwa Ibom": { name: "Akwa Ibom", zone: "south_south", capital: "Uyo" },
  Bayelsa: { name: "Bayelsa", zone: "south_south", capital: "Yenagoa" },
  "Cross River": {
    name: "Cross River",
    zone: "south_south",
    capital: "Calabar",
  },
  Delta: { name: "Delta", zone: "south_south", capital: "Asaba" },
  Edo: { name: "Edo", zone: "south_south", capital: "Benin City" },
  Rivers: { name: "Rivers", zone: "south_south", capital: "Port Harcourt" },

  // South West
  Ekiti: { name: "Ekiti", zone: "south_west", capital: "Ado-Ekiti" },
  Lagos: { name: "Lagos", zone: "south_west", capital: "Ikeja" },
  Ogun: { name: "Ogun", zone: "south_west", capital: "Abeokuta" },
  Ondo: { name: "Ondo", zone: "south_west", capital: "Akure" },
  Osun: { name: "Osun", zone: "south_west", capital: "Osogbo" },
  Oyo: { name: "Oyo", zone: "south_west", capital: "Ibadan" },
};

// Major crops by zone
const CROPS_BY_ZONE = {
  north_central: [
    "yam",
    "maize",
    "rice",
    "soybean",
    "millet",
    "sorghum",
    "cowpea",
    "cassava",
  ],
  north_east: [
    "millet",
    "sorghum",
    "maize",
    "rice",
    "cowpea",
    "groundnut",
    "cotton",
  ],
  north_west: [
    "millet",
    "sorghum",
    "maize",
    "rice",
    "cowpea",
    "groundnut",
    "cotton",
    "onion",
  ],
  south_east: [
    "cassava",
    "yam",
    "cocoyam",
    "plantain",
    "maize",
    "oil_palm",
    "cocoa",
  ],
  south_south: [
    "cassava",
    "plantain",
    "banana",
    "oil_palm",
    "cocoa",
    "pepper",
    "okra",
  ],
  south_west: [
    "cassava",
    "yam",
    "maize",
    "cocoa",
    "oil_palm",
    "plantain",
    "kola_nut",
  ],
};

// Common diseases by crop in Nigeria
const COMMON_DISEASES = {
  cassava: [
    "Cassava Mosaic Disease",
    "Cassava Brown Streak Disease",
    "Cassava Bacterial Blight",
    "Cassava Anthracnose",
  ],
  yam: [
    "Yam Mosaic Virus",
    "Yam Anthracnose",
    "Dry Rot Disease",
    "Wet Rot Disease",
  ],
  maize: [
    "Maize Streak Virus",
    "Northern Corn Leaf Blight",
    "Gray Leaf Spot",
    "Stalk Rot",
    "Ear Rot",
  ],
  rice: ["Rice Blast", "Bacterial Leaf Blight", "Sheath Blight", "Brown Spot"],
  tomato: [
    "Tomato Late Blight",
    "Early Blight",
    "Bacterial Wilt",
    "Fusarium Wilt",
    "Tomato Mosaic Virus",
  ],
  cocoa: [
    "Black Pod Disease",
    "Witches Broom",
    "Frosty Pod Rot",
    "Swollen Shoot Virus",
  ],
};

// Planting seasons by zone
const PLANTING_SEASONS = {
  north_central: {
    wet_season: { start: "April", end: "July" },
    dry_season: { start: "November", end: "February" },
  },
  north_east: {
    wet_season: { start: "May", end: "August" },
    dry_season: { start: "November", end: "March" },
  },
  north_west: {
    wet_season: { start: "May", end: "September" },
    dry_season: { start: "October", end: "March" },
  },
  south_east: {
    first_season: { start: "March", end: "July" },
    second_season: { start: "August", end: "November" },
  },
  south_south: {
    first_season: { start: "March", end: "July" },
    second_season: { start: "August", end: "December" },
  },
  south_west: {
    first_season: { start: "April", end: "July" },
    second_season: { start: "August", end: "November" },
  },
};

// Helper functions
const getStateInfo = (stateName) => {
  return NIGERIAN_STATES[stateName] || null;
};

const getZoneCrops = (zone) => {
  return CROPS_BY_ZONE[zone] || [];
};

const getCropDiseases = (cropName) => {
  return COMMON_DISEASES[cropName] || [];
};

const getPlantingSeason = (zone) => {
  return PLANTING_SEASONS[zone] || null;
};

const getAllStates = () => {
  return Object.keys(NIGERIAN_STATES);
};

const getStatesByZone = (zone) => {
  return Object.keys(NIGERIAN_STATES).filter(
    (state) => NIGERIAN_STATES[state].zone === zone
  );
};

// Determine appropriate crops for a state
const getStateCrops = (stateName) => {
  const stateInfo = getStateInfo(stateName);
  if (!stateInfo) return [];
  return getZoneCrops(stateInfo.zone);
};

// Validate if a crop is suitable for a state
const isCropSuitableForState = (cropName, stateName) => {
  const stateCrops = getStateCrops(stateName);
  return stateCrops.includes(cropName);
};

module.exports = {
  NIGERIAN_STATES,
  CROPS_BY_ZONE,
  COMMON_DISEASES,
  PLANTING_SEASONS,
  getStateInfo,
  getZoneCrops,
  getCropDiseases,
  getPlantingSeason,
  getAllStates,
  getStatesByZone,
  getStateCrops,
  isCropSuitableForState,
};

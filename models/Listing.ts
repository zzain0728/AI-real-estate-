import mongoose from "mongoose";

// Flexible schema to adapt to unknown fields
const ListingSchema = new mongoose.Schema(
  {
    // We'll try to capture common fields
    ListPrice: Number,
    price: Number,
    TransactionType: String, // 'For Lease' or 'For Sale'
    MlsStatus: String,
    PropertySubType: String,
    OriginalEntryTimestamp: Date,
    ListingKey: String,
    BedroomsTotal: String,
    GarageSpaces: Number,

    // Details for Modal
    PublicRemarks: String,
    TaxAnnualAmount: Number,
    Cooling: [String],
    Heating: [String],
    FireplaceYN: String,
    PoolFeatures: [String],
    AssociationFee: Number,
    PetsAllowed: String,
    RoomDetails: [mongoose.Schema.Types.Mixed], // Flexible array for rooms

    // Found via recursive scan: location.coordinates: [lng, lat]
    location: {
      type: { type: String },
      coordinates: [Number],
    },

    Address: String,
    address: String,
  },
  {
    strict: false,
    collection: "properties_lite",
  },
);

// Helper to normalize data for frontend
ListingSchema.methods.toClient = function () {
  const obj = this.toObject();
  let lat = 0;
  let lng = 0;

  // Extract from GeoJSON if available
  if (obj.location && obj.location.coordinates && Array.isArray(obj.location.coordinates)) {
    lng = obj.location.coordinates[0];
    lat = obj.location.coordinates[1];
  }
  // Fallback to flat fields if they ever exist
  else {
    lat = obj.Latitude || obj.lat || obj.latitude || 0;
    lng = obj.Longitude || obj.lng || obj.longitude || 0;
  }

  // Calculate Days on Market
  const now = new Date();
  const entry = obj.OriginalEntryTimestamp ? new Date(obj.OriginalEntryTimestamp) : now;
  const diffTime = Math.abs(now.getTime() - entry.getTime());
  const dom = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Parse Short Address (Number + Street Name only)
  // Format: "123 MAIN ST, City, ON" -> "123 MAIN ST"
  let shortAddress = obj.Address || obj.address || obj.UnparsedAddress || "Unknown";
  if (shortAddress.includes(",")) {
    shortAddress = shortAddress.split(",")[0].trim();
  }

  return {
    id: obj._id,
    ListingKey: obj.ListingKey, // Required for images
    mlsNumber: obj.ListingKey || "N/A",
    price: obj.ListPrice || obj.price || 0,
    type: obj.TransactionType || "For Sale",
    status: obj.MlsStatus || "Active",
    propertyType: obj.PropertySubType || "Other",
    beds: obj.BedroomsTotal || 0,
    baths: obj.BathroomsTotalInteger || 0,
    parking: obj.ParkingSpaces || 0,
    dom: dom,
    lat: lat,
    lng: lng,
    address: shortAddress,
    city: obj.City || obj.Municipality || "",
    fullAddress: obj.Address || obj.address || obj.UnparsedAddress || "Unknown",

    // Detailed fields
    description: obj.PublicRemarks || "",
    taxes: obj.TaxAnnualAmount || 0,
    cooling: obj.Cooling || [],
    heating: obj.Heating || [],
    rooms: obj.RoomDetails || [],
    origEntryTimestamp: obj.OriginalEntryTimestamp ? obj.OriginalEntryTimestamp.toISOString() : null,

    // Advanced Filter Fields
    garage: obj.GarageSpaces || 0,
    maintenance: obj.AssociationFee || obj.MonthlyMaintenance || 0,
    basement: obj.Basement || [], // Often an array in MLS
    sqft: obj.LivingArea || obj.ApproxSquareFootage || "",

    // Listing Office/Brokerage
    listOfficeName: obj.ListOfficeName || obj.ListingOfficeName || obj.BrokerageName || "",
  };
};

export default mongoose.models.Listing || mongoose.model("Listing", ListingSchema);

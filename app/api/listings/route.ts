import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Listing from "@/models/Listing";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const queryText = searchParams.get("query");
  const minLat = searchParams.get("minLat");
  const maxLat = searchParams.get("maxLat");
  const minLng = searchParams.get("minLng");
  const maxLng = searchParams.get("maxLng");

  const query: any = {
    "location.coordinates": { $exists: true, $ne: [] },
  };

  const escapeRegExp = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (queryText && queryText.trim()) {
    const q = queryText.trim();
    const regex = new RegExp(escapeRegExp(q), "i");
    query.$or = [
      { ListingKey: regex },
      { Address: regex },
      { UnparsedAddress: regex },
      { address: regex },
      { City: regex },
      { Municipality: regex },
    ];
  } else if (minLat && maxLat && minLng && maxLng) {
    query.location = {
      $geoWithin: {
        $box: [
          [parseFloat(minLng), parseFloat(minLat)],
          [parseFloat(maxLng), parseFloat(maxLat)],
        ],
      },
    };
  }

  try {
    // Return a small starter set when no query to avoid huge payloads.
    const limit = queryText ? 50 : 3;
    const listings = await Listing.find(query).limit(limit);
    const serialized = listings.map((l) => l.toClient());
    return NextResponse.json({ listings: serialized });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

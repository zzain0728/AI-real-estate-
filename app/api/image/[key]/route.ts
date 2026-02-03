import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.TOTR;

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
  const key = params.key;
  if (!key) return new NextResponse("Missing key", { status: 400 });

  const { searchParams } = new URL(req.url);
  const indexParam = searchParams.get("index");
  const parsedIndex = indexParam ? parseInt(indexParam, 10) : 0;
  const index = Number.isFinite(parsedIndex) ? Math.max(parsedIndex, 0) : 0;

  const filter = `ResourceName eq 'Property' and ResourceRecordKey eq '${key}' and ImageSizeDescription eq 'Large'`;
  const url = `https://query.ampre.ca/odata/Media?$filter=${encodeURIComponent(filter)}&$orderby=Order&$skip=${index}&$top=1`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return new NextResponse(`Upstream error: ${res.status}`, { status: 502 });
    }

    const data = await res.json();
    const items = data.value;

    if (items && items.length > 0 && items[0].MediaURL) {
      return NextResponse.redirect(items[0].MediaURL);
    }

    // Fallback image if no media found
    return NextResponse.redirect("https://cdn-icons-png.flaticon.com/512/25/25694.png");
  } catch (error) {
    console.error("Image fetch error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

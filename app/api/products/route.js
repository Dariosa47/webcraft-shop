import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "products.json");

export async function GET() {
  const data = fs.readFileSync(filePath, "utf-8");
  return Response.json(JSON.parse(data));
}

export async function POST(req) {
  const body = await req.json();
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
  return Response.json({ success: true });
}
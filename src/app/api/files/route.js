import { addFile } from "@/lib/data";

export async function POST(req) {
  try {
    const { folderId, name } = await req.json();
    if (!folderId || !name) {
      return new Response(JSON.stringify({ message: "folderId and name are required" }), { status: 400 });
    }
    const newFile = addFile(folderId, name, ""); // content kosong
    return new Response(JSON.stringify(newFile), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

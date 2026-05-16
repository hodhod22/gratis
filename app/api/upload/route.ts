import { NextRequest, NextResponse } from "next/server";
import { writeFile, readdir, stat, unlink } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES_PER_MESSAGE = 3;
const EXPIRY_HOURS = 12;

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function cleanOldFiles() {
  try {
    const files = await readdir(UPLOAD_DIR);
    const now = Date.now();
    for (const file of files) {
      const filePath = join(UPLOAD_DIR, file);
      const fileStat = await stat(filePath);
      const ageHours = (now - fileStat.mtimeMs) / (1000 * 60 * 60);
      if (ageHours > EXPIRY_HOURS) {
        await unlink(filePath);
        console.log(`🗑️ Raderade gammal fil: ${file}`);
      }
    }
  } catch (error) {
    console.error("Fel vid rensning:", error);
  }
}

setInterval(cleanOldFiles, 60 * 60 * 1000);
cleanOldFiles();

export async function POST(request: NextRequest) {
  try {
    console.log("📎 Upload API anropad");
    
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    console.log(`📎 Antal filer mottagna: ${files.length}`);
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Inga filer skickades" }, { status: 400 });
    }
    
    if (files.length > MAX_FILES_PER_MESSAGE) {
      return NextResponse.json({ 
        error: `Max ${MAX_FILES_PER_MESSAGE} filer per meddelande` 
      }, { status: 400 });
    }
    
    const uploadedFiles = [];
    
    for (const file of files) {
      console.log(`📎 Bearbetar fil: ${file.name}, storlek: ${file.size} bytes`);
      
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ 
          error: `Filen ${file.name} är för stor. Max ${MAX_FILE_SIZE / 1024 / 1024} MB` 
        }, { status: 400 });
      }
      
      const extension = file.name.split(".").pop();
      const uniqueFilename = `${randomUUID()}-${Date.now()}.${extension}`;
      const filePath = join(UPLOAD_DIR, uniqueFilename);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      const fileUrl = `/uploads/${uniqueFilename}`;
      
      uploadedFiles.push({
        name: file.name,
        url: fileUrl,
        size: file.size,
        type: file.type,
      });
      
      console.log(`📎 Fil sparad: ${fileUrl}`);
    }
    
    console.log(`📎 Returnerar ${uploadedFiles.length} filer`);
    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Kunde inte ladda upp filer" }, { status: 500 });
  }
}
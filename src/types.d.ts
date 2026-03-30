import { Connection } from "mongoose"

declare global{
    var mongoose:{
        connection:Connection | null,
        promise: Promise<Connection> | null
    }
}

declare module "pdf-parse" {
  interface PDFData {
    text: string;
    numpages: number;
    info: Record<string, unknown>;
  }
  export default function pdfParse(dataBuffer: Buffer): Promise<PDFData>;
}

export {}
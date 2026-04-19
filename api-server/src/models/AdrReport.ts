import { Schema, model, Document } from "mongoose";

export interface IAdrReport extends Document {
  drugName: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe";
  patientAge?: number;
  description: string;
  outcome?: string;
  reportedAt: Date;
  status: "pending" | "reviewed" | "resolved";
}

const AdrReportSchema = new Schema<IAdrReport>(
  {
    drugName: { type: String, required: true },
    reaction: { type: String, required: true },
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe"],
      required: true,
    },
    patientAge: { type: Number },
    description: { type: String, required: true },
    outcome: { type: String },
    reportedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const AdrReport = model<IAdrReport>("AdrReport", AdrReportSchema);

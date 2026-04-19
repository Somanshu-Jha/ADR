import { Schema, model, Document } from "mongoose";

export interface IDrug extends Document {
  name: string;
  genericName: string;
  category: string;
  activeIngredients: string[];
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  description: string;
  manufacturer?: string;
}

const DrugSchema = new Schema<IDrug>(
  {
    name: { type: String, required: true, index: true },
    genericName: { type: String, required: true },
    category: { type: String, required: true },
    activeIngredients: { type: [String], default: [] },
    indications: { type: [String], default: [] },
    contraindications: { type: [String], default: [] },
    sideEffects: { type: [String], default: [] },
    description: { type: String, required: true },
    manufacturer: { type: String },
  },
  { timestamps: true }
);

DrugSchema.index({ name: "text", genericName: "text" });

export const Drug = model<IDrug>("Drug", DrugSchema);

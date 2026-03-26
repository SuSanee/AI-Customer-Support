import mongoose, { model, Schema } from "mongoose";

interface settingsInterface {
  ownerId: string;
  businessName: string;
  supportEmail: string;
  knowledge: string;
}

const settingsSchema = new Schema<settingsInterface>(
  {
    ownerId: {
      type: String,
      required: true,
      unique: true
    },
    businessName: {
      type: String,
      required: true,
    },
    supportEmail: {
      type: String,
      required: true,
    },
    knowledge: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Settings = mongoose.models.Settings || model("Settings", settingsSchema);
export default Settings;

import mongoose, { model, Schema } from "mongoose";

interface settingsInterface {
  ownerID: string;
  bussinessName: string;
  supportEmail: string;
  knowledge: {
    text?: string;
    pdfUrl?: string;
  };
}

const settingsSchema = new Schema<settingsInterface>(
  {
    ownerID: {
      type: String,
      required: true,
    },
    bussinessName: {
      type: String,
      required: true,
    },
    supportEmail: {
      type: String,
      required: true,
    },
    knowledge: {
      text: {
        type: String,
      },
      pdfUrl: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

const Settings = mongoose.models.Settings || model("Settings, settingsSchema");
export default Settings;

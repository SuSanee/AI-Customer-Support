"use client";
import axios from "axios";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DashboardClient({ ownerId }: { ownerId: string }) {
  const navigate = useRouter();
  const handleNavigateHome = () => {
    navigate.push("/");
  };
  const [businessName, setBusinessName] = useState<string>("");
  const [supportEmail, setSupportEmail] = useState<string>("");
  const [knowledge, setKnowledge] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saved, setsaved] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string>("");
  const [removePdf, setRemovePdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSettings = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ownerId", ownerId);
      formData.append("businessName", businessName);
      formData.append("supportEmail", supportEmail);
      formData.append("knowledge", knowledge);
      if (removePdf) formData.append("removePdf", "true");
      if (pdfFile) formData.append("pdf", pdfFile);

      const result = await axios.post("/api/settings", formData);
      if (result.data.pdfName) setPdfName(result.data.pdfName);
      if (removePdf) setPdfName("");
      setRemovePdf(false);
      setPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setsaved(true);
      setTimeout(() => setsaved(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const navigateChatbot = () => {
    navigate.push("/embed")
  }

  useEffect(() => {
    if (!ownerId) return;
    const handleGetDetails = async () => {
      try {
        const result = await axios.post("/api/settings/get", {
          ownerId,
        });
        setBusinessName(result.data.businessName);
        setSupportEmail(result.data.supportEmail);
        setKnowledge(result.data.knowledge);
        setPdfName(result.data.pdfName || "");
      } catch (error) {
        console.error(error);
      }
    };
    handleGetDetails();
  }, []);
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="text-lg font-semibold tracking-tight"
            onClick={handleNavigateHome}
          >
            Snippet <span className="text-zinc-400">AI</span>
          </div>
          <button className="px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition" onClick={navigateChatbot}>
            Embed ChatBot
          </button>
        </div>
      </motion.div>
      <div className="flex justify-center px-4 py-14 mt-10">
        <motion.div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10">
          <div className="mb-10">
            <h1 className="text-2xl font-semibold">ChatBot Settings</h1>
            <p className="text-zinc-500 mt-1">
              Manage your AI chatbot knowledge and business details
            </p>
          </div>
          <div className="mb-10">
            <h1 className="text-lg font-medium mb-4">Business Details</h1>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus-ring-2 focus:ring-black/80"
                placeholder="Business Name"
                onChange={(e) => setBusinessName(e.target.value)}
                value={businessName}
              />
              <input
                type="text"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus-ring-2 focus:ring-black/80"
                placeholder="Support Email"
                onChange={(e) => setSupportEmail(e.target.value)}
                value={supportEmail}
              />
            </div>
          </div>
          <div className="mb-10">
            <h1 className="text-lg font-medium mb-4">Knowledge Base</h1>
            <p className="text-sm text-zinc-500 mb-4">
              Add FAQs, policies, delivery info, refunds, etc
            </p>
            <div>
              <textarea
                className="w-full h-32 rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus-ring-2 focus:ring-black/80"
                placeholder={`Example:
  • Refund policy: 7 days return available
  • Delivery time: 3–5 working days
  • Cash on Delivery available
  • Support hours: 24/7`}
                onChange={(e) => setKnowledge(e.target.value)}
                value={knowledge}
              />
            </div>
          </div>
          <div className="mb-10">
            <h2 className="text-lg font-medium mb-2">PDF Document</h2>
            <p className="text-sm text-zinc-500 mb-4">
              Upload a PDF to give your chatbot deeper context (max 5MB, 1 file)
            </p>
            {(pdfName && !removePdf) || pdfFile ? (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50">
                <span className="text-xl">📄</span>
                <span className="text-sm flex-1 truncate">
                  {pdfFile ? pdfFile.name : pdfName}
                </span>
                <button
                  type="button"
                  className="text-red-500 text-sm font-medium hover:underline cursor-pointer"
                  onClick={() => {
                    setPdfFile(null);
                    setRemovePdf(true);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition">
                <span className="text-3xl">📎</span>
                <span className="text-sm text-zinc-500">Click to upload a PDF</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert("PDF must be under 5MB");
                        return;
                      }
                      setPdfFile(file);
                      setRemovePdf(false);
                    }
                  }}
                />
              </label>
            )}
          </div>
          <div className="flex items-center gap-5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-sinc transition disabled:opacity-60"
              disabled={loading}
              onClick={handleSettings}
            >
              {loading ? "Saving..." : "Save"}
            </motion.button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-emerald-600"
              >
                ✔ Settings Saved
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

type OrderFormProps = {
  orderId: string;
  productIndex: number;
  productName: string;
  onClose: () => void;
};

export default function OrderForm({ orderId, productIndex, productName, onClose }: OrderFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images to Sanity
      const uploadedImageRefs: string[] = [];
      for (const file of images) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "image");

        const res = await fetch("/api/sanity/upload", { method: "POST", body: formData });
        const data = await res.json();
        uploadedImageRefs.push(data.assetId);
      }

      // Save review
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify({
          orderId,
          productIndex,
          rating,
          comment,
          images: uploadedImageRefs,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to submit review");

      onClose();
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Review {productName}</h2>

        <label className="block mb-2 font-medium">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full border rounded p-2 mb-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} Star{num > 1 && "s"}</option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        <label className="block mb-2 font-medium">Upload Images</label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="mb-4" />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

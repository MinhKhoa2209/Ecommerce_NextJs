"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface OrderFormProps {
  orderId: string;
  productKey: string;
  productName: string;
  onClose: () => void;
  review?: {
    rating: number;
    comment: string;
    images: string[];
  };
}

export default function OrderForm({
  orderId,
  productKey,
  productName,
  onClose,
  review,
}: OrderFormProps) {
  const [rating, setRating] = useState<number>(review?.rating ?? 0);
  const [comment, setComment] = useState<string>(review?.comment ?? "");
  const [images, setImages] = useState<string[]>(review?.images ?? []);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        productKey,
        rating,
        comment,
        images,
      }),
    });
    setLoading(false);

    if (res.ok) {
      onClose();
    } else {
      alert("Failed to save review");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {review ? "Update Review" : "Leave Feedback"} for {productName}
        </h2>

        {/* Rating */}
        <div className="mb-4">
          <p className="mb-1 font-medium">Rating:</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <p className="mb-1 font-medium">Comment:</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-md p-2"
            rows={3}
          />
        </div>

        {/* Images */}
        <div className="mb-4">
          <p className="mb-1 font-medium">Images:</p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="mb-2"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          <div className="flex gap-2 flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt="review img"
                  className="w-16 h-16 object-cover rounded"
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== idx))
                  }
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
  
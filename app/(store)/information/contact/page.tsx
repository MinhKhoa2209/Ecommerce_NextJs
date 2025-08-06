import React from 'react';

export default function ContactPage() {
  return (
    <div className="bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you are looking for product info or need support — we are here to help. Let us start a conversation.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-4 items-start">
          {/* Contact Info */}
          <div className="space-y-6 pr-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <p className="text-gray-600">khoadm.23it@vku.udn.vn</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Phone</h2>
              <p className="text-gray-600">(+84) 905-076-967</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Address</h2>
              <p className="text-gray-600">Hoa Vang, Da Nang, Viet Nam</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Social</h2>
              <a
                href="https://www.facebook.com/minh.khoa.523830/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Google Map */}
          <div className="rounded-lg shadow-lg overflow-hidden h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245374.5338213938!2d107.85705136729052!3d16.066678558680394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421de147a91f35%3A0x2024b073a69cadbe!2sH%C3%B2a%20Vang%2C%20Da%20Nang%2C%20Vietnam!5e0!3m2!1sen!2s!4v1754464134399!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

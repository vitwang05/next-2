import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="mt-16 bg-white text-black shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Về chúng tôi */}
          <div>
            <h3 className="text-lg font-bold mb-4">VỀ CHÚNG TÔI</h3>
            <div className="border-b border-gray-700 w-10 mb-4" />
            <p className="mb-2">
              <span className="font-bold">Hotline:</span> 0123456789
            </p>
            <p className="mb-2">
              <span className="font-bold">Email:</span>{" "}
              sneakervietnam.co@gmail.com
            </p>
            <p className="mb-2">
              <span className="font-bold">Địa chỉ:</span> 256 Ngọc Lâm, Long Biên, Hà Nội
            </p>
          </div>
          {/* Chính sách */}
          <div>
            <h3 className="text-lg font-bold mb-4">CHÍNH SÁCH</h3>
            <div className="border-b border-gray-700 w-10 mb-4" />
            <ul className="space-y-2">
              <li>Chính Sách Vận Chuyển</li>
              <li>Chính Sách Thanh Toán</li>
              <li>Chính Sách Đổi Hàng Và Bảo Hành</li>
            </ul>
          </div>
          {/* Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-lg font-bold mb-4">HỖ TRỢ KHÁCH HÀNG</h3>
            <div className="border-b border-gray-700 w-10 mb-4" />
            <ul className="space-y-2">
              <li>Thông Tin Liên Hệ</li>
              <li>Kiểm Tra Đơn Hàng</li>
              <li>Hướng Dẫn Đặt Hàng</li>
            </ul>
          </div>
          {/* Mạng xã hội */}
          <div>
            <h3 className="text-lg font-bold mb-4">MẠNG XÃ HỘI</h3>
            <div className="border-b border-gray-700 w-10 mb-4" />
            <div className="flex gap-4 mt-4">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:scale-110 transition"
              >
                <FaFacebookF size={20} />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:scale-110 transition"
                style={{
                  background:
                    "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                }}
              >
                <FaInstagram size={20} />
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener"
                aria-label="TikTok"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:scale-110 transition"
              >
                <FaTiktok size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Sneaker Vietnam. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "./utils/supabaseClient";
import {
  FaHeartbeat,
  FaBrain,
  FaChartLine,
  FaArrowUp,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";

export default function App() {
  const [showScroll, setShowScroll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-800 scroll-smooth">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white">NutriKids‑Expert</h1>
          </div>
          <nav className="hidden md:flex space-x-6 items-center">
            {user && (
              <a
                href="/history"
                className="text-white hover:underline"
              >
                Riwayat Diagnosa
              </a>
            )}
            {["Beranda", "Fitur", "Tentang"].map((item) => (
              <a
                key={item}
                href={item === "Beranda" ? "#" : `#${item.toLowerCase()}`}
                className="text-white hover:underline"
              >
                {item}
              </a>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="text-white hover:underline flex items-center space-x-1"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            )}
          </nav>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-2xl text-white">
              <FaBars />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col space-y-2 bg-rose-500">
            {user && (
              <a
                href="/history"
                className="text-white hover:underline"
              >
                Riwayat Diagnosa
              </a>
            )}
            {["Beranda", "Fitur", "Tentang"].map((item) => (
              <a
                key={item}
                href={item === "Beranda" ? "#" : `#${item.toLowerCase()}`}
                className="text-white hover:underline"
              >
                {item}
              </a>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="text-white hover:underline flex items-center space-x-1"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-grow bg-gradient-to-br from-orange-100 to-yellow-200 flex items-center py-20 px-4"
      >
        <div className="max-w-3xl mx-auto text-center">
          <img
            src="/assets/logo-expert.png"
            alt="NutriKids Expert Logo"
            className="mx-auto h-44 md:h-52 lg:h-56 mb-6"
          />
          <h2 className="text-4xl md:text-5xl font-extrabold text-rose-600 mb-4 leading-tight">
            Sistem Pakar Gizi Anak
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            NutriKids‑Expert adalah sistem pakar berbasis standar WHO. Diagnosis
            instan dan rekomendasi tepat hanya dalam hitungan detik!
          </p>
          {user ? (
            <div className="space-y-4">
              <a
                href="/diagnosis-forward"
                className="block bg-green-500 hover:bg-rose-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition"
              >
                Diagnosis Forward Chaining.
              </a>
            </div>
          ) : (
            <a
              href="/login"
              className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition"
            >
              Login untuk Diagnosis
            </a>
          )}
        </div>
      </motion.section>

      {/* Features */}
      <section id="fitur" className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-rose-600 mb-8"
          >
            Keunggulan NutriKids‑Expert
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: <FaHeartbeat />, 
                title: "Akurat & Berdasarkan WHO",
                desc: "Menggunakan standar Z-Score WHO untuk hasil yang valid dan terpercaya.",
              },
              {
                icon: <FaBrain />,
                title: "Berbasis Forward & Backward Chaining",
                desc: "Teknik inferensi cerdas untuk mendiagnosis status gizi secara sistematis.",
              },
              {
                icon: <FaChartLine />,
                title: "Visualisasi & Rekomendasi",
                desc: "Hasil diagnosis ditampilkan jelas, lengkap dengan rekomendasi nutrisi.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-orange-50 p-6 rounded-lg shadow hover:shadow-xl transition"
              >
                <div className="text-4xl text-rose-600 mb-4">{item.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section
        id="tentang"
        className="bg-gradient-to-r from-yellow-100 to-orange-200 py-20 px-4"
      >
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-rose-600 mb-6">
            Tentang NutriKids‑Expert
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            Website ini membantu orang tua dan tenaga kesehatan memantau
            pertumbuhan anak berdasarkan data ilmiah. Dengan sistem pakar,
            pengambilan keputusan nutrisi jadi lebih cepat, cerdas, dan
            terpercaya.
          </p>
        </motion.div>
      </section>

      {/* Scroll to Top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition"
        >
          <FaArrowUp />
        </button>
      )}

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} NutriKids‑Expert. Untuk masa depan anak Indonesia.
        </div>
      </footer>
    </div>
  );
}

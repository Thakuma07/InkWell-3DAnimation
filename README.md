# INKWELL | Progressive 3D Interactive Archive

Inspired by the [Inkwell](https://inkwell.tech/) Intelligence Layer, this project represents a synthesis of architectural precision and fluid digital interaction. It is a high-performance, immersive 3D image gallery that redefines how archives are explored in a web environment.

![Inkwell Archive Preview](public/images/website%20preview%20img.png)

## 🖋️ The Vision

Digital archives often feel static and disconnected. Inspired by the **SOTD-winning aesthetics** of premium design systems, Inkwell transforms mathematical coordinate systems into an organic, living interface. It bridges the gap between raw data (images) and human ingenuity through movement.

---

## ✨ Features

- **Intelligence Layer (Proximity Engine)**: Utilizing squared-distance mathematics to detect cursor/touch proximity, creating a "magnetic" attraction effect that flips and scales elements in real-time.
- **Architectural 3D Layout**: A radial distribution system that leverages hardware-accelerated CSS 3D transforms for a "Physical Space" feel without the overhead of heavy WebGL libraries.
- **Micro-Interaction System**: 
  - **Desktop**: Silky-smooth hover response with lerp-based smoothing.
  - **Mobile**: Continuous auto-rotation with "Active Zone" flipping—cards intelligently respond as they pass the viewer's focal point.
- **Deep Zoom Preview**: A high-speed transition system using GSAP and SplitType to reveal metadata and high-resolution imagery with brutalist typographic flair.
- **Performance-First Design**: Achieving consistent 60+ FPS through expensive math pre-calculation and DOM interaction throttling.

## 🚀 Tech Stack

- **Vanilla JavaScript (ES6+)**: Core state management and modular architecture.
- **GSAP (GreenSock Animation Platform)**: Orchestrating complex 3D timelines and smooth interpolation.
- **Inter (Variable)** & **Space Grotesk**: Localized premium typography for a state-of-the-art visual identity.
- **Vite**: Modern frontend tooling for rapid development and optimized builds.
- **CSS 3D Engine**: Leverages `preserve-3d`, `perspective`, and hardware-accelerated transforms.

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd inkwell-3d-gallery
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🧠 Performance Optimizations

The gallery is engineered to handle massive interactions with minimal CPU/GPU overhead:

- **Mathematical Positioning**: Eliminates costly `getBoundingClientRect()` calls by using a coordinate-based tracking system relative to the screen center.
- **Animation Culling**: Only "active" cards process proximity logic, drastically reducing the number of calculations per frame.
- **Modular Interaction**: Mobile and Desktop logic are decoupled into isolated modules (`src/mobile.js`) for cleaner execution and smaller runtime footprints.

## 👨‍💻 Author

- **Thakuma07** - [GitHub](https://github.com/Thakuma07)

---

*“AI is changing the way we approach... we use that same philosophy to change how you approach digital galleries.”*

# LUMINA | Interactive 3D Image Gallery

LUMINA is a high-performance, immersive 3D image gallery inspired by high-end archival exhibition designs. It features a fluid, hover-driven interface built with WebGL principles (implemented via CSS 3D transforms) and the GreenSock Animation Platform (GSAP).

![Lumina Archive Preview](public/images/website%20preview%20img.png)

## ✨ Features

- **Interactive 3D Carousel**: A radial gallery that responds to mouse proximity and movement.
- **Micro-Interaction System**: Cards flip and scale dynamically based on cursor distance using advanced mathematical proximity detection.
- **Deep Zoom Preview**: Click any card to transition into a immersive preview mode with silky-smooth GSAP transitions.
- **High-Performance Architecture**: 
  - Throttled interaction loops to reduce CPU overhead.
  - Pre-calculated trigonometry to minimize runtime math.
  - Squared distance calculations for faster proximity detection.
  - Hardware-accelerated CSS transforms using backface-visibility and translate3d hardware triggers.
- **Premium Aesthetics**: A "Paper & Ink" design language featuring a sophisticated off-white palette and high-quality grotesque typography (Suisse Intl / Inter).

## 🚀 Tech Stack

- **Vanilla JavaScript (ES6+)**: Core logic and state management.
- **GSAP (GreenSock Animation Platform)**: Handles complex timeline transitions and lerp-based smoothing.
- **SplitType**: Used for delicate text entrance animations in preview mode.
- **CSS 3D Transforms**: Leverages hardware acceleration for ultra-smooth 60+ FPS performance.
- **Vite**: Modern frontend tooling for rapid development and optimized builds.

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🧠 Performance Optimizations

The gallery is designed to handle dozens of interactive elements simultaneously. Key optimizations include:

- **Mathematical Positioning**: Avoids expensive DOM `getBoundingClientRect` calls by calculating positions mathematically relative to the screen center.
- **Animation Culling**: Cards only process animation logic when they are "active" (hovered or returning to state), saving processing power for static elements.
- **CSS Containment**: Uses `contain: layout paint` to isolate element updates, preventing full-page layout reflows during hover events.

## 👨‍💻 Author

- **Thakuma07** - [GitHub](https://github.com/Thakuma07)

---

*Experimenting with the boundaries of WebGL-inspired CSS interactions.*

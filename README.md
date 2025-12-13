# 🏝️ Warisan Nusantara: Madura Language Translator

> **Eksplorasi Budaya Madura melalui Teknologi Neural Machine Translation**

![Project Banner](static/images/madura_landscape_hero.jpg)

## 📖 About The Project

**Warisan Nusantara** is a web-based application designed to preserve and promote the Madurese language and culture. At its core, it features a **Neural Machine Translation (NMT)** model capable of accurate bidirectional translation between **Indonesian** and **Madura** language.

This project goes beyond simple translation by serving as a digital cultural showcase. It integrates modern web technologies with traditional aesthetics, featuring:
- **Interactive 3D Visuals**: A particle-based 3D scene powered by Three.js.
- **Cultural Identity**: A design philosophy rooted in Madurese heritage (Batik and Maritime themes).
- **Accessibility**: Advanced Speech-to-Text capabilities for easier interaction.

**Academic Context**
This project was developed as a Final Project for the **Natural Language Processing (NLP)** course by **Kelompok I - Teknologi Sains Data, Universitas Airlangga**.

## ✨ Key Features

### 🤖 Intelligent Translation & Speech
* **🔄 Bidirectional NMT**: Powered by **HuggingFace Transformers** and **PyTorch**, the model provides accurate translation from Indonesian to Madura and vice versa.
* **🎙️ Advanced Speech-to-Text (STT)**: Integrated with **OpenAI Whisper (Small Model)**. This upgrade allows for significantly better recognition of Indonesian and Madurese dialects compared to standard models, complete with real-time error feedback and robust **FFmpeg** processing.

### 🎨 Immersive Cultural UI/UX
* **Modern Aesthetics**: A professional color palette combining a **Maroon** base with **Gold (Batik)** and **Teal (Maritime)** accents, replacing generic styles with true Madurese vibrancy.
* **Batik Integration**: Backgrounds infused with subtle geometric Madurese batik motifs.
* **Visual Experience**:
    * **3D Particle System**: Interactive geometric animations using `Three.js`.
    * **Dark Mode 2.0**: Optimized for readability with lighter backgrounds (`#1a1212`) and refined card opacity.
    * **Glassmorphism**: Modern, frosted-glass UI elements with clean, professional borders.

## 🛠️ Technology Stack

### Backend & AI
* **Python**: Core programming language.
* **Flask**: Web framework for serving the application and API.
* **PyTorch**: Deep learning framework used for the NMT model.
* **Transformers**: Library for the translation model architecture.
* **OpenAI Whisper**: State-of-the-art Speech-to-Text model.
* **FFmpeg**: Essential tool for audio processing and conversion.

### Frontend
* **HTML5 & CSS3**: Custom styling with a focus on responsive, cultural design.
* **JavaScript (ES6+)**: Dynamic interactions and API handling.
* **Three.js**: Rendering 3D cultural scenes and particle animations.
* **FontAwesome**: For UI icons.

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Python 3.8+
* pip (Python package manager)
* **FFmpeg**: Must be installed on your system and added to PATH (required for Whisper STT).

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/addaan1/indo-madura-nlp](https://github.com/addaan1/indo-madura-nlp)
    cd indo-madura-nlp
    ```

2.  **Create a Virtual Environment (Recommended)**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Application**
    ```bash
    python app.py
    ```

5.  **Access the Web App**
    Open your browser and navigate to: `http://127.0.0.1:5000`

## 📂 Project Structure

```text
NLP-Final-Project/
├── app.py              # Main Flask application
├── utils.py            # Helper functions (translation logic, Whisper audio processing)
├── requirements.txt    # Python dependencies
├── static/             # Static assets
│   ├── css/            # Stylesheets (style.css, opening.css)
│   ├── js/             # JavaScript files (3d_scene.js, animations.js)
│   └── images/         # Image assets
└── templates/          # HTML templates
    ├── base.html       # Base layout
    └── index.html      # Main landing page
```

## 👥 Authors

**Kelompok I — Teknologi Sains Data, Universitas Airlangga**

* **Ghaly Anargya Azzam Rifqi Nahindra** - *Model Development*
* **Sahrul Adicandra Effendy** - *Backend & Frontend Development*
* **Adinda Syarifatul Muna** - *Team Management & Model Development*
* **Fatma Hidayatul Khusna** - *Project Coordination*
* **Pradipta Deska Pryanda** - *Idea & Inspiration*

## 📝 Catatan Pengumpulan Final Project

**Identitas Kelompok**
* **Nomor Kelompok**: Kelompok I
* **Asal**: Teknologi Sains Data, Universitas Airlangga
* **Judul Project**: Warisan Nusantara: Madura Language Translator

**Ringkasan Library Utama**
1. **Flask**: Web Server.
2. **Transformers**: Model Architecture.
3. **PyTorch**: Deep Learning Framework.
4. **OpenAI Whisper**: Speech-to-Text Engine.
5. **FFmpeg**: Audio Processing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br>
<p align="center">
  <i>Created with ❤️ for Indonesian Culture</i>
</p>
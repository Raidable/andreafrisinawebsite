# Andrea Frisina | Filmmaker Portfolio CMS

A custom-built, lightweight, and dynamic portfolio developed for filmmaker and DP Andrea Frisina. This project is designed to provide a high-end cinematic experience while maintaining a fully decoupled content management system through JSON.

---

## Video Preview


https://github.com/user-attachments/assets/0c0474cd-bad2-42be-9f67-82aef8429948



<img width="1912" height="907" alt="immagine" src="https://github.com/user-attachments/assets/e9fcd0b0-d148-45b3-ae62-51711281d595" />
<img width="1877" height="900" alt="immagine" src="https://github.com/user-attachments/assets/bf598a5a-2252-4404-b667-9b771f9e0f6b" />
<img width="1840" height="848" alt="immagine" src="https://github.com/user-attachments/assets/ce5ebe8b-e697-46c1-8bb7-c2cdbb95fd0c" />


## Key Features

* **JSON-Driven CMS**: The entire site is dynamic. Content (videos, descriptions, and photos) is managed through external JSON files, allowing for updates without modifying the core HTML/CSS.
* **Intelligent Media Handling**:
    * **Aspect Ratio Control**: Supports both `16:9` (cinematic) and `9:16` (vertical/social) formats within the same interface.
    * **Multi-Source Video**: Seamlessly integrates YouTube, Vimeo, and local MP4 files.
    * **Embed vs Link Toggle**: A custom `"external_link"` flag in the JSON determines whether a video opens in a branded modal or redirects to an external platform.
* **Infinite Marquee Photography**: A bespoke infinite-scroll system for the photography section with high-performance lazy loading and Lightbox integration.
* **Performance Optimized**: Zero heavy frameworks. Built with Vanilla JS for fast execution and smooth CSS3 transitions.

---

## Tech Stack

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

---

## Project Structure

```text
├── css/                # Custom UI components and responsive layouts
├── js/                 # Content fetch engines and modal logic
├── html/               # Entire HTML
├── dynamic/            # JSON data sources (recent_works, photography, etc.)
├── media/              # Locally hosted assets and posters






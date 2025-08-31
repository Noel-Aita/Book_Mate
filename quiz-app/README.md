BookMate Quiz App
Overview
BookMate Quiz is an interactive learning and quiz platform designed to help users test their knowledge across various categories. The app features:
• Single-player and multi-player quiz modes
• Multiple choice questions fetched from an external API (OpenTDB) with local fallback
• Realistic blog section on every page for daily insights
• Navigation between Home, Login, Player Setup, Category Selection, Quiz, and Result screens
• Responsive design with dynamic background images
The app is built with React, Vite, and React Router for smooth navigation.

---

Features

1. User Authentication
   o Users log in or sign up to start the quiz.
   o Login status is maintained throughout the quiz flow.
2. Player Setup
   o Single-player or multi-player selection.
   o Setup page allows customization before starting the quiz.
3. Category & Difficulty Selection
   o Users select a category (Science, Technology, etc.) and difficulty (Easy, Medium, Hard).
   o Selection guides question fetching from the API.
4. Quiz Functionality
   o Displays multiple choice questions with Next, Previous, and Back navigation buttons.
   o Submit button shows results after completing all questions.
   o Tracks user score automatically.
   o Uses local questions fallback if API fails.
5. Result Screen
   o Shows the total score and number of questions answered.
   o Navigation buttons to retry or go back to Home.
6. Blogs
   o Each page displays daily blogs with images and short descriptions.
   o Realistic content to keep learners engaged.
7. Responsive Design
   o Works across desktop and mobile.
   o Background images are dynamically displayed per section.

---

Tech Stack
• Frontend: React, JSX, CSS Modules, Vite
• Routing: React Router
• APIs: OpenTDB for quiz questions, optional dictionary API for word definitions
• Deployment: Vercel (static site hosting)

---

Project Structure
src/
├─ components/
│ ├─ HomeScreen.jsx
│ ├─ LoginScreen.jsx
│ ├─ PlayerSetup.jsx
│ ├─ CategorySelection.jsx
│ ├─ QuizScreen.jsx
│ ├─ ResultScreen.jsx
│ └─ \*.module.css
├─ data/
│ └─ localQuestions.js
├─ utils/
│ └─ decodeHtml.js
├─ App.jsx
└─ main.jsx
public/
├─ images/
│ ├─ blog1.jpg
│ ├─ blog2.jpg
│ ├─ blog3.jpg
│ └─ background.jpg
index.html
package.json
README.md

---

Installation

1. Clone the repository
   git clone https://github.com/yourusername/BookMate-Quiz.git
   cd BookMate-Quiz
2. Install dependencies
   npm install
3. Run locally
   npm run dev
   Open http://localhost:5173 in your browser.
4. Build for production
   npm run build
   npm run preview

---

Usage

1. Open the app and click Login / Signup.
2. Choose Single or Multi-player mode.
3. Select your category and difficulty.
4. Answer the quiz questions using Next / Previous / Back buttons.
5. Submit the quiz to see your results.
6. Read blogs on any page for extra knowledge.

---

Error Handling
• API fails: Local questions are used automatically.
• Navigation errors: All routes use React Router with protected routes.
• Missing assets: Ensure images are placed in /public/images/.

---

Deployment

1. Push the repository to GitHub.
2. Import the project to Vercel.
3. Set build command: npm run build
4. Output directory: dist
5. Deploy and verify live site: all pages, quiz functionality, blogs, and images.Though it keeps throwing me errors when I deploy on Vercel

---

Future Enhancements
• User accounts with persistent scores and leaderboards.
• Dark mode toggle.
• Additional quiz categories.
• Dictionary definitions integrated directly on quiz questions.

---

Credits
• Open Trivia Database (OpenTDB) for questions API
• ReactJS and Vite teams for frontend frameworks
• Free images for blogs and backgrounds

I can boldly say working on this app has been the hardest and yet the most soul touching for, the app may not yet be 100% complete
but i feel fullfilled that I pushed it this far.

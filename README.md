# RideShare Planner - Interactive Carpool Coordinator Dashboard

An interactive, premium single-page web application (SPA) built using zero-dependency HTML5, CSS3, and JavaScript. It helps coordinate trip travel by car, allows easy participant registration, and visually maps passengers to drivers.

## Features

- **📊 Live Trip Statistics:** Real-time updates showing total travelers, drivers count, open capacity, unassigned passengers count, and match percentage completion.
- **📝 Role-Specific Registration:** Input forms dynamically adjust based on selected roles:
  - **Drivers:** Capture car model/details, notes, and seating capacity (excluding driver).
  - **Passengers:** Capture food bringing status (Yes/No), details of food being brought, and special request notes.
- **✨ One-Click Demo Data:** Pre-populate the app with realistic passenger and driver data to immediately try it out.
- **🎛️ Dual-Mode Assignments:**
  - **Drag-and-Drop:** Drag passenger cards from the "Unassigned" column directly onto any car card to match them.
  - **Accessibility Dropdowns:** Choose a driver from a dropdown selection next to each passenger, or assign passengers from a car card's seats grid.
- 💾 **Local Persistence:** Automatically saves all registrations and assignments in browser `localStorage`.
- 🌐 **Multi-Language toggle:** Seamlessly toggle between English (`?lang=en`) and Traditional Chinese/Mandarin (`?lang=zh`) UI languages.
- 🔗 **URL-Based Sharing:** Generate a special link containing your full carpool data to share and open instantly on other devices without any database setup.
- 📥 **Data Exports/Imports:** Export and import files in **JSON** to back up or migrate your configurations, or export to **CSV** (compatible with Google Sheets/Excel).
- 🖨️ **Clean Print Style:** Stylesheet formatting triggers clean, printer-friendly matching reports when printing or saving as PDF.

## How to Run the App

Since this is a client-side web application with no build steps, running it is simple:

1. **Direct Browser Execution:**
   Double-click the `index.html` file inside the `carpool-coordinator` directory. It will open directly in Google Chrome, Safari, Firefox, or Microsoft Edge.
   
2. **Local Python Server (Optional):**
   If you prefer to run it on a local server, run the following command in your terminal from this directory:
   ```bash
   python3 -m http.server 8000
   ```
   Then navigate to:
   - English: `http://localhost:8000/?lang=en`
   - Mandarin: `http://localhost:8000/?lang=zh`

## 🚀 How to Host on the Web (GitHub Pages)

To access the app on your phone 24/7 without keeping your computer's terminal open:

1. Create a free public repository on [github.com](https://github.com/) named `carpool-coordinator` (be sure to check **Add a README file**).
2. Click **Add file** -> **Upload files** on GitHub.
3. Drag and drop `index.html`, `styles.css`, and `app.js` into the browser upload box, then click **Commit changes**.
4. Go to **Settings** -> **Pages** in your repository.
5. Set the branch dropdown to `main` and click **Save**.
6. Your site will be live at `https://your-username.github.io/carpool-coordinator/`!

---

> [!TIP]
> **Active Workspace Recommendation:**
> Since this project is initialized in `/Users/lichi/.gemini/antigravity/scratch/carpool-coordinator`, you can set this subdirectory as your active workspace in your IDE to keep files and modifications grouped neatly!

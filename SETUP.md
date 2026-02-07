# Quick Setup Guide 🚀

## Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: `http://localhost:3000`

## Testing the Application

### User Flow:
1. **Landing Page** (`/`)
   - Click "Start My Journey"

2. **Onboarding** (`/onboarding`)
   - Select domain: Frontend/Backend/Fullstack
   - Rate your skills (1-5 stars)
   - Enter projects completed
   - Set placement timeline
   - Submit to go to dashboard

3. **Dashboard** (`/dashboard`)
   - View your Readiness Score
   - See skill levels and progress
   - Click "View Full Roadmap"

4. **Roadmap** (`/roadmap`)
   - Click checkbox next to "Internet Basics"
   - **Test modal will open automatically**
   - Answer 5 questions
   - Submit test
   - If score ≥ 70%, topic gets verified ✅
   - Continue with next topics

5. **Mock Tests** (`/mock-tests`)
   - Choose any topic
   - Take standalone test
   - View results

6. **Resources** (`/resources`)
   - Browse learning materials by topic
   - Free and paid resources

7. **Rankings** (`/ranking`)
   - View your percentile
   - Compare with college average

8. **Placements** (`/placements`)
   - Browse internships and full-time roles

9. **News** (`/news`)
   - Latest tech and placement news

## Key Features to Demo

### 1. Smart Roadmap
- Topics unlock based on prerequisites
- Auto-triggered tests on completion
- Verification system (70% pass rate)

### 2. Progress Tracking
- Live readiness score calculation
- Skill level visualization
- Weakness detection

### 3. Mock Tests
- Topic-wise assessments
- Immediate feedback
- Score display

## Mock Login (Optional)
- Navigate to `/login`
- Enter any email/password
- Redirects to dashboard

## Data Persistence
- User data saved in `localStorage`
- Persists between sessions
- Clear browser data to reset

## Build for Production
```bash
npm run build
npm start
```

## Troubleshooting

### Port already in use
```bash
npm run dev -- -p 3001
```

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
npm run build
```
This will show any type errors that need fixing.

## Tech Stack Reminder
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **TypeScript**
- **Lucide Icons**

## File Structure Quick Reference
```
app/           → Pages & routes
components/    → Reusable UI components
lib/           → Mock data & utilities
public/        → Static assets
```

## Ready for Hackathon Demo! 🎉

Your MVP is ready to present. Show judges:
1. Clean UI/UX
2. Smart roadmap with auto-tests
3. Progress tracking
4. Comprehensive feature set
5. Easy to extend

## Next Steps (Post-Hackathon)
- Add Supabase for backend
- Integrate OpenAI for AI features
- Deploy to Vercel
- Add real authentication
- Connect to job APIs

---

**Questions?** The code is well-commented. Check individual files for implementation details!

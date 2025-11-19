# Plant Sensor Dashboard

A mobile and web interface for monitoring houseplants with real-time sensor data and AI-powered health analysis.

## Features

- 📸 **Photo Capture**: Take photos or upload images of your plants
- 🤖 **AI Plant Identification**: Powered by Google Gemini Vision API
- 💾 **Database Storage**: SQLite with Prisma ORM for data persistence
- 📊 **Sensor Monitoring**: Track temperature, humidity, light, and soil moisture
- 🎨 **Premium UI**: Dark theme with glassmorphism effects
- 📱 **Responsive Design**: Works on mobile and desktop

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/plant-sensor-dashboard.git
cd plant-sensor-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   DATABASE_URL="file:./dev.db"
   ```

4. Initialize the database:
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
plant-sensor-dashboard/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── plants/            # Plant detail pages
├── components/            # React components
├── lib/                   # Utilities and services
│   ├── db/               # Database client
│   └── geminiVision.ts   # AI plant identification
├── prisma/               # Database schema
└── public/               # Static assets
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for plant identification | Yes |
| `DATABASE_URL` | SQLite database connection string | Yes (auto-configured) |

### Using GitHub Secrets (for deployment)

If deploying with GitHub Actions or another CI/CD platform:

1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add secret:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key

Your deployment workflows will automatically have access to this secret.

## Technologies

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **AI**: Google Gemini Vision API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## API Routes

- `GET /api/plants` - List all plants
- `POST /api/plants` - Create plant with photo + AI identification
- `GET /api/plants/:id` - Get plant details
- `PUT /api/plants/:id` - Update plant
- `DELETE /api/plants/:id` - Remove plant
- `GET /api/plants/:id/image` - Get plant image

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

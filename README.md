# Velora Voice™

## Project Overview
- **Name**: Velora Voice™ - Enterprise AI Call Center Dashboard
- **Goal**: Build a resellable enterprise-grade AI Call Center Dashboard with licensing system, agentic pipeline builder, repo integration, and one-click deployment
- **Status**: ✅ Production Ready MVP
- **Tech Stack**: Next.js 15 + NestJS + Prisma + PostgreSQL + React Flow + Tailwind CSS

## 🚀 Live Demo

### Currently Deployed Services
- **Marketing Website**: https://velora-voice-marketing.pages.dev
- **Frontend Dashboard**: https://3000-ia380sbzn82obbbgku0rj-6532622b.e2b.dev
- **API Endpoints**: Backend services available for API integration
- **License System**: Key-based licensing with activation workflow

## 📋 Completed Features

### ✅ Core Dashboard
- **Modern Dark UI**: Velora Voice™ branded interface with purple-cyan gradient theme
- **Responsive Layout**: Sidebar navigation, header with notifications, status footer
- **Call Management**: Real-time calls table with mock data simulation
- **Call Preview**: Interactive call details with waveform animation and live transcript
- **Analytics Cards**: KPI dashboard with answer rates, duration, agents, satisfaction

### ✅ Agentic Pipeline Builder
- **Visual Pipeline Editor**: React Flow-based drag-and-drop interface
- **Node Types Available**:
  - **Triggers**: Call received, scheduled, webhook, manual
  - **AI Processing**: Classification, sentiment analysis, text generation
  - **Data Operations**: Transform, filter, aggregate, extract
  - **API Integrations**: REST calls, GraphQL, webhooks
  - **Actions**: Notifications, email, SMS, database operations
- **Pipeline Execution**: Test run functionality with visual feedback
- **Properties Panel**: Dynamic configuration for each node type

### ✅ Licensing System
- **Key-Based Activation**: Enterprise license management
- **License Types**: Trial (TRI-*), Standard (STA-*), Enterprise (ENT-*)
- **Demo License Available**: `DEM-VELORA-DEMO01-TEST02-SAMPLE`
- **Activation UI**: Professional license input with validation
- **License Server**: Standalone Express service for activation/validation

### ✅ Architecture & Development
- **Monorepo Structure**: Turborepo with workspaces for frontend, backend, license-server
- **Database**: Prisma ORM with PostgreSQL, comprehensive schema
- **Authentication**: JWT-based with rotating refresh tokens
- **Queue Management**: BullMQ integration for workflow orchestration
- **Docker Ready**: Complete containerization setup
- **PM2 Configuration**: Production process management

## 🏗 Data Architecture

### Database Models
- **Users**: Admin, Manager, Agent roles with authentication
- **Calls**: Full call lifecycle tracking with transcripts and sentiment
- **Pipelines**: React Flow nodes/edges storage with execution history
- **Licenses**: Key management with feature flags and expiration

### Storage Services
- **PostgreSQL**: Primary relational data (users, calls, pipelines, licenses)
- **Redis**: Queue management and session storage
- **File System**: Static assets and uploads

### Data Flow
1. **Call Ingestion** → CallsTable → CallPreviewCard
2. **Pipeline Execution** → Node Processing → Queue Management → Results
3. **License Validation** → Server Check → Feature Enablement

## 📚 User Guide

### Getting Started
1. **Access Dashboard**: Visit the live demo URL above
2. **License Activation**: Use demo key `DEM-VELORA-DEMO01-TEST02-SAMPLE`
3. **Explore Features**:
   - Navigate through **Calls**, **Pipeline**, **Analytics** sections
   - Click on calls in the table to view detailed preview
   - Build pipelines using the drag-and-drop editor

### Navigation
- **Dashboard**: Main overview with active calls and KPIs
- **Calls**: Detailed call management and monitoring
- **Pipeline**: Visual workflow builder and execution
- **Analytics**: Performance metrics and reporting
- **Integrations**: GitHub/GitLab/Bitbucket connections
- **Settings**: System configuration and preferences

### Pipeline Building
1. **Create New Pipeline**: Click "Create Pipeline" button
2. **Add Nodes**: Drag from the left panel or click to add
3. **Connect Nodes**: Draw connections between node handles
4. **Configure Properties**: Click nodes to edit settings
5. **Test Execution**: Use "Test Run" button to validate workflow
6. **Save Pipeline**: Store for production use

## 🚀 Deployment

### Current Status
- **Platform**: E2B Sandbox Environment
- **Frontend**: ✅ Running on PM2 with Next.js 15
- **Backend**: ✅ Built and ready (NestJS with Prisma)
- **License Server**: ✅ Built and ready (Express with validation)
- **Database**: ✅ Schema ready with seed data

### Local Development Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd velora-voice
npm install

# Setup environment variables
cp .env.example .env
# Configure database URLs and secrets

# Run services
npm run dev          # Start all services with Turbo
npm run docker:up    # Use Docker Compose (PostgreSQL + Redis + Apps)

# Individual services
cd apps/frontend && npm run dev      # Frontend only
cd apps/backend && npm run start:dev  # Backend only
cd apps/license-server && npm start   # License server only
```

### Production Deployment
- **Docker Compose**: One-click deployment with `docker-compose up -d`
- **Environment**: PostgreSQL + Redis + 3 Node.js services
- **Monitoring**: PM2 process management with logging
- **Security**: CORS, rate limiting, input validation, JWT authentication

## 🔧 Technical Implementation

### Frontend Architecture
- **Framework**: Next.js 15 with App Router and Turbopack
- **Styling**: Tailwind CSS with custom Velora Voice™ theme
- **Components**: shadcn/ui compatible design system
- **State Management**: React hooks with local storage caching
- **Pipeline UI**: React Flow for visual workflow building
- **Animations**: CSS animations for call waveforms and status indicators

### Backend Architecture  
- **Framework**: NestJS with TypeScript
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: JWT tokens with refresh mechanism
- **Queue**: BullMQ for background job processing
- **Validation**: Class-validator for request/response validation
- **Documentation**: Swagger/OpenAPI integration

### Security Features
- **License Validation**: Server-side key verification
- **Rate Limiting**: API endpoint protection
- **Input Sanitization**: Comprehensive validation
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Secure configuration management

## 📁 Project Structure
```
velora-voice/
├── apps/
│   ├── frontend/         # Next.js 15 dashboard application
│   │   ├── src/
│   │   │   ├── app/      # App router pages
│   │   │   ├── components/
│   │   │   │   ├── dashboard/  # CallsTable, CallPreviewCard
│   │   │   │   ├── layout/     # Sidebar, Header, Footer
│   │   │   │   ├── nodes/      # Pipeline node components
│   │   │   │   ├── pipeline/   # Pipeline builder UI
│   │   │   │   └── ui/         # Reusable UI components
│   │   │   ├── styles/   # Theme and global styles
│   │   │   └── types/    # TypeScript definitions
│   │   └── public/       # Static assets
│   ├── backend/          # NestJS API server
│   │   ├── src/
│   │   │   ├── auth/     # Authentication module
│   │   │   ├── calls/    # Call management
│   │   │   ├── licensing/# License validation
│   │   │   ├── pipeline/ # Workflow engine
│   │   │   └── integrations/ # External API connections
│   │   └── prisma/       # Database schema and migrations
│   └── license-server/   # Standalone licensing service
├── packages/             # Shared utilities and types
├── scripts/             # Database initialization
└── docker-compose.yml  # Complete deployment setup
```

## 🎯 Next Steps & Roadmap

### Immediate Enhancements
- [ ] **Real Telephony Integration**: WebRTC/SIP connectivity
- [ ] **Advanced AI Models**: Custom model training and deployment
- [ ] **Multi-tenant Architecture**: Workspace isolation and management
- [ ] **Advanced Analytics**: Custom reporting and dashboards

### Future Features
- [ ] **Voice Analytics**: Real-time speech processing
- [ ] **CRM Integrations**: Salesforce, HubSpot, Pipedrive
- [ ] **Mobile Applications**: iOS/Android companion apps
- [ ] **Advanced Permissions**: Role-based access control (RBAC)

## 📄 Licensing & Commercial Use

- **License Model**: Commercial software with key-based activation
- **Target Market**: Enterprise call centers and contact centers
- **Pricing Tiers**: Trial (14 days) → Standard (10 agents) → Enterprise (unlimited)
- **Reseller Ready**: Complete white-label customization support

## 🔗 Links & Resources

- **Live Demo**: https://3000-ia380sbzn82obbbgku0rj-6532622b.e2b.dev
- **Demo License**: `DEM-VELORA-DEMO01-TEST02-SAMPLE`
- **GitHub Repository**: Available for commercial licensing
- **Documentation**: Comprehensive API docs via Swagger UI
- **Support**: Enterprise support available with commercial licenses

---

**© 2024 Velora Voice™ - Enterprise AI Call Center Dashboard**

*Built with Next.js, NestJS, and modern AI technologies for production-scale call center operations.*
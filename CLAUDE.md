# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint with Airbnb config and Prettier

## Architecture

This is a Next.js 14 application for real estate investment simulation built with:

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **UI**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for investment data visualization
- **Language**: TypeScript with strict mode

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components organized by type
  - `ui/` - shadcn/ui base components (Button, Input, Card, etc.)
  - `forms/` - Form components (InvestmentForm, PriceForm)
  - `charts/` - Chart components (InvestmentChart)
- `src/lib/` - Utility functions and shared logic
  - `utils.ts` - Tailwind utility functions
  - `schemas.ts` - Zod validation schemas
  - `formatters.ts` - Currency and percentage formatters
- `src/types/` - TypeScript type definitions
  - `investment.ts` - Investment data interfaces

### Key Patterns
- Uses shadcn/ui component system with `@/` path aliases
- Form validation with Zod schemas and React Hook Form
- Investment calculations include project costs, financing, rental income, and projections
- All monetary values handled as numbers with proper formatting utilities
- CSS variables for theming with HSL color system
- French language interface for real estate terms

### Data Model
The application models real estate investments through:
- `ProjectCost` - Purchase price, renovation, fees
- `Financing` - Loan details, interest rates, cash purchases
- `RentalIncome` - Monthly rent, charges, vacancy rates
- `Projection` - Holding period, appreciation, resale calculations
- `CalculationResults` - Computed yields, cash flow, ROI metrics

### Component Architecture
- Form components use controlled inputs with Slider components for numeric ranges
- Investment data flows from form to calculation engine to chart visualization
- shadcn/ui components provide consistent styling and accessibility
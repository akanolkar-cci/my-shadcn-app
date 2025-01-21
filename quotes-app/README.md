# Quotes Project

This is a  Next.js 15 project styled using **ShadCN UI** with **Tailwind CSS**.

## Features
- A simple, modern UI designed using ShadCN components.
- Tailwind CSS for utility-first styling.
- Optimized for Next.js 15, using the app directory structure.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16 or above): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js): Check your version using `npm -v`

## Installation

Follow the steps below to set up the project locally.

### 1. Clone the Repository

First, clone the repository:

```
git clone https://github.com/akanolkar-cci/my-shadcn-app.git
cd quotes-app
```

###  2. Install Dependencies

Run the following command to install all the necessary dependencies:
```
npm install
```

This will install:
- Next.js and React for the app framework.
- Tailwind CSS for styling.
- ShadCN UI and its peer dependencies (e.g., Radix UI, Lucide React) for reusable UI components.

### 3. Run the Development Server

Start the development server:
```
npm run dev
```
By default, the app will be available at 'http://localhost:3000/'. 

## Project Structure
```plaintext
quotes-app/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js app directory
│   │   └── page.tsx        # Main page component
│   ├── components/         # Reusable UI components
│   │   └── ui/
│   │       └── button.tsx  # ShadCN UI Button component
│   ├── types/              # General types for the project
│   │   └── index.ts        # Type definitions
│   ├── styles/
│   │   └── globals.css     # Tailwind CSS entry point
│   └── utils/              # Utility functions
├── tailwind.config.js      # Tailwind CSS configuration
├── next.config.js          # Next.js configuration
└── package.json            # Project dependencies and scripts
```

## ShadCN UI Components
This project uses ShadCN UI for UI components. Currently, there is a basic example of a Button component in src/components/ui/button.jsx. You can add more components as needed, following the same structure.

## Tailwind CSS
Tailwind CSS is set up with the default configuration in tailwind.config.js and the src/index.css file. You can modify the tailwind.config.js file to customize the theme or add plugins.

## Acknowledgements

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [**Next.js Documentation**](https://nextjs.org/docs) – Learn about Next.js features and API.
- [**ShadCN UI**](https://github.com/shadcn/ui) – Explore ShadCN UI and its reusable components.
- [**Tailwind CSS Documentation**](https://tailwindcss.com/docs) – Discover Tailwind CSS utility classes and configuration.
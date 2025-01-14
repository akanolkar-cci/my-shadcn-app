# My ShadCN App

This is a React app created with **Create React App (CRA)** and styled using **ShadCN UI** with **Tailwind CSS**.

## Features
- A simple UI with a button styled using ShadCN components.
- Tailwind CSS for utility-first styling.
- ShadCN UI components for reusable, modern UI elements.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16 or above): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js): Check your version using `npm -v`

## Installation

Follow the steps below to set up the project locally.

### 1. Clone the Repository

First, clone the repository:

```
git clone https://github.com/your-username/my-shadcn-app.git
cd my-shadcn-app
```

###  2. Install Dependencies

Run the following command to install all the necessary dependencies:
```
npm install
```

This will install:
- React and React DOM for the app framework.
- Tailwind CSS for styling.
- ShadCN UI and peer dependencies like Radix UI and Lucide React for UI components.

### 3. Start the Development Server

Run the development server to see the app in action:
```
npm start
```
By default, the app will be available at 'http://localhost:3000/'. 

## Project Structure
```plaintext
my-shadcn-app/
├── public/                 # Public assets
├── src/
│   ├── components/         # Reusable UI components (Button, etc.)
│   │   └── ui/
│   │       └── button.jsx  # ShadCN UI Button component
│   ├── App.js              # Main App component
│   ├── index.css           # Tailwind CSS entry point
│   └── index.js            # Entry point for the React app
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Project dependencies and scripts
```

## ShadCN UI Components
This project uses ShadCN UI for UI components. Currently, there is a basic example of a Button component in src/components/ui/button.jsx. You can add more components as needed, following the same structure.

## Tailwind CSS
Tailwind CSS is set up with the default configuration in tailwind.config.js and the src/index.css file. You can modify the tailwind.config.js file to customize the theme or add plugins.

## Acknowledgements

- [ShadCN UI](https://github.com/shadcn/ui) for providing modern, reusable UI components.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) for a fast React setup.

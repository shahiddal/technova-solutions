// liveUrl / githubUrl are optional: the Live Demo and GitHub buttons only show when set
export const projects = [
  {
    slug: "e-commerce-platform",
    icon: "🛒",
    title: "E-Commerce Platform",
    category: "Web Development",
    summary:
      "A modern and scalable e-commerce platform with product management, shopping cart and secure checkout.",
    description:
      "A modern and scalable e-commerce platform designed to provide customers with a smooth online shopping experience.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    features: [
      "Responsive product catalog",
      "Shopping cart",
      "Product management",
      "Customer accounts",
      "Order management",
      "Mobile-friendly interface",
    ],
    development: [
      "We started by mapping the full shopping journey, from browsing products to placing an order, and designed every screen mobile-first.",
      "The React frontend talks to a Node.js and Express REST API, while MongoDB stores products, customers and orders.",
      "An admin area lets the store team add products, update stock and track orders without touching code.",
    ],
    challenges: [
      "Keeping product pages fast with a large catalog",
      "Making checkout simple enough to reduce abandoned carts",
      "Giving non-technical staff an easy way to manage products",
    ],
    solutions: [
      "Paginated product APIs and optimized images for quick page loads",
      "A short, clear checkout flow with saved cart items",
      "A simple admin panel for products, stock and orders",
    ],
    results: [
      "Smooth shopping experience on mobile and desktop",
      "Faster product updates by the store team",
      "A scalable base ready for new features",
    ],
  },

  {
    slug: "business-management-system",
    icon: "📊",
    title: "Business Management System",
    category: "MERN Application",
    summary:
      "A complete business management application designed to manage customers, products and daily operations.",
    description:
      "A centralized business management application that helps teams organize operations and manage important business information.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    features: [
      "Dashboard",
      "User management",
      "Data management",
      "Reports",
      "REST API",
      "Responsive interface",
    ],
    development: [
      "We worked with the team to understand their daily operations and which information they needed in one place.",
      "The application was built with reusable React components and a structured REST API, with MongoDB models for customers, products and records.",
      "Role-based access makes sure each team member only sees the data they need.",
    ],
    challenges: [
      "Business data was spread across spreadsheets and tools",
      "Different team members needed different levels of access",
      "Managers needed quick summaries instead of raw data",
    ],
    solutions: [
      "One centralized database with a clean, searchable interface",
      "User roles and permissions for every module",
      "A dashboard and reports that summarize key numbers",
    ],
    results: [
      "All business information available in one platform",
      "Less time spent on manual data entry",
      "Clearer view of daily performance for managers",
    ],
  },

  {
    slug: "company-website",
    icon: "🌐",
    title: "Company Website",
    category: "Web Design",
    summary:
      "A modern responsive company website focused on performance, usability and professional branding.",
    description:
      "A professional corporate website designed to improve online presence and clearly present business services.",
    technologies: ["React", "Tailwind CSS", "JavaScript"],
    features: [
      "Responsive design",
      "Service pages",
      "Portfolio section",
      "Blog section",
      "Contact form",
      "Mobile navigation",
    ],
    development: [
      "We planned a simple site structure so visitors can find services, past work and contact details in a few clicks.",
      "The website was built with React and Tailwind CSS using reusable sections that keep the design consistent.",
      "A contact form sends enquiries straight to the business, and every page was tested on mobile, tablet and desktop.",
    ],
    challenges: [
      "The old website looked outdated and was hard to use on mobile",
      "Services were not explained clearly",
      "Visitors had no easy way to get in touch",
    ],
    solutions: [
      "A modern, mobile-first design with clear navigation",
      "Dedicated pages that explain each service",
      "A contact form and calls-to-action on every page",
    ],
    results: [
      "A professional brand image online",
      "Better experience for mobile visitors",
      "More enquiries through the contact form",
    ],
  },

  {
    slug: "task-management-app",
    icon: "✅",
    title: "Task Management App",
    category: "Web Application",
    summary:
      "A productivity application that helps users create, manage and track their daily tasks.",
    description:
      "A productivity application that helps teams organize tasks and manage their work efficiently.",
    technologies: ["React", "Node.js", "MongoDB"],
    features: [
      "Task creation",
      "Task status management",
      "User accounts",
      "Dashboard",
      "Responsive interface",
      "Data persistence",
    ],
    development: [
      "We focused on the few actions users repeat every day: adding a task, updating its status and seeing what is due.",
      "React components keep the interface quick to update, while a Node.js API and MongoDB store tasks for each user account.",
      "The dashboard groups tasks by status so users can see their progress at a glance.",
    ],
    challenges: [
      "Users wanted a tool that was quick, not cluttered",
      "Tasks had to stay saved across devices",
      "Progress was hard to see in long task lists",
    ],
    solutions: [
      "A minimal interface built around the most common actions",
      "User accounts with tasks stored in the database",
      "A status-based dashboard with clear progress views",
    ],
    results: [
      "Faster daily planning for users",
      "Tasks available on any device",
      "A clear overview of pending and completed work",
    ],
  },

  {
    slug: "learning-platform",
    icon: "🎓",
    title: "Learning Platform",
    category: "EdTech",
    summary:
      "An online learning platform where users can explore courses and manage their learning journey.",
    description:
      "An online learning platform designed to provide students with accessible educational content.",
    technologies: ["React", "Express.js", "Node.js", "MongoDB"],
    features: [
      "Course listing",
      "Learning content",
      "Student dashboard",
      "Responsive design",
      "User authentication",
      "Progress tracking",
    ],
    development: [
      "We designed the platform around the student journey: finding a course, learning step by step and tracking progress.",
      "Courses and lessons are stored in MongoDB and served through an Express API to a responsive React frontend.",
      "Each student gets a personal dashboard that shows enrolled courses and completed lessons.",
    ],
    challenges: [
      "Students needed to find relevant courses quickly",
      "Learning content had to be readable on small screens",
      "Students lost track of where they stopped",
    ],
    solutions: [
      "Organized course listings with clear categories",
      "Mobile-friendly lesson pages with readable typography",
      "Progress tracking that saves completed lessons",
    ],
    results: [
      "Easier access to learning content on any device",
      "Students can continue right where they left off",
      "A platform ready to add new courses",
    ],
  },

  {
    slug: "analytics-dashboard",
    icon: "📈",
    title: "Analytics Dashboard",
    category: "Dashboard",
    summary:
      "A clean and responsive analytics dashboard for visualizing business data and performance.",
    description:
      "A modern dashboard that presents business information through clear and easy-to-understand data views.",
    technologies: ["React", "JavaScript", "Tailwind CSS", "Node.js"],
    features: [
      "Dashboard widgets",
      "Data visualization",
      "Reports",
      "Responsive layout",
      "Reusable components",
      "Performance-focused UI",
    ],
    development: [
      "We identified the key numbers the business checks every day and designed the dashboard around them.",
      "Reusable React widgets display charts, totals and trends, styled consistently with Tailwind CSS.",
      "Data is loaded efficiently so the dashboard stays fast even with large reports.",
    ],
    challenges: [
      "Important numbers were hidden in long reports",
      "The dashboard had to work on laptops and tablets",
      "Large data sets made pages slow",
    ],
    solutions: [
      "Focused widgets that highlight the most important metrics",
      "A responsive grid layout that adapts to any screen",
      "Optimized data loading and lightweight components",
    ],
    results: [
      "Key business data visible in seconds",
      "Faster, data-driven decisions",
      "A flexible dashboard that is easy to extend",
    ],
  },
];

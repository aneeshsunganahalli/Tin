# <span style="color: #FF6B35;">Tin</span> - <span style="color: #4A90E2;">Express.js Project Generator</span>

<div align="center">

![Tin Project Logo](https://img.shields.io/badge/Tin-Express%20Generator-4A90E2?style=for-the-badge&logo=express&logoColor=white)
![Version](https://img.shields.io/badge/version-2.2.2-6495ED?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-44883e?style=for-the-badge&logo=node.js&logoColor=white)

<span style="color: #4A90E2; font-weight: bold;">A modern command-line tool for quickly scaffolding Express.js applications with TypeScript or JavaScript</span>

<span style="color: #666; font-style: italic;">Generate complete project structures with authentication, MongoDB integration, and best practices ready to use!</span>

</div>

---

## ✨ Features

 ### 🎯 Core Functionality  
> - ⚡ **Generate Express.js REST APIs** in one command  
> - 🔄 **Choose TypeScript or JavaScript** templates  
> - 🔒 **JWT Authentication** system included  
> - 📦 **MongoDB integration** with Mongoose  

 ### 🛠️ Developer Experience  
> - 🐳 **Optional Docker setup** generation  
> - 🚀 **Modular architecture** with best practices  
> - 🛠️ **Pre-configured development** environment  
> - 📝 **Error handling** middleware ready to use  

---

## <span style="color: #9B59B6;">📦 Installation</span>

### <span style="color: #27AE60;">Global Installation (Recommended)</span>
```bash
npm install -g create-tin
```

### <span style="color: #3498DB;">Using npx (No Installation Required)</span>
```bash
npx create-tin my-api-project
```

---

## <span style="color: #E74C3C;">🚀 Quick Start</span>

### <span style="color: #F39C12;">Create a New Project</span>
```bash
# Using the installed package
create-tin my-api-project

# Or using npx
npx create-tin my-api-project
```

### <span style="color: #8E44AD;">Interactive Setup Process:</span>
1. <span style="color: #2ECC71;">**Choose language**</span> (TypeScript or JavaScript)
2. <span style="color: #3498DB;">**Initialize Git repository**</span>
3. <span style="color: #E67E22;">**Set the server port**</span>
4. <span style="color: #1ABC9C;">**Add Docker configuration**</span>

---

## ⚙️ Command Line Options

```bash
Usage: create-tin [options] [project-name]

Options:
  --ts            Generate a TypeScript project template
  --js            Generate a JavaScript project template
  --git           Initialize a new Git repository
  --skip-git      Skip Git initialization
  --port <number> Set the server port (default: 3000)
  --docker        Include Docker configuration
  --skip-docker   Skip adding Docker configuration
  -h, --help      Display this help message
```


## <span style="color: #FF6B35;">💡 Example Usage</span>

```bash
# Create a TypeScript project with Git and Docker configuration
create-tin my-ts-api --ts --git --docker

# Create a JavaScript project without Git and Docker
create-tin my-js-api --js --skip-git --skip-docker --port 5000
```

---

## <span style="color: #4A90E2;">📁 Generated Project Structure</span>

<details>
<summary><span style="color: #9B59B6;"><strong>TypeScript Project Structure</strong></span></summary>

```
my-api-project/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   └── authController.ts
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   └── verifyToken.ts
│   ├── models/
│   │   └── userModel.ts
│   ├── routes/
│   │   └── authRoutes.ts
│   ├── types/
│   │   ├── constants.ts
│   │   └── index.d.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```
</details>

<details>
<summary><span style="color: #F39C12;"><strong>JavaScript Project Structure</strong></span></summary>

```
my-api-project/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── verifyToken.js
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   └── authRoutes.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
</details>

---

## <span style="color: #1ABC9C;">🐳 Docker Support</span>

<span style="color: #34495E;">When Docker configuration is enabled, the following files are generated:</span>

| <span style="color: #E74C3C;">File</span> | <span style="color: #2ECC71;">Description</span> |
|---------|-------------|
| <span style="color: #9B59B6;">`Dockerfile`</span> | Optimized multi-stage build |
| <span style="color: #3498DB;">`docker-compose.yml`</span> | Docker Compose setup |
| <span style="color: #F39C12;">`.dockerignore`</span> | Ignores unnecessary files |

---

## <span style="color: #E67E22;">🎯 Getting Started With Generated Projects</span>

<span style="color: #27AE60;">**After generating your project:**</span>

```bash
# Navigate to your project directory
cd my-api-project

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🌟 Features of Generated Projects

> 🏗️ **Express.js REST API**  
> Clean architecture structure ready to use  

> 🔐 **JWT Authentication**  
> Secure login and registration system  

> 📊 **MongoDB Integration**  
> Complete setup with Mongoose ODM  

> 🔧 **Environment Variables**  
> Configuration setup included  

> ⚠️ **Error Handling**  
> Professional middleware implementation  

> 📘 **TypeScript Support**  
> Type definitions (TypeScript template only)  


---

## <span style="color: #34495E;">⚡ Requirements</span>

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-≥16.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-≥8.0.0-CB3837?style=for-the-badge&logo=npm&logoColor=white)

</div>

---

## <span style="color: #2C3E50;">📄 License</span>

<div align="center">

<span style="color: #7F8C8D;">This project is licensed under the</span> <span style="color: #E74C3C;">**MIT License**</span><span style="color: #7F8C8D;">.</span>

</div>

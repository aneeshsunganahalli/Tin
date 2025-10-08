# Tin - Express.js Project Generator

<div align="center">

![Tin Project Logo](https://img.shields.io/badge/Tin-Express%20Generator-4A90E2?style=for-the-badge&logo=express&logoColor=white)
![Version](https://img.shields.io/badge/version-2.5.2-6495ED?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-44883e?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-orange?style=for-the-badge)
![Downloads](https://img.shields.io/npm/dm/create-tin?style=for-the-badge)

**A modern command-line tool for quickly scaffolding Express.js applications with TypeScript or JavaScript**

*Generate complete project structures with authentication, MongoDB integration, and best practices ready to use!*

[Installation](#-installation) • 
[Quick Start](#-quick-start) • 
[Features](#-features) • 
[Documentation](#-documentation) • 
[Contributing](CONTRIBUTING.md)

</div>

---

> **Tin** is the fastest way to scaffold production-ready Express.js projects with TypeScript or JavaScript. Whether you're building RESTful APIs, web applications, or microservices, Tin provides everything you need to get up and running quickly with battle-tested patterns and practices.

---

## ✨ Features

 ### 🎯 Core Functionality  
> - ⚡ **Generate Express.js REST APIs** in one command  
> - 🔄 **Choose TypeScript or JavaScript** templates  
> - 🔒 **Flexible Authentication Options:**  
>   - 🔑 **JWT Authentication** (header-based)  
>   - 🍪 **Cookie-based JWT** for enhanced security  
> - 📦 **MongoDB integration** with Mongoose  
> - 📚 **Swagger UI with OpenAPI documentation** (optional, dark mode)

 ### 🛠️ Developer Experience  
> - 🐳 **Optional Docker setup** generation  
> - 🚀 **Modular architecture** with best practices  
> - 🛠️ **Pre-configured development** environment  
> - 📝 **Error handling** middleware ready to use  
> - 🔐 **Auto-generated `.env` files** with secure defaults  

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
2. <span style="color: #E74C3C;">**Select authentication method**</span> (JWT or Cookie-based)
3. <span style="color: #3498DB;">**Initialize Git repository**</span>
4. <span style="color: #E67E22;">**Set the server port**</span>
5. <span style="color: #1ABC9C;">**Add Docker configuration**</span>

---

## ⚙️ Command Line Options

```bash
Usage: create-tin [options] [project-name]

Options:
  --ts            Generate a TypeScript project template
  --js            Generate a JavaScript project template
  --jwt           Use JWT-based authentication (tokens in Authorization header)
  --cookies       Use Cookie-based authentication (JWT stored in HTTP-only cookies)
  --git           Initialize a new Git repository
  --skip-git      Skip Git initialization
  --port <number> Set the server port (default: 3000)
  --docker        Include Docker configuration
  --skip-docker   Skip adding Docker configuration
  --swagger       Include Swagger UI with OpenAPI documentation (dark mode)
  --skip-swagger  Skip adding Swagger UI
  -h, --help      Display this help message
```

> **💡 Tip:** Use the `--swagger` flag to automatically add API documentation with Swagger UI to your project. The documentation comes pre-configured with a dark mode theme and includes example endpoints for authentication.


## <span style="color: #FF6B35;">💡 Example Usage</span>

```bash
# Create a TypeScript project with JWT auth, Git and Docker configuration
create-tin my-ts-api --ts --jwt --git --docker

# Create a JavaScript project with cookie-based auth without Git and Docker
create-tin my-js-api --js --cookies --skip-git --skip-docker --port 5000

# Create a TypeScript project with JWT auth, Git, Docker and Swagger UI
create-tin api-docs --ts --jwt --git --docker --swagger
```

### <span style="color: #3498DB;">Using Swagger UI in Your Project</span>

When you create a project with the `--swagger` flag, your API will automatically be configured with Swagger UI documentation. After starting your server, you can access the API documentation at:

```
http://localhost:PORT/api-docs
```

The documentation includes:
- Authentication endpoints (register, login)
- Interactive testing capabilities
- Request/response examples
- Dark mode UI for better readability
- Full-page responsive design

The Swagger UI integration is fully customizable:
- Edit the API specification in `src/docs/openapi.yaml`
- Customize the dark theme in `src/styles/swagger-dark.css`
- Configure Swagger UI options in `src/config/swagger.ts` (or `.js`)

---

## <span style="color: #2ECC71;">📚 API Documentation with Swagger UI</span>

If you choose to include Swagger UI when generating your project, your API will have built-in interactive documentation available at `/api-docs`.

### <span style="color: #3498DB;">Features</span>
- **Interactive API Explorer**: Test your API endpoints directly from the browser
- **Dark Mode UI**: Modern interface with dark theme for better readability
- **OpenAPI 3.0**: Documentation follows OpenAPI 3.0 specification
- **Authentication Documentation**: Includes auth endpoints with request/response examples
- **Fully Responsive**: Works well on all screen sizes
- **Customizable**: Easy to modify the OpenAPI spec to match your API

### <span style="color: #E67E22;">How to Use</span>
1. Start your server with `npm run dev` or `npm start`
2. Navigate to `http://localhost:PORT/api-docs` in your browser
3. Explore the interactive documentation
4. Test endpoints directly from the UI

### <span style="color: #9B59B6;">Customization</span>
- The OpenAPI specification file is located at `src/docs/openapi.yaml`
- CSS styling can be customized in `src/styles/swagger-dark.css`
- Configure Swagger UI options in `src/config/swagger.ts` (or `swagger.js`)

### <span style="color: #E74C3C;">Example Screenshot</span>

<div align="center">
  <img src="https://github.com/aneeshsunganahalli/Tin/blob/SwaggerUI/assets/Swagger-UI.png" alt="Swagger UI" width="80%">
  <br>
  <em>Swagger UI with Dark Mode Theme</em>
</div>

---

## <span style="color: #4A90E2;">📁 Generated Project Structure</span>

<details>
<summary><span style="color: #9B59B6;"><strong>TypeScript Project Structure</strong></span></summary>

```
my-api-project/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── swagger.ts (if Swagger UI option selected)
│   ├── controllers/
│   │   └── authController.ts
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   └── verifyToken.ts
│   ├── models/
│   │   └── userModel.ts
│   ├── docs/
│   │   └── openapi.yaml (if Swagger UI option selected)
│   ├── styles/
│   │   └── swagger-dark.css (if Swagger UI option selected)
│   ├── routes/
│   │   └── authRoutes.ts
│   ├── types/
│   │   ├── constants.ts
│   │   └── index.d.ts
│   └── index.ts
├── .env
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
│   │   ├── db.js
│   │   └── swagger.js (if Swagger UI option selected)
│   ├── controllers/
│   │   └── authController.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── verifyToken.js
│   ├── models/
│   │   └── userModel.js
│   ├── docs/
│   │   └── openapi.yaml (if Swagger UI option selected)
│   ├── styles/
│   │   └── swagger-dark.css (if Swagger UI option selected)
│   ├── routes/
│   │   └── authRoutes.js
│   └── index.js
├── .env
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

> 🔐 **Authentication Options**  
> Choose between:  
> - **JWT Authentication** - Traditional token-based auth via headers  
> - **Cookie-based JWT** - Enhanced security with HTTP-only cookies  

> 📊 **MongoDB Integration**  
> Complete setup with Mongoose ODM  

> 📚 **API Documentation**  
> - **Swagger UI Integration** - Interactive API explorer  
> - **Dark Mode Interface** - Modern and readable design  
> - **OpenAPI 3.0** - Comprehensive API specification  
> - **Pre-configured Auth Routes** - Ready to test and extend  

> 🔧 **Environment Variables**  
> - **Auto-generated `.env`** - Ready to use with secure JWT secrets  
> - **Context-aware configuration** - Adapts to Docker, Swagger, and port settings  
> - **`.env.example` included** - Template for deployment reference  

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

## 🤔 Why Choose Tin?

- **Fast Development Start**: Get a fully configured Express.js project in seconds
- **Production Ready**: Templates follow industry best practices and security standards
- **Flexibility**: Use either TypeScript or JavaScript based on your preference
- **Modern Stack**: Uses the latest stable versions of Node.js, Express, and MongoDB
- **Docker Integration**: Optional containerization with Docker and Docker Compose
- **Complete Authentication**: JWT authentication system ready to use
- **Active Maintenance**: Regular updates and security patches

## 🔄 Comparison with Alternatives

| Feature | Tin | Express Generator | Create React App |
|---------|-----|-------------------|-----------------|
| TypeScript Support | ✅ | ❌ | ✅ |
| JWT Authentication | ✅ | ❌ | ❌ |
| Cookie-based Auth | ✅ | ❌ | ❌ |
| MongoDB Integration | ✅ | ❌ | ❌ |
| Swagger UI / API Docs | ✅ | ❌ | ❌ |
| Dark Mode UI | ✅ | ❌ | ❌ |
| Docker Support | ✅ | ❌ | ❌ |
| Interactive CLI | ✅ | ❌ | ✅ |
| Git Integration | ✅ | ❌ | ✅ |

## 📄 License

This project is licensed under the **ISC License**.
---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/aneeshsunganahalli">Aneesh Sunganahalli</a></sub>
</div>

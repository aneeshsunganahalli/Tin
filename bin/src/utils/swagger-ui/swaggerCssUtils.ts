import fs from 'fs-extra';
import path from 'path';

/**
 * Creates a CSS file for styling Swagger UI in dark mode
 * @param targetPath - The target directory where the project is being created
 */
export async function createSwaggerCSSFile(targetPath: string): Promise<void> {
  const swaggerCssContent = `/* Swagger UI Dark Mode - Full Page Styling */
html, body {
  margin: 0;
  padding: 0;
  background-color: #1a1a1a;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

/* Hide the default Swagger UI top bar */
.swagger-ui .topbar {
  display: none;
}

/* Main container styling */
.swagger-ui {
  background-color: #1a1a1a;
  color: #ffffff;
  min-height: 100vh;
}

/* Headers and text styling */
.swagger-ui .info .title, 
.swagger-ui .info h1, 
.swagger-ui .info h2, 
.swagger-ui .info h3, 
.swagger-ui .info h4, 
.swagger-ui .info h5, 
.swagger-ui .opblock-tag, 
.swagger-ui .opblock .opblock-summary-operation-id, 
.swagger-ui .opblock .opblock-summary-path, 
.swagger-ui .opblock .opblock-summary-path__deprecated, 
.swagger-ui .opblock .opblock-summary-description, 
.swagger-ui .model-title, 
.swagger-ui .models-control,
.swagger-ui a.nostyle,
.swagger-ui .info li,
.swagger-ui .info p,
.swagger-ui .info table,
.swagger-ui .parameter__name,
.swagger-ui .parameter__type,
.swagger-ui .response-col_status,
.swagger-ui .response-col_description,
.swagger-ui table thead tr td,
.swagger-ui table thead tr th,
.swagger-ui .renderedMarkdown p {
  color: #ffffff !important;
}

/* Operation blocks styling */
.swagger-ui .opblock {
  background-color: #2d2d2d;
  border-radius: 4px;
  margin: 0 0 15px;
  border: none;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
}

.swagger-ui .opblock .opblock-summary {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.swagger-ui .opblock-description-wrapper,
.swagger-ui .opblock-external-docs-wrapper,
.swagger-ui .opblock-title_normal,
.swagger-ui .opblock .opblock-section-header {
  background-color: #2d2d2d;
  color: #ffffff;
}

.swagger-ui .opblock .opblock-section-header h4 {
  color: #ffffff;
}

.swagger-ui .opblock-body {
  background-color: #2d2d2d;
}

/* Table styling */
.swagger-ui table {
  color: #ffffff;
  background-color: #2d2d2d;
}

/* Form elements */
.swagger-ui input,
.swagger-ui select {
  background-color: #3c3c3c;
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.2);
}

/* Buttons */
.swagger-ui .btn {
  background-color: #4a4a4a;
  color: white;
}

/* Scheme container */
.swagger-ui .scheme-container {
  background-color: #2d2d2d;
  color: white;
  box-shadow: none;
  padding-top: 0;
  margin-top: 0;
}

/* Info section - reducing top padding */
.swagger-ui .info {
  margin-top: 0;
  padding-top: 10px;
}

/* Models section */
.swagger-ui section.models {
  background-color: #2d2d2d;
  border: 1px solid rgba(255,255,255,0.1);
}

.swagger-ui section.models.is-open h4 {
  color: #ffffff;
}

.swagger-ui .model-container, 
.swagger-ui section.models .model-container {
  background-color: #2d2d2d;
}

.swagger-ui .model-box {
  background-color: #3c3c3c;
}

.swagger-ui .model {
  color: #ffffff;
}

/* HTTP method colors */
.swagger-ui .opblock.opblock-get .opblock-summary {
  background-color: rgba(97, 175, 254, 0.1);
}

.swagger-ui .opblock.opblock-post .opblock-summary {
  background-color: rgba(73, 204, 144, 0.1);
}

.swagger-ui .opblock.opblock-put .opblock-summary {
  background-color: rgba(252, 161, 48, 0.1);
}

.swagger-ui .opblock.opblock-delete .opblock-summary {
  background-color: rgba(249, 62, 62, 0.1);
}

.swagger-ui .opblock.opblock-patch .opblock-summary {
  background-color: rgba(80, 227, 194, 0.1);
}

/* Fix for the wrapper */
#swagger-ui {
  background-color: #1a1a1a;
  min-height: 100vh;
  padding: 0.5rem 1rem;  /* Reduced top padding */
}

/* Wrapper top container - reduce spacing */
.swagger-ui .wrapper {
  padding: 0;
  max-width: 1460px;
}

/* Improving contrast for tab text */
.swagger-ui .tab li {
  color: #ffffff;
}

/* Make sure the authorize modal has proper styling */
.swagger-ui .dialog-ux .modal-ux {
  background: #2d2d2d;
  border: 1px solid rgba(255,255,255,0.1);
}

.swagger-ui .dialog-ux .modal-ux-header h3 {
  color: #ffffff;
}

.swagger-ui .dialog-ux .modal-ux-content {
  background: #2d2d2d;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #777;
}`;

  // Create the styles directory
  const stylesDir = path.join(targetPath, 'src', 'styles');
  await fs.ensureDir(stylesDir);

  // Write the CSS file
  await fs.writeFile(path.join(stylesDir, 'swagger-dark.css'), swaggerCssContent);
}
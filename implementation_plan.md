# Implementation Plan: PDF Medical Report Generation

You requested a feature to allow doctors and patients to generate and download comprehensive PDF medical reports directly from the system. This report will include vital history, anomalies, heart risk classifications, timestamps, and the AI-generated health analysis.

## User Review Required

> [!IMPORTANT]
> To generate high-quality PDFs on the frontend without relying heavily on complex backend PDF generation engines, I plan to use two popular libraries: `html2canvas` and `jspdf`. I will install these via `npm` in your frontend project. Do you approve of installing these dependencies and using this frontend-based approach?

## Proposed Changes

---

### Phase 1: Setup Dependencies

#### [COMMAND] Install Libraries
- Run `npm install jspdf html2canvas` inside the `MinorFrontend-main` directory.

### Phase 2: PDF Generation Logic

#### [NEW] `MinorFrontend-main/src/utils/pdfGenerator.js` (Optional/Helper)
- Create a utility function to handle the HTML-to-PDF conversion logic to keep the components clean. It will:
  - Take a target HTML element ID (e.g., the report container).
  - Use `html2canvas` to render it as an image.
  - Use `jsPDF` to place the image into an A4 sized PDF document.
  - Trigger the browser download automatically.

### Phase 3: Frontend UI Updates

#### [MODIFY] `MinorFrontend-main/src/Pages/PatientDetail.jsx`
- Add a new **"Download Report (PDF)"** button in the header section next to the "Edit Patient" and "View Summary" buttons. Use a Lucide React icon like `FileText` or `Download`.
- Wrap the entire main content area (or create a dedicated report structure) with a specific `id` (e.g., `id="patient-report"`). This area includes:
  - Patient Details (Name, Age, Ward, Bed).
  - Vitals Grid.
  - AI Classification & Reasoning (from previous XAI feature).
  - Trend Charts.
  - Medical History and Doctor Notes.
- Add an `onClick` handler to the download button to trigger the PDF generation utility targeting the `patient-report` ID.

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
- Navigate to the `PatientDetail` page.
- Click the "Download Report (PDF)" button.
- Verify that a file named `Patient_Report_[PatientName].pdf` is downloaded to the local machine.
- Open the PDF and verify that it clearly shows the vitals, AI reasoning, and timestamps without cutting off crucial information.

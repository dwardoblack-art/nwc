import fs from "node:fs";
import { legalDocuments } from "../lib/legal-documents";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
const document = legalDocuments.privacy;
const sections = document.sections.map((section) => `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p></section>`).join("\n");
fs.writeFileSync("sites/policies/dist/index.html", `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Privacy Policy | Newworld Cargo</title><meta name="description" content="Privacy policy and account deletion information for the Newworld Cargo mobile app."><link rel="stylesheet" href="style.css"></head>
<body><header><strong>Newworld Cargo</strong><nav aria-label="Policies"><a href="index.html" aria-current="page">Privacy policy</a><a href="delete-account.html">Delete account</a></nav></header><main><h1>Privacy Policy</h1><p class="date">${escapeHtml(document.effectiveDate)}</p><p>${escapeHtml(document.summary)}</p>${sections}<p><a href="delete-account.html">Request account and personal data deletion</a></p></main><footer>Newworld Cargo &middot; <a href="mailto:info@newworldcargo.com">Contact privacy support</a></footer></body></html>\n`);
console.log("Exported privacy policy from the in-app source.");
